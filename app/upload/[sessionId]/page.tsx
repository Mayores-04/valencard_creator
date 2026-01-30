import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage({ params }: { params: { sessionId: string } }) {
  const session = params.sessionId;
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
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
        setStatus('Upload successful');
        // optional: redirect to a simple success page or keep listing
        setTimeout(() => router.refresh(), 500);
      } else {
        setStatus('Upload failed');
      }
    } catch (err) {
      setStatus('Upload error');
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
    </div>
  );
}
