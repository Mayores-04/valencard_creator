import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getUploads, markDeleted, getDeleted } from '../../uploadStore';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const sessionId = parts[parts.length - 1];
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', sessionId);
    const exists = await fs.promises.stat(uploadsDir).then(() => true).catch(() => false);

    const filesFromFs = exists ? await fs.promises.readdir(uploadsDir).then(files => files.map(f => `/uploads/${sessionId}/${f}`)) : [];
    const filesFromStore = getUploads(sessionId) || [];

    // Try Cloudinary listing when credentials are available
    const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
    const API_KEY = process.env.CLOUDINARY_API_KEY || process.env.API_KEY;
    const API_SECRET = process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET;
    let cloudinaryFiles: string[] = [];
    if (CLOUD_NAME && API_KEY && API_SECRET) {
      try {
        // Use admin resources listing with basic auth
        const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
        const resp = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/upload?prefix=${encodeURIComponent(sessionId)}&max_results=100`, {
          headers: { Authorization: `Basic ${auth}` }
        });
        const json = await resp.json();
        if (json?.resources && Array.isArray(json.resources)) {
          cloudinaryFiles = json.resources.map((r: any) => r.secure_url).filter(Boolean);
        }
      } catch (e) {
        console.warn('[api/uploads] cloudinary list failed', String(e));
      }
    }

    const deletedSet = getDeleted(sessionId);
    const merged = Array.from(new Set([...filesFromFs, ...filesFromStore, ...cloudinaryFiles]));
    const filtered = merged.filter(u => !deletedSet.has(u));
    return NextResponse.json({ files: filtered, debug: { filesFromFs, filesFromStore, cloudinaryFiles, deleted: Array.from(deletedSet) } });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const sessionId = parts[parts.length - 1];
    const body = await req.json().catch(() => ({} as any));
    const target: string | undefined = body?.url || body?.target;
    if (!target) return NextResponse.json({ error: 'missing url' }, { status: 400 });
    markDeleted(sessionId, String(target));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
