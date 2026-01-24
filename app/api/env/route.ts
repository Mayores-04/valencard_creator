import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const fromName = process.env.FROM_NAME || null;
    const fromEmail = process.env.FROM_EMAIL || null;
    return NextResponse.json({ fromName, fromEmail });
  } catch (err) {
    return NextResponse.json({ fromName: null, fromEmail: null });
  }
}
