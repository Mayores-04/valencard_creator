'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import * as Tabs from '@radix-ui/react-tabs';
import * as Slider from '@radix-ui/react-slider';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Separator from '@radix-ui/react-separator';
import * as ContextMenu from '@radix-ui/react-context-menu';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Heart, Star, Sparkles, Music, Coffee, Gift, Crown, Cake, Flower2, Sun, Moon, Cloud, Type, Check, ChevronDown, Upload, Image as ImageIcon, Copy, MoveUp, MoveDown, ArrowUpToLine, ArrowDownToLine, Trash2, MoreVertical, Download, Mail, RotateCw
} from 'lucide-react';
import { Template } from '@/app/templates/templateData';
import { 
  Sticker, 
  TextElement as TextElementType,
  UserImage,
  StickerElement,
  TextElementComponent,
  ImageElement,
  ResizeHandles,
  ShapeSelector,
  StickerGrid,
  BackgroundSelector,
  TextControls,
  ImageUploadPanel
} from '@/app/components/card';
import LayersPanel from '@/app/components/card/LayersPanel_fixed';
import {
  alphaStickers,
  loveStickers,
  iconStickers,
  solidColors,
  gradients,
  patterns,
  backgroundImages,
  fontFamilies,
  textTemplates,
} from '@/app/data';

interface CardEditorProps {
  template: string | null;
  templateData?: Template | null;
  zoom?: number;
  onRefReady?: (ref: any) => void;
}

type ElementType = 'sticker' | 'text' | 'image';
type ShapeType = 'rectangle' | 'circle' | 'heart' | 'star' | 'rounded';

