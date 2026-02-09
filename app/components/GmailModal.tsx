import React from 'react';
import { Button } from '@/app/components/ui/button';

interface GmailModalProps {
  open: boolean;
  recipientEmail: string;
  setRecipientEmail: (s: string) => void;
  emailSubject: string;
  setEmailSubject: (s: string) => void;
  emailBody: string;
  setEmailBody: (s: string) => void;
  sendingEmail: boolean;
  onClose: () => void;
  onSend: () => void;
}

export default function GmailModal({
  open,
  recipientEmail,
  setRecipientEmail,
  emailSubject,
  setEmailSubject,
  emailBody,
  setEmailBody,
  sendingEmail,
  onClose,
  onSend,
}: GmailModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg bg-[#0b1220] border border-gray-700 rounded-lg p-4 md:p-6 shadow-lg">
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-100">Send Card via Gmail</h3>
        <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
          <input className="w-full p-2 rounded bg-[#071028] text-sm md:text-base text-gray-100 border border-gray-700" placeholder="Recipient email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} />
          <input className="w-full p-2 rounded bg-[#071028] text-sm md:text-base text-gray-100 border border-gray-700" placeholder="Subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
          <textarea className="w-full p-2 rounded bg-[#071028] text-sm md:text-base text-gray-100 border border-gray-700" rows={4} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose} className="text-sm md:text-base">Cancel</Button>
          <Button onClick={onSend} disabled={sendingEmail || !recipientEmail} className="text-sm md:text-base">
            {sendingEmail ? 'Sending…' : 'Send '}
          </Button>
        </div>
      </div>
    </div>
  );
}
