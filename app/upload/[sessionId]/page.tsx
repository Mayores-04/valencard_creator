"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage({ params }: { params: { sessionId: string } }) {
  const session = params.sessionId;
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setStatus('Choose a file first');
    setStatus('Uploading...');
    const form = new FormData();
    form.append('file', file);
    form.append('session', session);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const body = await res.json();
      if (body.ok) {
        if (body.url) {
          setStatus(`Upload successful: ${body.url}`);
          setDataUrl(null);
          setTimeout(() => router.refresh(), 500);
        } else if (body.dataUrl) {
          setStatus('Upload succeeded (data URL fallback)');
          setDataUrl(body.dataUrl);
        } else {
          setStatus('Upload succeeded (unknown response)');
        }
      } else {
        setStatus(`Upload failed: ${body.error || JSON.stringify(body)}`);
        console.error('Upload failed response', body);
      }
    } catch (err) {
      setStatus(`Upload error: ${String(err)}`);
      console.error('Upload exception', err);
    }
  };

  return (
    <div style={{ padding: 20, background: '#071028', color: '#eee', minHeight: '100vh' }}>
      <h2>Upload to session: {session}</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
        <div style={{ marginTop: 10 }}>
          <button type="submit" style={{ padding: '8px 12px' }}>Upload</button>
        </div>
      </form>
        <div style={{ marginTop: 12 }}>{status}</div>
        {dataUrl && (
          <div style={{ marginTop: 12 }}>
            <div>Preview:</div>
            <img src={dataUrl} alt="uploaded" style={{ maxWidth: '100%', borderRadius: 8, marginTop: 8 }} />
            <div style={{ marginTop: 8 }}>
              <button onClick={() => {
                navigator.clipboard.writeText(dataUrl);
                setStatus('Data URL copied to clipboard');
              }} style={{ padding: '8px 12px' }}>
                Copy URL
              </button>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.9 }}>
              If this page is deployed to a serverless host (read-only filesystem), copy the Data URL and paste it into the desktop editor's image URL input.
            </div>
          </div>
        )}
    </div>
  );
}