export default function CardEditor({ template, templateData, zoom: externalZoom = 1, onRefReady }: CardEditorProps) {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [textElements, setTextElements] = useState<TextElementType[]>([]);
  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [resizing, setResizing] = useState<{ id: string; corner: string; type?: ElementType } | null>(null);
  const [rotating, setRotating] = useState<{ id: string; type: ElementType; startAngle: number; currentRotation: number } | null>(null);
  const [dragging, setDragging] = useState<{ id: string; type: ElementType; offsetX: number; offsetY: number } | null>(null);
  const [clipboard, setClipboard] = useState<{ data: any; type: ElementType } | null>(null);
  const [background, setBackground] = useState<string>(template || '#ffffff');
  const [panningImage, setPanningImage] = useState<{ id: string; startX: number; startY: number; initialOffset: {x: number; y: number} } | null>(null);
  const [exporting, setExporting] = useState(false);
  const [gmailModalOpen, setGmailModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('Your Valentine Card');
  const [emailBody, setEmailBody] = useState('Hi');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [hiddenMap, setHiddenMap] = useState<Record<string, boolean>>({});
  const [history, setHistory] = useState<Array<{
    stickers: Sticker[];
    textElements: TextElementType[];
    userImages: UserImage[];
    background: string;
  }>>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [shouldSaveHistory, setShouldSaveHistory] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const zoom = externalZoom;

  // Initialize history with initial state
  useEffect(() => {
    if (history.length === 0) {
      setHistory([{
        stickers: [],
        textElements: [],
        userImages: [],
        background: template || '#ffffff',
      }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save to history when canvas state changes
  useEffect(() => {
    if (!shouldSaveHistory || history.length === 0) return;

    const currentState = {
      stickers,
      textElements,
      userImages,
      background,
    };

    // Check if state actually changed
    const lastState = history[historyIndex];
    const hasChanged = 
      JSON.stringify(lastState?.stickers) !== JSON.stringify(currentState.stickers) ||
      JSON.stringify(lastState?.textElements) !== JSON.stringify(currentState.textElements) ||
      JSON.stringify(lastState?.userImages) !== JSON.stringify(currentState.userImages) ||
      lastState?.background !== currentState.background;

    if (hasChanged) {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(currentState);
        // Keep last 50 states
        if (newHistory.length > 50) {
          newHistory.shift();
          return newHistory;
        }
        return newHistory;
      });
      setHistoryIndex(prev => Math.min(prev + 1, 49));
    }

    setShouldSaveHistory(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldSaveHistory, stickers, textElements, userImages, background]);

  // Trigger history save
  const saveToHistory = useCallback(() => {
    setShouldSaveHistory(true);
  }, []);

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setStickers(prevState.stickers);
      setTextElements(prevState.textElements);
      setUserImages(prevState.userImages);
      setBackground(prevState.background);
      setHistoryIndex(prev => prev - 1);
      // Clear selection
      setSelectedSticker(null);
      setSelectedText(null);
      setSelectedImageId(null);
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts for copy, paste, duplicate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl+Z or Cmd+Z: Undo
      if (ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl+X or Cmd+X: Cut
      if (ctrlKey && e.key === 'x') {
        e.preventDefault();
        if (selectedSticker) {
          const sticker = stickers.find(s => s.id === selectedSticker);
          if (sticker) {
            setClipboard({ data: sticker, type: 'sticker' });
            saveToHistory();
            setStickers(prev => prev.filter(s => s.id !== selectedSticker));
            setSelectedSticker(null);
          }
        } else if (selectedText) {
          const text = textElements.find(t => t.id === selectedText);
          if (text) {
            setClipboard({ data: text, type: 'text' });
            saveToHistory();
            setTextElements(prev => prev.filter(t => t.id !== selectedText));
            setSelectedText(null);
          }
        } else if (selectedImageId) {
          const image = userImages.find(img => img.id === selectedImageId);
          if (image) {
            setClipboard({ data: image, type: 'image' });
            saveToHistory();
            setUserImages(prev => prev.filter(img => img.id !== selectedImageId));
            setSelectedImageId(null);
          }
        }
        return;
      }

      // Ctrl+C or Cmd+C: Copy
      if (ctrlKey && e.key === 'c') {
        e.preventDefault();
        if (selectedSticker) {
          const sticker = stickers.find(s => s.id === selectedSticker);
          if (sticker) setClipboard({ data: sticker, type: 'sticker' });
        } else if (selectedText) {
          const text = textElements.find(t => t.id === selectedText);
          if (text) setClipboard({ data: text, type: 'text' });
        } else if (selectedImageId) {
          const image = userImages.find(img => img.id === selectedImageId);
          if (image) setClipboard({ data: image, type: 'image' });
        }
      }

      // Ctrl+V or Cmd+V: Paste
      if (ctrlKey && e.key === 'v') {
        e.preventDefault();
        if (clipboard) {
          saveToHistory();
          if (clipboard.type === 'sticker') {
            const newSticker = {
              ...clipboard.data,
              id: `sticker-${Date.now()}`,
              x: clipboard.data.x + 20,
              y: clipboard.data.y + 20,
            };
            setStickers(prev => [...prev, newSticker]);
            selectElement(newSticker.id, 'sticker');
          } else if (clipboard.type === 'text') {
            const newText = {
              ...clipboard.data,
              id: `text-${Date.now()}`,
              x: clipboard.data.x + 20,
              y: clipboard.data.y + 20,
            };
            setTextElements(prev => [...prev, newText]);
            selectElement(newText.id, 'text');
          } else if (clipboard.type === 'image') {
            const newImage = {
              ...clipboard.data,
              id: `image-${Date.now()}`,
              x: clipboard.data.x + 20,
              y: clipboard.data.y + 20,
            };
            setUserImages(prev => [...prev, newImage]);
            selectElement(newImage.id, 'image');
          }
        }
      }

      // Ctrl+D or Cmd+D: Duplicate
      if (ctrlKey && e.key === 'd') {
        e.preventDefault();
        saveToHistory();
        if (selectedSticker) {
          copyElement(selectedSticker, 'sticker');
        } else if (selectedText) {
          copyElement(selectedText, 'text');
        } else if (selectedImageId) {
          copyElement(selectedImageId, 'image');
        }
      }

      // Delete or Backspace: Delete selected
      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        saveToHistory();
        deleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSticker, selectedText, selectedImageId, stickers, textElements, userImages, clipboard, undo, saveToHistory]);

  // Expose methods to parent component
  useEffect(() => {
    if (onRefReady) {
      onRefReady({
        handleDownloadImage,
        handleOpenGmailModal,
        undo,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefReady, undo]);

  const getCanvasDataUrl = useCallback(async () => {
    if (!canvasRef.current) return null;

    setExporting(true);
    // If any stylesheet is cross-origin (accessing cssRules throws), skip html-to-image
    const hasInaccessibleStyleSheets = () => {
      try {
        for (const sheet of Array.from(document.styleSheets)) {
          try {
            // Accessing cssRules will throw SecurityError for cross-origin stylesheets
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _ = (sheet as CSSStyleSheet).cssRules;
          } catch (err) {
           
            return true;
          }
        }
      } catch (err) {
        return true;
      }
      return false;
    };

    try {
      if (typeof document !== 'undefined' && hasInaccessibleStyleSheets()) {
        // Skip html-to-image to avoid SecurityError noise; use fallback directly
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(canvasRef.current as HTMLElement, { 
          backgroundColor: background.startsWith('#') ? background : null, 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false
        });
        return canvas.toDataURL('image/png');
      }

      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: background.startsWith('#') ? background : undefined,
        style: {
          transform: 'none'
        }
      });
      return dataUrl;
    } catch (error) {
      console.error('html-to-image export failed, attempting fallback', error);

      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(canvasRef.current as HTMLElement, { 
          backgroundColor: background.startsWith('#') ? background : null, 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false
        });
        return canvas.toDataURL('image/png');
      } catch (e) {
        console.error('Fallback html2canvas failed', e);
        return null;
      }
    } finally {
      setExporting(false);
    }
  }, [background]);

  const handleDownloadImage = useCallback(async () => {
    const dataUrl = await getCanvasDataUrl();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `valencard-${Date.now()}.png`;
    link.click();
  }, [getCanvasDataUrl]);

  const handleShareGmail = useCallback(async () => {
    const dataUrl = await getCanvasDataUrl();
    if (!dataUrl) return;

    const subject = encodeURIComponent('Check out my custom card');
    const body = encodeURIComponent(
      'Hi,\n\nI made this card and wanted to share it with you. If the preview does not load, download the image using the link below and attach it manually.\n\nImage data URL:\n' + dataUrl
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  }, [getCanvasDataUrl]);

  // Open modal to enter recipient and send automatically via Gmail API using OAuth
  const handleOpenGmailModal = useCallback(() => {
    setGmailModalOpen(true);
  }, []);

  const sendEmailWithAccessToken = useCallback(async (accessToken: string) => {
    setSendingEmail(true);
    try {
      const dataUrl = await getCanvasDataUrl();
      if (!dataUrl) throw new Error('Failed to generate image');

      const imageBase64 = dataUrl.split(',')[1];
      // fetch server-side env values for From header
      let fromName: string | null = null;
      let fromEmail: string | null = null;
      try {
        const envRes = await fetch('/api/env');
        if (envRes.ok) {
          const envJson = await envRes.json();
          fromName = envJson.fromName || null;
          fromEmail = envJson.fromEmail || null;
        }
      } catch (e) {
        // ignore and fallback
      }

      const boundary = '----=_NextValenCard_' + Date.now();
      let raw = '';
      const fromHeader = fromEmail ? (fromName ? `${fromName} <${fromEmail}>` : fromEmail) : 'me';
      raw += `From: ${fromHeader}\r\n`;
      raw += `To: ${recipientEmail}\r\n`;
      raw += `Subject: ${emailSubject}\r\n`;
      raw += `MIME-Version: 1.0\r\n`;
      raw += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;
      raw += `--${boundary}\r\n`;
      raw += `Content-Type: text/plain; charset="UTF-8"\r\n\r\n`;
      raw += `${emailBody}\r\n\r\n`;
      raw += `--${boundary}\r\n`;
      raw += `Content-Type: image/png; name="card.png"\r\n`;
      raw += `Content-Transfer-Encoding: base64\r\n`;
      raw += `Content-Disposition: attachment; filename="card.png"\r\n\r\n`;
      raw += `${imageBase64}\r\n\r\n`;
      raw += `--${boundary}--`;

      const base64Encoded = btoa(unescape(encodeURIComponent(raw))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: base64Encoded }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Gmail API error: ${res.status} ${text}`);
      }

      setGmailModalOpen(false);
      alert('Email sent successfully.');
    } catch (err: any) {
      console.error('Failed to send email', err);
      alert('Failed to send email: ' + (err?.message || err));
    } finally {
      setSendingEmail(false);
    }
  }, [recipientEmail, emailSubject, emailBody, getCanvasDataUrl]);

  const handleSendViaGmailOAuth = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      alert('NEXT_PUBLIC_GOOGLE_CLIENT_ID not set. Add it to .env.local and restart the dev server.');
      return;
    }

    const redirectUri = `${window.location.origin}/oauth2-redirect.html`;
    const scope = encodeURIComponent('https://www.googleapis.com/auth/gmail.send');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}&prompt=consent&include_granted_scopes=true`;

    const popup = window.open(authUrl, 'oauth2', 'width=500,height=600');

    const handler = (e: MessageEvent) => {
      if (!e.data || e.data.type !== 'oauth2_token') return;
      const token = e.data.access_token as string;
      window.removeEventListener('message', handler);
      if (popup) popup.close();
      sendEmailWithAccessToken(token);
    };

    window.addEventListener('message', handler);
  }, [sendEmailWithAccessToken]);

  // Server-side SMTP send (uses /api/send-email). Prefers server send when available.
  const handleSendViaSmtp = useCallback(async () => {
    setSendingEmail(true);
    try {
      const dataUrl = await getCanvasDataUrl();
      if (!dataUrl) throw new Error('Failed to generate image');

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: recipientEmail, subject: emailSubject, body: emailBody, dataUrl }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Send failed');

      setGmailModalOpen(false);
      alert('Email sent successfully via server SMTP.');
    } catch (err: any) {
      console.error('Server send failed', err);
      alert('Server send failed: ' + (err?.message || err));
    } finally {
      setSendingEmail(false);
    }
  }, [recipientEmail, emailSubject, emailBody, getCanvasDataUrl]);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedSticker(null);
    setSelectedText(null);
    setSelectedImageId(null);
  }, []);

  // Select element
  const selectElement = useCallback((id: string, type: ElementType) => {
    setSelectedSticker(type === 'sticker' ? id : null);
    setSelectedText(type === 'text' ? id : null);
    setSelectedImageId(type === 'image' ? id : null);
  }, []);

  // Get clip path for shapes
  const getImageClipPath = useCallback((shape?: string) => {
    switch (shape) {
      case 'circle':
        return 'circle(50% at 50% 50%)';
      case 'heart':
        return 'polygon(50% 15%, 61% 6%, 72% 3%, 81% 6%, 88% 13%, 93% 22%, 95% 32%, 94% 42%, 90% 52%, 83% 61%, 72% 71%, 62% 80%, 50% 95%, 38% 80%, 28% 71%, 17% 61%, 10% 52%, 6% 42%, 5% 32%, 7% 22%, 12% 13%, 19% 6%, 28% 3%, 39% 6%)';
      case 'star':
        return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      case 'rounded':
        return 'inset(0% 0% 0% 0% round 20%)';
      default:
        return 'none';
    }
  }, []);

  // Add sticker
  const addSticker = useCallback((src: string, isEmoji: boolean = false, isIcon: boolean = false) => {
    const newSticker: Sticker = {
      id: `sticker-${Date.now()}`,
      src,
      x: 200,
      y: 200,
      width: isEmoji ? 80 : isIcon ? 60 : 100,
      height: isEmoji ? 80 : isIcon ? 60 : 100,
      rotation: 0,
      shape: 'rectangle',
      outlineColor: undefined,
      outlineWidth: 0,
    };
    setStickers(prev => [...prev, newSticker]);
    selectElement(newSticker.id, 'sticker');
    saveToHistory();
  }, [selectElement, saveToHistory]);

  // Add text
  const addText = useCallback(() => {
    const newText: TextElementType = {
      id: `text-${Date.now()}`,
      text: 'Double click to edit',
      x: 250,
      y: 250,
      fontSize: 24,
      color: '#000000',
      fontFamily: 'Arial',
      rotation: 0,
      outlineColor: undefined,
      outlineWidth: 0,
    };
    setTextElements(prev => [...prev, newText]);
    selectElement(newText.id, 'text');
    saveToHistory();
  }, [selectElement, saveToHistory]);

  // Add text template
  const addTextTemplate = useCallback((template: typeof textTemplates[0]) => {
    const newText: TextElementType = {
      id: `text-${Date.now()}`,
      text: template.text,
      x: 250,
      y: 300,
      fontSize: template.fontSize,
      color: template.color,
      fontFamily: template.fontFamily,
      rotation: 0,
      outlineColor: undefined,
      outlineWidth: 0,
    };
    setTextElements(prev => [...prev, newText]);
    selectElement(newText.id, 'text');
    saveToHistory();
  }, [selectElement, saveToHistory]);

  // Copy element
  const copyElement = useCallback((id: string, type: ElementType) => {
    if (type === 'sticker') {
      setStickers(prev => {
        const sticker = prev.find(s => s.id === id);
        if (!sticker) return prev;
        const newSticker = {
          ...sticker,
          id: `sticker-${Date.now()}`,
          x: sticker.x + 20,
          y: sticker.y + 20,
        };
        selectElement(newSticker.id, 'sticker');
        return [...prev, newSticker];
      });
    } else if (type === 'text') {
      setTextElements(prev => {
        const text = prev.find(t => t.id === id);
        if (!text) return prev;
        const newText = {
          ...text,
          id: `text-${Date.now()}`,
          x: text.x + 20,
          y: text.y + 20,
        };
        selectElement(newText.id, 'text');
        return [...prev, newText];
      });
    } else {
      setUserImages(prev => {
        const image = prev.find(img => img.id === id);
        if (!image) return prev;
        const newImage = {
          ...image,
          id: `image-${Date.now()}`,
          x: image.x + 20,
          y: image.y + 20,
        };
        selectElement(newImage.id, 'image');
        return [...prev, newImage];
      });
    }
    saveToHistory();
  }, [selectElement, saveToHistory]);

  // Delete element
  const deleteElement = useCallback((id: string, type: ElementType) => {
    if (type === 'sticker') {
      setStickers(prev => prev.filter(s => s.id !== id));
      if (selectedSticker === id) clearSelection();
    } else if (type === 'text') {
      setTextElements(prev => prev.filter(t => t.id !== id));
      if (selectedText === id) clearSelection();
    } else {
      setUserImages(prev => prev.filter(img => img.id !== id));
      if (selectedImageId === id) clearSelection();
    }
    saveToHistory();
  }, [selectedSticker, selectedText, selectedImageId, clearSelection, saveToHistory]);

  // Layer management functions
  const bringForward = useCallback((id: string, type: ElementType) => {
    const updateArray = (arr: any[]) => {
      const index = arr.findIndex(item => item.id === id);
      if (index < arr.length - 1) {
        const newArr = [...arr];
        [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
        return newArr;
      }
      return arr;
    };

    if (type === 'sticker') setStickers(updateArray);
    else if (type === 'text') setTextElements(updateArray);
    else setUserImages(updateArray);
  }, []);

  const sendBackward = useCallback((id: string, type: ElementType) => {
    const updateArray = (arr: any[]) => {
      const index = arr.findIndex(item => item.id === id);
      if (index > 0) {
        const newArr = [...arr];
        [newArr[index], newArr[index - 1]] = [newArr[index - 1], newArr[index]];
        return newArr;
      }
      return arr;
    };

    if (type === 'sticker') setStickers(updateArray);
    else if (type === 'text') setTextElements(updateArray);
    else setUserImages(updateArray);
  }, []);

  const bringToFront = useCallback((id: string, type: ElementType) => {
    const moveToEnd = (arr: any[]) => {
      const item = arr.find(i => i.id === id);
      return item ? [...arr.filter(i => i.id !== id), item] : arr;
    };

    if (type === 'sticker') setStickers(moveToEnd);
    else if (type === 'text') setTextElements(moveToEnd);
    else setUserImages(moveToEnd);
  }, []);

  const sendToBack = useCallback((id: string, type: ElementType) => {
    const moveToStart = (arr: any[]) => {
      const item = arr.find(i => i.id === id);
      return item ? [item, ...arr.filter(i => i.id !== id)] : arr;
    };

    if (type === 'sticker') setStickers(moveToStart);
    else if (type === 'text') setTextElements(moveToStart);
    else setUserImages(moveToStart);
  }, []);

  // Update functions
  const updateStickerPosition = useCallback((id: string, x: number, y: number) => {
    setStickers(prev => prev.map(s => s.id === id ? { ...s, x, y } : s));
  }, []);

  const updateStickerShape = useCallback((id: string, shape: ShapeType) => {
    setStickers(prev => prev.map(s => s.id === id ? { ...s, shape } : s));
    saveToHistory();
  }, [saveToHistory]);

  const updateTextPosition = useCallback((id: string, x: number, y: number) => {
    setTextElements(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
  }, []);

  const updateText = useCallback((id: string, text: string) => {
    setTextElements(prev => prev.map(t => t.id === id ? { ...t, text } : t));
    saveToHistory();
  }, [saveToHistory]);

  const updateTextColor = useCallback((id: string, color: string) => {
    setTextElements(prev => prev.map(t => t.id === id ? { ...t, color } : t));
    saveToHistory();
  }, [saveToHistory]);

  const updateTextSize = useCallback((id: string, fontSize: number) => {
    setTextElements(prev => prev.map(t => t.id === id ? { ...t, fontSize } : t));
    saveToHistory();
  }, [saveToHistory]);

  const updateTextFont = useCallback((id: string, fontFamily: string) => {
    setTextElements(prev => prev.map(t => t.id === id ? { ...t, fontFamily } : t));
    saveToHistory();
  }, [saveToHistory]);

  // Image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;

        setUserImages(prev => {
          const baseIndex = prev.length;
          const newImage: UserImage = {
            id: `image-${Date.now()}-${baseIndex + index}`,
            src: result,
            x: (templateData?.imageArea ? templateData.imageArea.x : 150) + ((baseIndex + index) * 20),
            y: (templateData?.imageArea ? templateData.imageArea.y : 150) + ((baseIndex + index) * 20),
            width: templateData?.imageArea ? templateData.imageArea.width : 300,
            height: templateData?.imageArea ? templateData.imageArea.height : 300,
            rotation: 0,
            shape: 'rectangle',
            offset: { x: 0, y: 0 },
            outlineColor: undefined,
            outlineWidth: 0,
          };

          // Select the newly added image (deferred so state is updated first)
          setTimeout(() => selectElement(newImage.id, 'image'), 0);

          return [...prev, newImage];
        });
      };
      reader.readAsDataURL(file);
    });

    // clear input so same file(s) can be selected again
    e.currentTarget.value = '';
    saveToHistory();
  }, [templateData, selectElement, saveToHistory]);

  // Delete selected element
  const deleteSelected = useCallback(() => {
    if (selectedSticker) deleteElement(selectedSticker, 'sticker');
    if (selectedText) deleteElement(selectedText, 'text');
    if (selectedImageId) deleteElement(selectedImageId, 'image');
  }, [selectedSticker, selectedText, selectedImageId, deleteElement]);

  // Drag handlers
  const handleSidebarDragStart = useCallback((e: React.DragEvent, src: string, isEmoji: boolean = false, isIcon: boolean = false) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('src', src);
    e.dataTransfer.setData('isEmoji', isEmoji.toString());
    e.dataTransfer.setData('isIcon', isIcon.toString());
    e.dataTransfer.setData('newItem', 'true');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const isNewItem = e.dataTransfer.getData('newItem');
    
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isNewItem === 'true') {
        const src = e.dataTransfer.getData('src');
        const isEmoji = e.dataTransfer.getData('isEmoji') === 'true';
        const isIcon = e.dataTransfer.getData('isIcon') === 'true';
        const newSticker: Sticker = {
          id: `sticker-${Date.now()}`,
          src,
          x: x - (isEmoji ? 40 : isIcon ? 30 : 50),
          y: y - (isEmoji ? 40 : isIcon ? 30 : 50),
          width: isEmoji ? 80 : isIcon ? 60 : 100,
          height: isEmoji ? 80 : isIcon ? 60 : 100,
          rotation: 0,
          shape: 'rectangle',
        };
        setStickers(prev => [...prev, newSticker]);
        selectElement(newSticker.id, 'sticker');
        saveToHistory();
      } else {
        const id = e.dataTransfer.getData('id');
        const type = e.dataTransfer.getData('type') as ElementType;

        if (type === 'sticker') {
          const sticker = stickers.find(s => s.id === id);
          if (sticker) updateStickerPosition(id, x - sticker.width / 2, y - sticker.height / 2);
        } else if (type === 'text') {
          updateTextPosition(id, x, y);
        }
      }
    }
  }, [stickers, selectElement, updateStickerPosition, updateTextPosition, saveToHistory]);

  // Mouse handlers
  const handleResizeStart = useCallback((e: React.MouseEvent, id: string, corner: string, type?: ElementType) => {
    e.stopPropagation();
    e.preventDefault();
    setResizing({ id, corner, type });
  }, []);

  const handleRotateStart = useCallback((e: React.MouseEvent, id: string, type: ElementType) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!canvasRef.current) return;

    // Get element
    let element: any;
    let currentRotation = 0;
    
    if (type === 'sticker') {
      element = stickers.find(s => s.id === id);
      currentRotation = element?.rotation || 0;
    } else if (type === 'text') {
      element = textElements.find(t => t.id === id);
      currentRotation = element?.rotation || 0;
    } else if (type === 'image') {
      element = userImages.find(img => img.id === id);
      currentRotation = element?.rotation || 0;
    }

    if (!element) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = element.x + (element.width || 0) / 2;
    const centerY = element.y + (element.height || 0) / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const startAngle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
    
    setRotating({ id, type, startAngle, currentRotation });
  }, [stickers, textElements, userImages]);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, id: string, type: ElementType, elementX: number, elementY: number) => {
    if (resizing) return;
    e.stopPropagation();
    e.preventDefault();
    
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      setDragging({
        id,
        type,
        offsetX: mouseX - elementX,
        offsetY: mouseY - elementY,
      });
      
      selectElement(id, type);
    }
  }, [resizing, selectElement]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (rotating) {
      // Handle rotation
      let element: any;
      
      if (rotating.type === 'sticker') {
        element = stickers.find(s => s.id === rotating.id);
      } else if (rotating.type === 'text') {
        element = textElements.find(t => t.id === rotating.id);
      } else if (rotating.type === 'image') {
        element = userImages.find(img => img.id === rotating.id);
      }

      if (element) {
        const centerX = element.x + (element.width || 0) / 2;
        const centerY = element.y + (element.height || 0) / 2;
        const currentAngle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
        const angleDiff = currentAngle - rotating.startAngle;
        const newRotation = rotating.currentRotation + angleDiff;

        if (rotating.type === 'sticker') {
          setStickers(prev => prev.map(s => s.id === rotating.id ? { ...s, rotation: newRotation } : s));
        } else if (rotating.type === 'text') {
          setTextElements(prev => prev.map(t => t.id === rotating.id ? { ...t, rotation: newRotation } : t));
        } else if (rotating.type === 'image') {
          setUserImages(prev => prev.map(img => img.id === rotating.id ? { ...img, rotation: newRotation } : img));
        }
      }
    } else if (panningImage) {
      const deltaX = (mouseX - panningImage.startX) / 5;
      const deltaY = (mouseY - panningImage.startY) / 5;
      
      setUserImages(prev => prev.map(img => img.id === panningImage.id ? {
        ...img,
        offset: {
          x: panningImage.initialOffset.x + deltaX,
          y: panningImage.initialOffset.y + deltaY
        }
      } : img));
    } else if (dragging) {
      if (dragging.type === 'sticker') {
        updateStickerPosition(dragging.id, mouseX - dragging.offsetX, mouseY - dragging.offsetY);
      } else if (dragging.type === 'text') {
        updateTextPosition(dragging.id, mouseX - dragging.offsetX, mouseY - dragging.offsetY);
      } else if (dragging.type === 'image') {
        setUserImages(prev => prev.map(img => img.id === dragging.id ? {
          ...img,
          x: mouseX - dragging.offsetX,
          y: mouseY - dragging.offsetY
        } : img));
      }
    } else if (resizing) {
      if (resizing.type === 'image') {
        setUserImages(prev => prev.map(img => {
          if (img.id !== resizing.id) return img;
          
          const needsSquare = img.shape === 'circle' || img.shape === 'heart' || img.shape === 'star';
          let newWidth = img.width;
          let newHeight = img.height;
          let newX = img.x;
          let newY = img.y;

          if (needsSquare) {
            let size = img.width;
            if (resizing.corner.includes('e')) size = Math.max(100, mouseX - img.x);
            if (resizing.corner.includes('w')) {
              const diff = mouseX - img.x;
              size = Math.max(100, img.width - diff);
              newX = img.x + img.width - size;
            }
            if (resizing.corner.includes('s')) size = Math.max(100, mouseY - img.y);
            if (resizing.corner.includes('n')) {
              const diff = mouseY - img.y;
              size = Math.max(100, img.height - diff);
              newY = img.y + img.height - size;
            }
            newWidth = size;
            newHeight = size;
          } else if (img.shape === 'rounded') {
            const aspectRatio = img.width / img.height;
            let size = img.width;
            if (resizing.corner.includes('e')) size = Math.max(100, mouseX - img.x);
            if (resizing.corner.includes('w')) {
              const diff = mouseX - img.x;
              size = Math.max(100, img.width - diff);
              newX = img.x + img.width - size;
            }
            if (resizing.corner.includes('s')) size = Math.max(100, mouseY - img.y);
            if (resizing.corner.includes('n')) {
              const diff = mouseY - img.y;
              size = Math.max(100, img.height - diff);
              newY = img.y + img.height - size;
            }
            newWidth = size;
            newHeight = size / aspectRatio;
          } else {
            if (resizing.corner.includes('e')) newWidth = Math.max(100, mouseX - img.x);
            if (resizing.corner.includes('w')) {
              const diff = mouseX - img.x;
              newWidth = Math.max(100, img.width - diff);
              newX = mouseX;
            }
            if (resizing.corner.includes('s')) newHeight = Math.max(100, mouseY - img.y);
            if (resizing.corner.includes('n')) {
              const diff = mouseY - img.y;
              newHeight = Math.max(100, img.height - diff);
              newY = mouseY;
            }
          }

          return { ...img, width: newWidth, height: newHeight, x: newX, y: newY };
        }));
      } else {
        setStickers(prev => prev.map(sticker => {
          if (sticker.id !== resizing.id) return sticker;
          
          const shouldMaintainAspect = sticker.shape && sticker.shape !== 'rectangle';
          let newWidth = sticker.width;
          let newHeight = sticker.height;
          let newX = sticker.x;
          let newY = sticker.y;

          if (shouldMaintainAspect) {
            const aspectRatio = sticker.width / sticker.height;
            let size = sticker.width;
            if (resizing.corner.includes('e')) size = Math.max(30, mouseX - sticker.x);
            if (resizing.corner.includes('w')) {
              const diff = mouseX - sticker.x;
              size = Math.max(30, sticker.width - diff);
              newX = sticker.x + sticker.width - size;
            }
            if (resizing.corner.includes('s')) size = Math.max(30, mouseY - sticker.y);
            if (resizing.corner.includes('n')) {
              const diff = mouseY - sticker.y;
              size = Math.max(30, sticker.height - diff);
              newY = sticker.y + sticker.height - size;
            }
            newWidth = size;
            newHeight = size / aspectRatio;
          } else {
            if (resizing.corner.includes('e')) newWidth = Math.max(30, mouseX - sticker.x);
            if (resizing.corner.includes('w')) {
              const diff = mouseX - sticker.x;
              newWidth = Math.max(30, sticker.width - diff);
              newX = mouseX;
            }
            if (resizing.corner.includes('s')) newHeight = Math.max(30, mouseY - sticker.y);
            if (resizing.corner.includes('n')) {
              const diff = mouseY - sticker.y;
              newHeight = Math.max(30, sticker.height - diff);
              newY = mouseY;
            }
          }

          return { ...sticker, width: newWidth, height: newHeight, x: newX, y: newY };
        }));
      }
    }
  }, [panningImage, dragging, resizing, rotating, updateStickerPosition, updateTextPosition, stickers, textElements, userImages]);

  const handleMouseUp = useCallback(() => {
    const hadInteraction = resizing || dragging || panningImage || rotating;
    setResizing(null);
    setDragging(null);
    setPanningImage(null);
    setRotating(null);
    if (hadInteraction) {
      saveToHistory();
    }
  }, [resizing, dragging, panningImage, rotating, saveToHistory]);

  const toggleHidden = useCallback((id: string) => {
    setHiddenMap(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Reorder layers via drag and drop
  const handleReorderLayers = useCallback((fromIndex: number, toIndex: number) => {
    // layersForPanel is reversed, so we need to unreverse to get actual positions
    const totalLength = userImages.length + stickers.length + textElements.length;
    const actualFromIndex = totalLength - 1 - fromIndex;
    const actualToIndex = totalLength - 1 - toIndex;
    
    // Determine which array contains the element being moved
    const imageCount = userImages.length;
    const stickerCount = stickers.length;
    const textCount = textElements.length;
    
    // Calculate cumulative positions
    // Render order: images -> stickers -> text
    if (actualFromIndex < imageCount) {
      // Moving an image
      const imageToMove = userImages[actualFromIndex];
      if (actualToIndex < imageCount) {
        // Moving within images
        const newImages = [...userImages];
        newImages.splice(actualFromIndex, 1);
        newImages.splice(actualToIndex, 0, imageToMove);
        setUserImages(newImages);
      }
    } else if (actualFromIndex < imageCount + stickerCount) {
      // Moving a sticker
      const stickerIndex = actualFromIndex - imageCount;
      const stickerToMove = stickers[stickerIndex];
      if (actualToIndex >= imageCount && actualToIndex < imageCount + stickerCount) {
        // Moving within stickers
        const newStickers = [...stickers];
        newStickers.splice(stickerIndex, 1);
        newStickers.splice(actualToIndex - imageCount, 0, stickerToMove);
        setStickers(newStickers);
      }
    } else {
      // Moving text
      const textIndex = actualFromIndex - imageCount - stickerCount;
      const textToMove = textElements[textIndex];
      if (actualToIndex >= imageCount + stickerCount) {
        // Moving within text
        const newText = [...textElements];
        newText.splice(textIndex, 1);
        newText.splice(actualToIndex - imageCount - stickerCount, 0, textToMove);
        setTextElements(newText);
      }
    }
  }, [userImages, stickers, textElements]);

  // Get selected image
  const selectedImage = useMemo(() => 
    selectedImageId ? userImages.find(img => img.id === selectedImageId) : null,
    [selectedImageId, userImages]
  );

  // Get selected sticker
  const selectedStickerData = useMemo(() => 
    selectedSticker ? stickers.find(s => s.id === selectedSticker) : null,
    [selectedSticker, stickers]
  );

  const layersForPanel = useMemo(() => {
    const combined: { id: string; type: 'sticker' | 'text' | 'image'; label: string; thumbnail?: string | null; hidden?: boolean }[] = [];
    // render order is images -> stickers -> text (images are below stickers, text on top)
    userImages.forEach(i => combined.push({ id: i.id, type: 'image', label: 'Image', thumbnail: i.src, hidden: !!hiddenMap[i.id] }));
    stickers.forEach(s => combined.push({ id: s.id, type: 'sticker', label: 'Sticker', thumbnail: s.src, hidden: !!hiddenMap[s.id] }));
    textElements.forEach(t => combined.push({ id: t.id, type: 'text', label: t.text || 'Text', thumbnail: null, hidden: !!hiddenMap[t.id] }));
    // reverse to show top-most first
    return combined.reverse();
  }, [userImages, stickers, textElements, hiddenMap]);

  // Render context menu
  const renderContextMenu = useCallback((id: string, type: ElementType) => (
    <ContextMenu.Portal>
      <ContextMenu.Content className="min-w-[160px] bg-[#1a2332] text-gray-100 rounded-md p-1 shadow-lg border border-gray-700 z-50">
        <ContextMenu.Item
          className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#26C4E1]/10 rounded flex items-center gap-2"
          onSelect={() => copyElement(id, type)}
        >
          <Copy className="w-4 h-4 text-[#26C4E1]" /> Duplicate
        </ContextMenu.Item>
        <ContextMenu.Separator className="h-px bg-gray-700 my-1" />
        <ContextMenu.Item
          className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
          onSelect={() => bringToFront(id, type)}
        >
          <ArrowUpToLine className="w-4 h-4 text-[#a855f7]" /> Bring to Front
        </ContextMenu.Item>
        <ContextMenu.Item
          className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
          onSelect={() => bringForward(id, type)}
        >
          <MoveUp className="w-4 h-4 text-[#a855f7]" /> Bring Forward
        </ContextMenu.Item>
        <ContextMenu.Item
          className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
          onSelect={() => sendBackward(id, type)}
        >
          <MoveDown className="w-4 h-4 text-[#a855f7]" /> Send Backward
        </ContextMenu.Item>
        <ContextMenu.Item
          className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
          onSelect={() => sendToBack(id, type)}
        >
          <ArrowDownToLine className="w-4 h-4 text-[#a855f7]" /> Send to Back
        </ContextMenu.Item>
        <ContextMenu.Separator className="h-px bg-gray-700 my-1" />
        <ContextMenu.Item
          className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-red-900/20 rounded flex items-center gap-2 text-red-400"
          onSelect={() => deleteElement(id, type)}
        >
          <Trash2 className="w-4 h-4" /> Delete
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Portal>
  ), [copyElement, bringToFront, bringForward, sendBackward, sendToBack, deleteElement]);

  // Render dropdown menu
  const renderDropdownMenu = useCallback((id: string, type: ElementType) => (
    <DropdownMenu.Portal>
      <DropdownMenu.Content className="min-w-[160px] bg-[#1a2332] text-gray-100 rounded-md p-1 shadow-lg border border-gray-700 z-50">
        <DropdownMenu.Item
          className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#26C4E1]/10 rounded flex items-center gap-2"
          onSelect={() => copyElement(id, type)}
        >
          <Copy className="w-4 h-4 text-[#26C4E1]" /> Copy
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-px bg-gray-700 my-1" />
        <DropdownMenu.Item
          className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
          onSelect={() => bringToFront(id, type)}
        >
          <ArrowUpToLine className="w-4 h-4 text-[#a855f7]" /> Bring to Front
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
          onSelect={() => bringForward(id, type)}
        >
          <MoveUp className="w-4 h-4 text-[#a855f7]" /> Bring Forward
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
          onSelect={() => sendBackward(id, type)}
        >
          <MoveDown className="w-4 h-4 text-[#a855f7]" /> Send Backward
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
          onSelect={() => sendToBack(id, type)}
        >
          <ArrowDownToLine className="w-4 h-4 text-[#a855f7]" /> Send to Back
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-px bg-gray-700 my-1" />
        <DropdownMenu.Item
          className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-red-900/20 rounded flex items-center gap-2 text-red-400"
          onSelect={() => deleteElement(id, type)}
        >
          <Trash2 className="w-4 h-4" /> Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  ), [copyElement, bringToFront, bringForward, sendBackward, sendToBack, deleteElement]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-[#0a1628] via-[#1a2332] to-[#0f1b2d] overflow-hidden">
      {/* Left Sidebar */}
      <ScrollArea.Root className="w-full lg:w-72 lg:max-w-xs bg-[#1a2332] border-b lg:border-b-0 lg:border-r border-gray-700 max-h-[40vh] lg:max-h-screen">
        <ScrollArea.Viewport className="w-full h-full p-3 md:p-4">
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#26C4E1] bg-clip-text text-transparent">Tools</h2>
          
          <Tabs.Root defaultValue="stickers" className="w-full">
            <Tabs.List className="grid grid-cols-2 md:grid-cols-2 gap-1.5 md:gap-2 mb-3 md:mb-4">
              <Tabs.Trigger value="stickers" className="px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ec4899] data-[state=active]:to-[#f472b6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(236,72,153,0.5)] data-[state=inactive]:bg-[#0a1628] data-[state=inactive]:text-gray-300">
                Stickers
              </Tabs.Trigger>
              <Tabs.Trigger value="image" className="px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#fbbf24] data-[state=active]:to-[#f59e0b] data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(251,191,36,0.5)] data-[state=inactive]:bg-[#0a1628] data-[state=inactive]:text-gray-300">
                Image
              </Tabs.Trigger>
              <Tabs.Trigger value="text" className="px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26C4E1] data-[state=active]:to-[#60a5fa] data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(38,196,225,0.5)] data-[state=inactive]:bg-[#0a1628] data-[state=inactive]:text-gray-300">
                Text
              </Tabs.Trigger>
              <Tabs.Trigger value="background" className="px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#a855f7] data-[state=active]:to-[#c084fc] data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(168,85,247,0.5)] data-[state=inactive]:bg-[#0a1628] data-[state=inactive]:text-gray-300">
                BG
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="stickers" className="outline-none">
              <div className="mb-4">
                <h3 className="font-semibold mb-3 text-gray-300">ALPHA Stickers</h3>
                <StickerGrid stickers={alphaStickers} type="alpha" onStickerClick={addSticker} onDragStart={handleSidebarDragStart} />
                <Separator.Root className="my-4 h-px bg-gray-700" />
                <h3 className="font-semibold mb-3 text-gray-300">Love Stickers</h3>
                <StickerGrid stickers={loveStickers} type="emoji" onStickerClick={addSticker} onDragStart={handleSidebarDragStart} />
                <Separator.Root className="my-4 h-px bg-gray-700" />
                <h3 className="font-semibold mb-3 text-gray-300">Icon Stickers</h3>
                <StickerGrid stickers={[]} type="icon" iconData={iconStickers} onStickerClick={addSticker} onDragStart={handleSidebarDragStart} />
              </div>
            </Tabs.Content>

            <Tabs.Content value="image" className="outline-none">
              <ImageUploadPanel
                userImage={selectedImage?.src || null}
                imageShape={selectedImage?.shape || 'rectangle'}
                fileInputRef={fileInputRef}
                hasImageArea={true}
                onImageUpload={handleImageUpload}
                onImageRemove={() => selectedImageId && deleteElement(selectedImageId, 'image')}
                onShapeChange={(shape) => selectedImageId && setUserImages(prev => prev.map(img => img.id === selectedImageId ? { ...img, shape } : img))}
              />
            </Tabs.Content>

            <Tabs.Content value="text" className="outline-none">
              <Button onClick={addText} className="w-full mb-4" size="lg">
                <Type size={18} /> Add Custom Text
              </Button>
              <Separator.Root className="my-4 h-px bg-gray-700" />
              <h3 className="font-semibold mb-3 text-gray-300">Text Templates</h3>
              <div className="grid grid-cols-1 gap-2 mb-4">
                {textTemplates.map((template, index) => (
                  <Button
                    key={index}
                    onClick={() => addTextTemplate(template)}
                    variant="outline"
                    className="text-left justify-start h-auto py-3 border-gray-600 hover:border-[#26C4E1]"
                    style={{ fontFamily: template.fontFamily, color: template.color, fontSize: '18px' }}
                  >
                    {template.text}
                  </Button>
                ))}
              </div>
              <Separator.Root className="my-4 h-px bg-gray-700" />
              <TextControls
                selectedTextId={selectedText || ''}
                textElement={textElements.find(t => t.id === selectedText)}
                fontFamilies={fontFamilies}
                onFontChange={updateTextFont}
                onColorChange={updateTextColor}
                onSizeChange={updateTextSize}
              />
            </Tabs.Content>

            <Tabs.Content value="background" className="outline-none">
              <BackgroundSelector
                currentBackground={background}
                onBackgroundChange={setBackground}
                solidColors={solidColors}
                gradients={gradients}
                patterns={patterns}
                backgroundImages={backgroundImages}
              />
              <Separator.Root className="my-4 h-px bg-gray-700" />
              <h3 className="font-semibold mb-3 text-gray-300">Custom Color</h3>
              <Input
                type="color"
                value={background.startsWith('#') ? background : '#ffffff'}
                onChange={(e) => setBackground(e.target.value)}
                onBlur={() => saveToHistory()}
                className="w-full h-12 cursor-pointer"
              />
            </Tabs.Content>
          </Tabs.Root>

          <Separator.Root className="my-3 md:my-4 h-px bg-gray-700" />
          <Button onClick={deleteSelected} disabled={!selectedSticker && !selectedText && !selectedImageId} variant="destructive" className="w-full text-sm md:text-base" size="lg">
            Delete Selected
          </Button>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="flex select-none touch-none p-0.5 bg-[#0a1628] data-[orientation=vertical]:w-2.5" orientation="vertical">
          <ScrollArea.Thumb className="flex-1 bg-gradient-to-b from-[#26C4E1] to-[#60a5fa] rounded-lg" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 overflow-auto relative">
        <div className="relative" style={{ width: `${600 * zoom}px`, height: `${800 * zoom}px` }}>
        <div
          ref={canvasRef}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={clearSelection}
          className="relative shadow-2xl"
          style={{
            width: '600px',
            height: '800px',
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            backgroundImage: background.includes('gradient') ? background : background.startsWith('data:image/svg') ? `url("${background}")` : background.includes('url') && !background.startsWith('url(https') ? background : background.startsWith('/templates/') ? `url("${background}")` : 'none',
            backgroundColor: background.startsWith('#') || background.startsWith('rgb') ? background : background.startsWith('url(https') || background.startsWith('data:image/svg') || background.startsWith('/templates/') ? 'transparent' : '#ffffff',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            overflow: 'hidden',
          }}
        >
          {background.startsWith('url(https') && (
            <Image src={background.replace('url(', '').replace(')', '')} alt="Background" fill className="object-cover pointer-events-none" priority />
          )}
          
          {/* Images */}
          {userImages.map((image) => {
            if (hiddenMap[image.id]) return null;
            if (exporting) {
              // Render without interactive elements for export
              return (
                <div
                  key={image.id}
                  className="absolute"
                  style={{
                    left: `${image.x}px`,
                    top: `${image.y}px`,
                    width: `${image.width}px`,
                    height: `${image.height}px`,
                    transform: `rotate(${image.rotation}deg)`,
                  }}
                >
                  {/* Outline layer */}
                  {image.outlineWidth && image.outlineWidth > 0 && (
                    <div
                      className="absolute"
                      style={{
                        inset: `${-image.outlineWidth}px`,
                        clipPath: image.shape && image.shape !== 'rectangle' ? getImageClipPath(image.shape) : undefined,
                        backgroundColor: image.outlineColor || '#000000',
                        borderRadius: image.borderRadius ? `${image.borderRadius + image.outlineWidth}px` : undefined,
                        overflow: image.borderRadius ? 'hidden' : undefined,
                      }}
                    />
                  )}
                  {/* Main content */}
                  <div
                    className="absolute inset-0"
                    style={{
                      borderRadius: image.borderRadius ? `${image.borderRadius}px` : undefined,
                      overflow: image.borderRadius ? 'hidden' : undefined,
                    }}
                  >
                    <div
                      className="w-full h-full overflow-hidden"
                      style={{
                        clipPath: image.shape && image.shape !== 'rectangle' ? getImageClipPath(image.shape) : undefined,
                      }}
                    >
                      <Image
                        src={image.src}
                        alt="User uploaded"
                        fill
                        className="pointer-events-none"
                        style={{
                          objectFit: 'cover',
                          objectPosition: `${50 + image.offset.x}% ${50 + image.offset.y}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <ImageElement
                key={image.id}
                image={image}
                getClipPath={getImageClipPath}
                isSelected={selectedImageId === image.id}
                isResizing={resizing?.id === image.id}
                isDragging={dragging?.id === image.id}
                isPanning={panningImage?.id === image.id}
                onMouseDown={(e, id, type, elementX, elementY) => {
                  if (!resizing && !rotating) {
                    const rect = canvasRef.current?.getBoundingClientRect();
                    if (rect) {
                      const mouseX = e.clientX - rect.left;
                      const mouseY = e.clientY - rect.top;
                      if (e.altKey) {
                        setPanningImage({ id: id, initialOffset: { ...image.offset }, startX: mouseX, startY: mouseY });
                      } else {
                        handleElementMouseDown(e, id, type, elementX, elementY);
                      }
                    }
                  }
                }}
                onResizeStart={handleResizeStart}
                onRotateStart={(e, id) => handleRotateStart(e, id, 'image')}
                onSelect={(id) => { selectElement(id, 'image'); }}
                onCopy={copyElement}
                onSendBackward={sendBackward}
                onBringForward={bringForward}
                onSendToBack={sendToBack}
                onBringToFront={bringToFront}
                onDelete={deleteElement}
              />
            );
          })}

          {/* Stickers */}
          {stickers.map((sticker) => {
            if (hiddenMap[sticker.id]) return null;
            if (exporting) {
              // Render without interactive elements for export
              return (
                <div
                  key={sticker.id}
                  className="absolute"
                  style={{
                    left: `${sticker.x}px`,
                    top: `${sticker.y}px`,
                    width: `${sticker.width}px`,
                    height: `${sticker.height}px`,
                    transform: `rotate(${sticker.rotation}deg)`,
                  }}
                >
                  {/* Outline layer */}
                  {sticker.outlineWidth && sticker.outlineWidth > 0 && (
                    <div
                      className="absolute"
                      style={{
                        inset: `${-sticker.outlineWidth}px`,
                        clipPath: sticker.shape && sticker.shape !== 'rectangle' ? getImageClipPath(sticker.shape || 'rectangle') : undefined,
                        backgroundColor: sticker.outlineColor || '#000000',
                        borderRadius: sticker.borderRadius ? `${sticker.borderRadius + sticker.outlineWidth}px` : undefined,
                        overflow: sticker.borderRadius ? 'hidden' : undefined,
                      }}
                    />
                  )}
                  {/* Main content */}
                  <div
                    className="absolute inset-0"
                    style={{
                      borderRadius: sticker.borderRadius ? `${sticker.borderRadius}px` : undefined,
                      overflow: sticker.borderRadius ? 'hidden' : undefined,
                    }}
                  >
                    <div
                      className="w-full h-full"
                      style={{
                        clipPath: sticker.shape && sticker.shape !== 'rectangle' ? getImageClipPath(sticker.shape || 'rectangle') : undefined,
                      }}
                    >
                  {sticker.src.startsWith('/') ? (
                    <Image src={sticker.src} alt="Sticker" width={sticker.width} height={sticker.height} className="w-full h-full object-contain pointer-events-none" />
                  ) : sticker.src.startsWith('icon:') ? (
                    (() => {
                      const [, iconName, iconColor] = sticker.src.split(':');
                      const iconItem = iconStickers.find(i => i.name === iconName);
                      if (iconItem) {
                        const IconComponent = iconItem.icon;
                        return <div className="w-full h-full flex items-center justify-center"><IconComponent size={Math.min(sticker.width, sticker.height) * 0.8} color={iconColor} strokeWidth={2} className="pointer-events-none" /></div>;
                      }
                      return null;
                    })()
                  ) : (
                    <span className="text-6xl select-none flex items-center justify-center w-full h-full">{sticker.src}</span>
                  )}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <StickerElement
                key={sticker.id}
                sticker={sticker}
                isSelected={selectedSticker === sticker.id}
                isDragging={dragging?.id === sticker.id}
                isResizing={resizing?.id === sticker.id}
                onMouseDown={(e, id, x, y) => !resizing && !rotating && handleElementMouseDown(e, id, 'sticker', x, y)}
                onResizeStart={handleResizeStart}
                onRotateStart={(e, id) => handleRotateStart(e, id, 'sticker')}
                onSelect={(id) => selectElement(id, 'sticker')}
                getClipPath={getImageClipPath}
                onCopy={copyElement}
                onBringToFront={bringToFront}
                onBringForward={bringForward}
                onSendBackward={sendBackward}
                onSendToBack={sendToBack}
                onDelete={deleteElement}
              />
            );
          })}

          {/* Text */}
          {textElements.map((textElement) => {
            if (hiddenMap[textElement.id]) return null;
            if (exporting) {
              // Render without interactive elements for export
              return (
                <div
                  key={textElement.id}
                  className="absolute select-none"
                  style={{
                    left: `${textElement.x}px`,
                    top: `${textElement.y}px`,
                    fontSize: `${textElement.fontSize}px`,
                    color: textElement.color,
                    fontFamily: textElement.fontFamily,
                    transform: `rotate(${textElement.rotation}deg)`,
                    WebkitTextStroke: textElement.outlineWidth && textElement.outlineWidth > 0 ? `${textElement.outlineWidth}px ${textElement.outlineColor || '#000000'}` : 'none',
                  }}
                >
                  {textElement.text}
                </div>
              );
            }
            return (
              <div
                key={textElement.id}
                onDoubleClick={() => { const newText = prompt('Edit text:', textElement.text); if (newText !== null) updateText(textElement.id, newText); }}
              >
                <TextElementComponent
                  textElement={textElement}
                  isSelected={selectedText === textElement.id}
                  isDragging={dragging?.id === textElement.id}
                  isResizing={resizing?.id === textElement.id}
                  onMouseDown={(e, id, x, y) => !resizing && !rotating && e.detail === 1 && handleElementMouseDown(e, id, 'text', x, y)}
                  onRotateStart={(e, id) => handleRotateStart(e, id, 'text')}
                  onSelect={(id) => selectElement(id, 'text')}
                  onCopy={copyElement}
                  onBringToFront={bringToFront}
                  onBringForward={bringForward}
                  onSendBackward={sendBackward}
                  onSendToBack={sendToBack}
                  onDelete={deleteElement}
                />
              </div>
            );
          })}
        </div>
        <div className="absolute left-full top-0 ml-2 md:ml-3 h-full hidden xl:flex items-start">
          <LayersPanel
            layers={layersForPanel}
            selectedId={selectedSticker || selectedText || selectedImageId}
            onSelect={selectElement}
            onBringForward={bringForward}
            onSendBackward={sendBackward}
            onBringToFront={bringToFront}
            onSendToBack={sendToBack}
            onDelete={deleteElement}
            onToggleHidden={toggleHidden}
            onReorder={handleReorderLayers}
          />
        </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-80 xl:w-96 bg-[#0a1628] border-t lg:border-t-0 lg:border-l border-gray-700 p-3 md:p-4 overflow-y-auto max-h-[40vh] lg:max-h-screen">
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#26C4E1] bg-clip-text text-transparent">Properties</h2>
        {/* <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
          <Button onClick={handleDownloadImage} disabled={exporting} className="w-full text-sm md:text-base" size="lg">
            <Download className="w-3 h-3 md:w-4 md:h-4" /> {exporting ? 'Preparing...' : 'Download PNG'}
          </Button>
          <Button onClick={handleOpenGmailModal} disabled={exporting} variant="outline" className="w-full text-sm md:text-base" size="lg">
            <Mail className="w-3 h-3 md:w-4 md:h-4" /> Send via Gmail
          </Button>
        </div> */}

        {gmailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-lg bg-[#0b1220] border border-gray-700 rounded-lg p-4 md:p-6 shadow-lg">
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-100">Send Card via Gmail</h3>
              <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                <input className="w-full p-2 rounded bg-[#071028] text-sm md:text-base text-gray-100 border border-gray-700" placeholder="Recipient email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} />
                <input className="w-full p-2 rounded bg-[#071028] text-sm md:text-base text-gray-100 border border-gray-700" placeholder="Subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                <textarea className="w-full p-2 rounded bg-[#071028] text-sm md:text-base text-gray-100 border border-gray-700" rows={4} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setGmailModalOpen(false)} className="text-sm md:text-base">Cancel</Button>
                <Button onClick={handleSendViaSmtp} disabled={sendingEmail || !recipientEmail} className="text-sm md:text-base">
                  {sendingEmail ? 'Sending…' : 'Send '}
                </Button>
                {/* <Button onClick={handleSendViaGmailOAuth} disabled={sendingEmail || !recipientEmail} variant="outline">
                  {sendingEmail ? 'Sending…' : 'Authorize & Send (Gmail API)'}
                </Button> */}
              </div>
            </div>
          </div>
        )}
        
        {selectedStickerData && (
          <div>
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Position</h3>
            <div className="grid grid-cols-2 gap-1.5 md:gap-2 mb-3 md:mb-4">
              <div>
                <label className="text-xs text-gray-400 mb-0.5 md:mb-1 block">X Position</label>
                <Input
                  type="number"
                  value={Math.round(selectedStickerData.x)}
                  onChange={(e) => setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, x: Number(e.target.value) } : s))}
                  className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-0.5 md:mb-1 block">Y Position</label>
                <Input
                  type="number"
                  value={Math.round(selectedStickerData.y)}
                  onChange={(e) => setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, y: Number(e.target.value) } : s))}
                  className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700"
                />
              </div>
            </div>
            <Separator.Root className="my-2 md:my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Sticker Shape</h3>
            <ShapeSelector selectedShape={selectedStickerData.shape || 'rectangle'} onShapeChange={(shape) => updateStickerShape(selectedStickerData.id, shape)} />
            <Separator.Root className="my-2 md:my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Size</h3>
            <div className="grid grid-cols-2 gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <div>
                <label className="text-xs text-gray-400 mb-0.5 md:mb-1 block">Width</label>
                <Input
                  type="number"
                  value={Math.round(selectedStickerData.width)}
                  onChange={(e) => setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, width: Number(e.target.value) } : s))}
                  className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-0.5 md:mb-1 block">Height</label>
                <Input
                  type="number"
                  value={Math.round(selectedStickerData.height)}
                  onChange={(e) => setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, height: Number(e.target.value) } : s))}
                  className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700"
                />
              </div>
            </div>
            <Slider.Root className="relative flex items-center w-full h-5 mb-2" value={[selectedStickerData.width]} onValueChange={(value) => {
              const newSize = value[0];
              const aspectRatio = selectedStickerData.width / selectedStickerData.height;
              setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, width: newSize, height: newSize / aspectRatio } : s));
            }} max={300} min={30}>
              <Slider.Track className="bg-gray-700 relative grow rounded-full h-2">
                <Slider.Range className="absolute bg-gradient-to-r from-[#26C4E1] to-[#60a5fa] rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-[#0a1628] border-2 border-[#26C4E1] rounded-full" />
            </Slider.Root>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Small</span>
              <span className="text-[#26C4E1]">{Math.round(selectedStickerData.width)}px</span>
              <span>Large</span>
            </div>
            <Separator.Root className="my-2 md:my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Rotation</h3>
            <div className="mb-1.5 md:mb-2">
              <Input
                type="number"
                value={Math.round(selectedStickerData.rotation)}
                onChange={(e) => setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, rotation: Number(e.target.value) } : s))}
                className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700"
                min={0}
                max={360}
              />
            </div>
            <Slider.Root className="relative flex items-center w-full h-5" value={[selectedStickerData.rotation]} onValueChange={(value) => {
              setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, rotation: value[0] } : s));
            }} onValueCommit={() => saveToHistory()} max={360} min={0} step={1}>
              <Slider.Track className="bg-gray-700 relative grow rounded-full h-2">
                <Slider.Range className="absolute bg-gradient-to-r from-[#ec4899] to-[#f472b6] rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-[#0a1628] border-2 border-[#ec4899] rounded-full" />
            </Slider.Root>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>0°</span>
              <span className="text-[#ec4899]">{Math.round(selectedStickerData.rotation)}°</span>
              <span>360°</span>
            </div>
            <Separator.Root className="my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-3 text-gray-300">Outline</h3>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Color</label>
                <Input
                  type="color"
                  value={selectedStickerData.outlineColor || '#000000'}
                  onChange={(e) => setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, outlineColor: e.target.value } : s))}
                  onBlur={() => saveToHistory()}
                  className="w-full h-10 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-0.5 md:mb-1 block">Width</label>
                <Input
                  type="number"
                  value={selectedStickerData.outlineWidth || 0}
                  onChange={(e) => setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, outlineWidth: Number(e.target.value) } : s))}
                  onBlur={() => saveToHistory()}
                  className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700 mb-1.5 md:mb-2"
                  min={0}
                  max={10}
                />
                <Slider.Root className="relative flex items-center w-full h-5" value={[selectedStickerData.outlineWidth || 0]} onValueChange={(value) => {
                  setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, outlineWidth: value[0] } : s));
                }} max={10} min={0} step={1}>
                  <Slider.Track className="bg-gray-700 relative grow rounded-full h-2">
                    <Slider.Range className="absolute bg-gradient-to-r from-[#a855f7] to-[#c084fc] rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-5 h-5 bg-[#0a1628] border-2 border-[#a855f7] rounded-full" />
                </Slider.Root>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>None</span>
                  <span className="text-[#a855f7]">{selectedStickerData.outlineWidth || 0}px</span>
                </div>
              </div>
            </div>
            <Separator.Root className="my-2 md:my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Border Radius</h3>
            <Input
              type="number"
              value={selectedStickerData.borderRadius || 0}
              onChange={(e) => setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, borderRadius: Number(e.target.value) } : s))}
              className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700 mb-1.5 md:mb-2"
              min={0}
              max={100}
            />
            <Slider.Root className="relative flex items-center w-full h-5" value={[selectedStickerData.borderRadius || 0]} onValueChange={(value) => {
              setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, borderRadius: value[0] } : s));
            }} max={100} min={0} step={1}>
              <Slider.Track className="bg-gray-700 relative grow rounded-full h-2">
                <Slider.Range className="absolute bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-[#0a1628] border-2 border-[#10b981] rounded-full" />
            </Slider.Root>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>0px</span>
              <span className="text-[#10b981]">{selectedStickerData.borderRadius || 0}px</span>
              <span>100px</span>
            </div>
          </div>
        )}

        {selectedImage && (
          <div>
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Position</h3>
            <div className="grid grid-cols-2 gap-1.5 md:gap-2 mb-3 md:mb-4">
              <div>
                <label className="text-xs text-gray-400 mb-0.5 md:mb-1 block">X Position</label>
                <Input
                  type="number"
                  value={Math.round(selectedImage.x)}
                  onChange={(e) => setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, x: Number(e.target.value) } : img))}
                  className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-0.5 md:mb-1 block">Y Position</label>
                <Input
                  type="number"
                  value={Math.round(selectedImage.y)}
                  onChange={(e) => setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, y: Number(e.target.value) } : img))}
                  className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700"
                />
              </div>
            </div>
            <Separator.Root className="my-2 md:my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Image Shape</h3>
            <ShapeSelector selectedShape={selectedImage.shape} onShapeChange={(shape) => setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, shape } : img))} />
            <Separator.Root className="my-2 md:my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Size</h3>
            <div className="grid grid-cols-2 gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <div>
                <label className="text-xs text-gray-400 mb-0.5 md:mb-1 block">Width</label>
                <Input
                  type="number"
                  value={Math.round(selectedImage.width)}
                  onChange={(e) => setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, width: Number(e.target.value) } : img))}
                  className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-0.5 md:mb-1 block">Height</label>
                <Input
                  type="number"
                  value={Math.round(selectedImage.height)}
                  onChange={(e) => setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, height: Number(e.target.value) } : img))}
                  className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700"
                />
              </div>
            </div>
            <Slider.Root className="relative flex items-center w-full h-5 mb-2" value={[selectedImage.width]} onValueChange={(value) => {
              const newWidth = value[0];
              const aspectRatio = selectedImage.width / selectedImage.height;
              setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, width: newWidth, height: newWidth / aspectRatio } : img));
            }} max={600} min={50}>
              <Slider.Track className="bg-gray-700 relative grow rounded-full h-2">
                <Slider.Range className="absolute bg-gradient-to-r from-[#26C4E1] to-[#60a5fa] rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-[#0a1628] border-2 border-[#26C4E1] rounded-full" />
            </Slider.Root>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Small</span>
              <span className="text-[#26C4E1]">{Math.round(selectedImage.width)}px</span>
              <span>Large</span>
            </div>
            <Separator.Root className="my-2 md:my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Rotation</h3>
            <div className="mb-1.5 md:mb-2">
              <Input
                type="number"
                value={Math.round(selectedImage.rotation)}
                onChange={(e) => setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, rotation: Number(e.target.value) } : img))}
                className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700"
                min={0}
                max={360}
              />
            </div>
            <Slider.Root className="relative flex items-center w-full h-5" value={[selectedImage.rotation]} onValueChange={(value) => {
              setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, rotation: value[0] } : img));
            }} onValueCommit={() => saveToHistory()} max={360} min={0} step={1}>
              <Slider.Track className="bg-gray-700 relative grow rounded-full h-2">
                <Slider.Range className="absolute bg-gradient-to-r from-[#ec4899] to-[#f472b6] rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-[#0a1628] border-2 border-[#ec4899] rounded-full" />
            </Slider.Root>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>0°</span>
              <span className="text-[#ec4899]">{Math.round(selectedImage.rotation)}°</span>
              <span>360°</span>
            </div>
            <Separator.Root className="my-2 md:my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Outline</h3>
            <div className="space-y-1.5 md:space-y-2">
              <div>
                <label className="text-xs text-gray-400 mb-0.5 md:mb-1 block">Color</label>
                <Input
                  type="color"
                  value={selectedImage.outlineColor || '#000000'}
                  onChange={(e) => setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, outlineColor: e.target.value } : img))}
                  onBlur={() => saveToHistory()}
                  className="w-full h-10 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-0.5 md:mb-1 block">Width</label>
                <Input
                  type="number"
                  value={selectedImage.outlineWidth || 0}
                  onChange={(e) => setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, outlineWidth: Number(e.target.value) } : img))}
                  onBlur={() => saveToHistory()}
                  className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700 mb-1.5 md:mb-2"
                  min={0}
                  max={10}
                />
                <Slider.Root className="relative flex items-center w-full h-5" value={[selectedImage.outlineWidth || 0]} onValueChange={(value) => {
                  setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, outlineWidth: value[0] } : img));
                }} max={10} min={0} step={1}>
                  <Slider.Track className="bg-gray-700 relative grow rounded-full h-2">
                    <Slider.Range className="absolute bg-gradient-to-r from-[#a855f7] to-[#c084fc] rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-5 h-5 bg-[#0a1628] border-2 border-[#a855f7] rounded-full" />
                </Slider.Root>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>None</span>
                  <span className="text-[#a855f7]">{selectedImage.outlineWidth || 0}px</span>
                </div>
              </div>
            </div>
            <Separator.Root className="my-2 md:my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Border Radius</h3>
            <Input
              type="number"
              value={selectedImage.borderRadius || 0}
              onChange={(e) => setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, borderRadius: Number(e.target.value) } : img))}
              className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700 mb-1.5 md:mb-2"
              min={0}
              max={100}
            />
            <Slider.Root className="relative flex items-center w-full h-5" value={[selectedImage.borderRadius || 0]} onValueChange={(value) => {
              setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, borderRadius: value[0] } : img));
            }} max={100} min={0} step={1}>
              <Slider.Track className="bg-gray-700 relative grow rounded-full h-2">
                <Slider.Range className="absolute bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-[#0a1628] border-2 border-[#10b981] rounded-full" />
            </Slider.Root>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>0px</span>
              <span className="text-[#10b981]">{selectedImage.borderRadius || 0}px</span>
              <span>100px</span>
            </div>
          </div>
        )}

        {selectedText && textElements.find(t => t.id === selectedText) && (
          <div>
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Text Properties</h3>
            <Separator.Root className="my-2 md:my-4 h-px bg-gray-700" />
            
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Position</h3>
            <div className="grid grid-cols-2 gap-1.5 md:gap-2 mb-3 md:mb-4">
              <div>
                <label className="text-xs text-gray-400 mb-0.5 md:mb-1 block">X</label>
                <Input
                  type="number"
                  value={Math.round(textElements.find(t => t.id === selectedText)?.x || 0)}
                  onChange={(e) => setTextElements(prev => prev.map(t => t.id === selectedText ? { ...t, x: Number(e.target.value) } : t))}
                  onBlur={() => saveToHistory()}
                  className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-0.5 md:mb-1 block">Y</label>
                <Input
                  type="number"
                  value={Math.round(textElements.find(t => t.id === selectedText)?.y || 0)}
                  onChange={(e) => setTextElements(prev => prev.map(t => t.id === selectedText ? { ...t, y: Number(e.target.value) } : t))}
                  onBlur={() => saveToHistory()}
                  className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700"
                />
              </div>
            </div>

            <Separator.Root className="my-2 md:my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Font Size</h3>
            <Input
              type="number"
              value={textElements.find(t => t.id === selectedText)?.fontSize || 16}
              onChange={(e) => setTextElements(prev => prev.map(t => t.id === selectedText ? { ...t, fontSize: Number(e.target.value) } : t))}
              onBlur={() => saveToHistory()}
              className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700 mb-1.5 md:mb-2"
              min={8}
              max={200}
            />

            <Separator.Root className="my-2 md:my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Rotation</h3>
            <Input
              type="number"
              value={Math.round(textElements.find(t => t.id === selectedText)?.rotation || 0)}
              onChange={(e) => setTextElements(prev => prev.map(t => t.id === selectedText ? { ...t, rotation: Number(e.target.value) } : t))}
              onBlur={() => saveToHistory()}
              className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700 mb-1.5 md:mb-2"
              min={0}
              max={360}
            />
            <Slider.Root className="relative flex items-center w-full h-5" value={[textElements.find(t => t.id === selectedText)?.rotation || 0]} onValueChange={(value) => {
              setTextElements(prev => prev.map(t => t.id === selectedText ? { ...t, rotation: value[0] } : t));
            }} onValueCommit={() => saveToHistory()} max={360} min={0} step={1}>
              <Slider.Track className="bg-gray-700 relative grow rounded-full h-2">
                <Slider.Range className="absolute bg-gradient-to-r from-[#ec4899] to-[#f472b6] rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-[#0a1628] border-2 border-[#ec4899] rounded-full" />
            </Slider.Root>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>0°</span>
              <span className="text-[#ec4899]">{Math.round(textElements.find(t => t.id === selectedText)?.rotation || 0)}°</span>
              <span>360°</span>
            </div>
            <Separator.Root className="my-2 md:my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Text Outline</h3>
            <div className="space-y-1.5 md:space-y-2">
              <div>
                <label className="text-xs text-gray-400 mb-0.5 md:mb-1 block">Color</label>
                <Input
                  type="color"
                  value={textElements.find(t => t.id === selectedText)?.outlineColor || '#000000'}
                  onChange={(e) => setTextElements(prev => prev.map(t => t.id === selectedText ? { ...t, outlineColor: e.target.value } : t))}
                  onBlur={() => saveToHistory()}
                  className="w-full h-10 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-0.5 md:mb-1 block">Width</label>
                <Input
                  type="number"
                  value={textElements.find(t => t.id === selectedText)?.outlineWidth || 0}
                  onChange={(e) => setTextElements(prev => prev.map(t => t.id === selectedText ? { ...t, outlineWidth: Number(e.target.value) } : t))}
                  onBlur={() => saveToHistory()}
                  className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700 mb-1.5 md:mb-2"
                  min={0}
                  max={5}
                  step={0.5}
                />
                <Slider.Root className="relative flex items-center w-full h-5" value={[textElements.find(t => t.id === selectedText)?.outlineWidth || 0]} onValueChange={(value) => {
                  setTextElements(prev => prev.map(t => t.id === selectedText ? { ...t, outlineWidth: value[0] } : t));
                }} max={5} min={0} step={0.5}>
                  <Slider.Track className="bg-gray-700 relative grow rounded-full h-2">
                    <Slider.Range className="absolute bg-gradient-to-r from-[#a855f7] to-[#c084fc] rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-5 h-5 bg-[#0a1628] border-2 border-[#a855f7] rounded-full" />
                </Slider.Root>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>None</span>
                  <span className="text-[#a855f7]">{textElements.find(t => t.id === selectedText)?.outlineWidth || 0}px</span>
                </div>
              </div>
            </div>
            <Separator.Root className="my-2 md:my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Border Radius</h3>
            <Input
              type="number"
              value={textElements.find(t => t.id === selectedText)?.borderRadius || 0}
              onChange={(e) => setTextElements(prev => prev.map(t => t.id === selectedText ? { ...t, borderRadius: Number(e.target.value) } : t))}
              className="w-full bg-[#071028] text-sm md:text-base text-gray-100 border-gray-700 mb-1.5 md:mb-2"
              min={0}
              max={100}
            />
            <Slider.Root className="relative flex items-center w-full h-5" value={[textElements.find(t => t.id === selectedText)?.borderRadius || 0]} onValueChange={(value) => {
              setTextElements(prev => prev.map(t => t.id === selectedText ? { ...t, borderRadius: value[0] } : t));
            }} max={100} min={0} step={1}>
              <Slider.Track className="bg-gray-700 relative grow rounded-full h-2">
                <Slider.Range className="absolute bg-gradient-to-r from-[#a855f7] to-[#c084fc] rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-[#0a1628] border-2 border-[#a855f7] rounded-full" />
            </Slider.Root>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>0px</span>
              <span className="text-[#a855f7]">{textElements.find(t => t.id === selectedText)?.borderRadius || 0}px</span>
              <span>100px</span>
            </div>
          </div>
        )}

        {!selectedSticker && !selectedImageId && !selectedText && (
          <div className="text-sm text-gray-400 space-y-2">
            <p className="mb-4">Select a sticker or image to customize.</p>
            <p className="flex items-center gap-2"><span className="w-2 h-2 bg-[#ec4899] rounded-full"></span>Stickers: {stickers.length}</p>
            <p className="flex items-center gap-2"><span className="w-2 h-2 bg-[#26C4E1] rounded-full"></span>Text: {textElements.length}</p>
            <p className="flex items-center gap-2"><span className="w-2 h-2 bg-[#a855f7] rounded-full"></span>Images: {userImages.length}</p>
          </div>
        )}
      </div>
    </div>
  );
  }