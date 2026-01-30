import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { addUpload } from '../uploadStore';
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

    // If Cloudinary creds are present, upload to Cloudinary and return the secure URL
    const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
    const API_KEY = process.env.CLOUDINARY_API_KEY;
    const API_SECRET = process.env.CLOUDINARY_API_SECRET;
    if (CLOUD_NAME && API_KEY && API_SECRET) {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        // sign folder and timestamp
        const paramsToSign = `folder=${session}&timestamp=${timestamp}`;
        const signature = crypto.createHash('sha1').update(paramsToSign + API_SECRET).digest('hex');
        const dataUrl = `data:${(file as any)?.type || 'image/png'};base64,${buffer.toString('base64')}`;

        const formData = new FormData();
        formData.append('file', dataUrl);
        formData.append('folder', session);
        formData.append('timestamp', String(timestamp));
        formData.append('api_key', API_KEY);
        formData.append('signature', signature);

        const resp = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData as any,
        });
        const json = await resp.json();
        if (json?.secure_url) {
          try { addUpload(session!, json.secure_url); } catch (e) { /* ignore */ }
          return NextResponse.json({ ok: true, url: json.secure_url });
        }
        // if Cloudinary upload failed, fall through to filesystem attempt
        console.warn('[api/upload] cloudinary upload failed', json);
      } catch (e) {
        console.warn('[api/upload] cloudinary upload exception', String(e));
      }
    }

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
