import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getUploads } from '../../uploadStore';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const sessionId = parts[parts.length - 1];
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', sessionId);
    const exists = await fs.promises.stat(uploadsDir).then(() => true).catch(() => false);

    const filesFromFs = exists ? await fs.promises.readdir(uploadsDir).then(files => files.map(f => `/uploads/${sessionId}/${f}`)) : [];
    const filesFromStore = getUploads(sessionId) || [];

    // Merge and dedupe, preserving filesystem URLs first
    const merged = Array.from(new Set([...filesFromFs, ...filesFromStore]));
    return NextResponse.json({ files: merged });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
