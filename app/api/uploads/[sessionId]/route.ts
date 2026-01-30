import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const sessionId = parts[parts.length - 1];
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', sessionId);
    const exists = await fs.promises.stat(uploadsDir).then(() => true).catch(() => false);
    if (!exists) return NextResponse.json({ files: [] });

    const files = await fs.promises.readdir(uploadsDir);
    const urls = files.map(f => `/uploads/${sessionId}/${f}`);
    return NextResponse.json({ files: urls });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
