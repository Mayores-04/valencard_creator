import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { to, subject, body, dataUrl } = await req.json();
    if (!to || !subject || !dataUrl) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromName = process.env.FROM_NAME;
    const fromEmail = process.env.FROM_EMAIL;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json({ error: 'SMTP not configured on server' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: { user: smtpUser, pass: smtpPass },
    });

    // dataUrl is expected like: data:image/png;base64,AAAA...
    const matches = /^data:(.+);base64,(.*)$/.exec(dataUrl);
    if (!matches) return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    const mimeType = matches[1];
    const base64Data = matches[2];

    const fromHeader = fromEmail ? (fromName ? `${fromName} <${fromEmail}>` : fromEmail) : smtpUser;

    const mailOptions: any = {
      from: fromHeader,
      to,
      subject,
      text: body || '',
      attachments: [
        {
          filename: 'card.png',
          content: Buffer.from(base64Data, 'base64'),
          contentType: mimeType,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('send-email error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
