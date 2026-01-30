import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { addUpload } from '../uploadStore';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const session = form.get('session') as string | null;
    console.log('[api/upload] received upload, session=', session, 'file=', file ? file.name : null);

    if (!file || !session) return NextResponse.json({ error: 'missing file or session' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', session);
    try {
      await fs.promises.mkdir(uploadsDir, { recursive: true });

      // sanitize filename
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filename = `${Date.now()}-${safeName}`;
      const filePath = path.join(uploadsDir, filename);

      await fs.promises.writeFile(filePath, buffer);

      const url = `/uploads/${session}/${filename}`;
      try { addUpload(session, url); } catch (e) { /* ignore */ }
      return NextResponse.json({ ok: true, url });
    } catch (writeErr) {
      // likely running in a serverless/read-only filesystem (e.g., Vercel).
      // Fallback: return base64 data URL so client can use it immediately.
      console.warn('[api/upload] write failed, falling back to data URL', writeErr);
      const b64 = buffer.toString('base64');
      const mime = (file as any)?.type || 'image/png';
      const dataUrl = `data:${mime};base64,${b64}`;
      try { addUpload(session, dataUrl); } catch (e) { /* ignore */ }
      return NextResponse.json({ ok: true, dataUrl });
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
