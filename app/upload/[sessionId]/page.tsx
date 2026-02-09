"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage(props: any) {
  const { params } = props || {};
  const [session, setSession] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const serverPath = `/upload/${session}`;
  const [displayUrl, setDisplayUrl] = useState<string>(serverPath);

  useEffect(() => {
    if (params) {
      if (typeof params.then === 'function') {
        (params as Promise<any>).then((p) => {
          if (p?.sessionId) setSession(String(p.sessionId));
        }).catch(() => {
          if (typeof window !== 'undefined') setSession(window.location.pathname.split('/').pop() || '');
        });
      } else if (params.sessionId) {
        setSession(String(params.sessionId));
      }
    } else if (typeof window !== 'undefined') {
      setSession(window.location.pathname.split('/').pop() || '');
    }
  }, [params]);

  // update visible URL after client mounts so we don't read window during server render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        setDisplayUrl(window.location.href);
      } catch (e) {
        setDisplayUrl(`/upload/${session}`);
      }
    } else {
      setDisplayUrl(`/upload/${session}`);
    }
  }, [session]);

  const handleFileChange = (f: File | null) => {
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setDataUrl(String(reader.result || ''));
      reader.readAsDataURL(f);
    } else {
      setDataUrl(null);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!file) return setStatus('Choose a file first');
    setUploading(true);
    setStatus('Uploading...');
    const form = new FormData();
    form.append('file', file);
    form.append('session', session);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const body = await res.json();
      if (body.ok) {
        setStatus('Upload successful');
        setFile(null);
        setTimeout(() => router.refresh(), 500);
      } else {
        setStatus(`Upload failed: ${body.error || JSON.stringify(body)}`);
        console.error('Upload failed response', body);
      }
    } catch (err) {
      setStatus(`Upload error: ${String(err)}`);
      console.error('Upload exception', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071028] text-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Upload Photo to Card</h1>
          <p className="text-sm text-gray-300 mt-1">Session: <span className="font-mono text-xs text-cyan-300">{session}</span></p>
        </div>

        <div className="bg-[#081226] rounded-lg border border-gray-700 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="file" className="block text-sm font-medium text-gray-200 mb-2">Select or Take Photo</label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-transparent">
                {dataUrl ? (
                  <img src={dataUrl} alt="preview" className="max-h-64 object-contain rounded-md" />
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="text-lg">No photo selected</div>
                    <div className="text-xs mt-1">Tap the button below to choose or take a photo from your phone.</div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <input ref={inputRef} id="file" type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} />
                <button onClick={() => inputRef.current?.click()} className="px-4 py-2 bg-[#26C4E1] text-[#071028] rounded-md font-medium">Choose / Take Photo</button>
                <button onClick={() => handleSubmit()} disabled={uploading || !file} className={`px-4 py-2 rounded-md font-medium ${uploading || !file ? 'bg-gray-600 text-gray-400' : 'bg-[#a855f7] text-white'}`}>{uploading ? 'Uploading...' : 'Upload'}</button>
              </div>

              <div className="mt-3 text-sm text-gray-400">After upload, the image will appear automatically on your desktop editor canvas.</div>
            </div>

            <div className="w-64">
              <div className="bg-[#061224] p-3 rounded-md border border-gray-800 text-sm">
                <div className="font-semibold mb-2">How to use</div>
                <ol className="list-decimal list-inside text-gray-300">
                  <li>Scan the QR or open the session link from the desktop Tools &gt; Image &gt; Insert from Phone.</li>
                  <li>Choose or take a photo on your phone.</li>
                  <li>Tap Upload — your image will appear on the desktop canvas.</li>
                </ol>
                <div className="mt-3">
                  <a className="text-cyan-300 break-all text-xs" href={`/upload/${session}`}>{displayUrl}</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-300">{status}</div>
        </div>
      </div>
    </div>
  );
}
