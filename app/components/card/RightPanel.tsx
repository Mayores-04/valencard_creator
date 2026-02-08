import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as Separator from '@radix-ui/react-separator';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Download, Mail } from 'lucide-react';
import { 
  Sticker, 
  TextElement as TextElementType,
  UserImage,
  ShapeSelector,
} from '@/app/components/card';

interface RightPanelProps {
  selectedSticker: string | null;
  selectedText: string | null;
  selectedImageId: string | null;
  stickers: Sticker[];
  textElements: TextElementType[];
  userImages: UserImage[];
  exporting: boolean;
  gmailModalOpen: boolean;
  recipientEmail: string;
  emailSubject: string;
  emailBody: string;
  sendingEmail: boolean;
  setStickers: (updater: (prev: Sticker[]) => Sticker[]) => void;
  setTextElements: (updater: (prev: TextElementType[]) => TextElementType[]) => void;
  setUserImages: (updater: (prev: UserImage[]) => UserImage[]) => void;
  setGmailModalOpen: (open: boolean) => void;
  setRecipientEmail: (email: string) => void;
  setEmailSubject: (subject: string) => void;
  setEmailBody: (body: string) => void;
  handleDownloadImage: () => void;
  handleOpenGmailModal: () => void;
  handleSendViaSmtp: () => void;
  handleSendViaGmailOAuth: () => void;
  saveToHistory: () => void;
}

export function RightPanel({
  selectedSticker,
  selectedText,
  selectedImageId,
  stickers,
  textElements,
  userImages,
  exporting,
  gmailModalOpen,
  recipientEmail,
  emailSubject,
  emailBody,
  sendingEmail,
  setStickers,
  setTextElements,
  setUserImages,
  setGmailModalOpen,
  setRecipientEmail,
  setEmailSubject,
  setEmailBody,
  handleDownloadImage,
  handleOpenGmailModal,
  handleSendViaSmtp,
  handleSendViaGmailOAuth,
  saveToHistory,
}: RightPanelProps) {
  const selectedStickerData = stickers.find(s => s.id === selectedSticker);
  const selectedImage = userImages.find(img => img.id === selectedImageId);

  return (
    <div className="hidden lg:visible w-full lg:w-80 xl:w-96 bg-[#0a1628] border-t lg:border-t-0 lg:border-l border-gray-700 p-3 md:p-4 overflow-y-auto max-h-[40vh] lg:max-h-screen">
      <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#26C4E1] bg-clip-text text-transparent">Properties</h2>
      
      <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
        <Button onClick={handleDownloadImage} disabled={exporting} className="w-full text-sm md:text-base" size="lg">
          <Download className="w-3 h-3 md:w-4 md:h-4" /> {exporting ? 'Preparing...' : 'Download PNG'}
        </Button>
        <Button onClick={handleOpenGmailModal} disabled={exporting} variant="outline" className="w-full text-sm md:text-base" size="lg">
          <Mail className="w-3 h-3 md:w-4 md:h-4" /> Send via Gmail
        </Button>
      </div>

      {/* Gmail Modal */}
      {gmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg bg-[#0b1220] border border-gray-700 rounded-lg p-4 md:p-6 shadow-lg">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-100">Send Card via Gmail</h3>
            <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
              <input
                className="w-full p-2 rounded bg-[#071028] text-sm md:text-base text-gray-100 border border-gray-700"
                placeholder="Recipient email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
              <input
                className="w-full p-2 rounded bg-[#071028] text-sm md:text-base text-gray-100 border border-gray-700"
                placeholder="Subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
              <textarea
                className="w-full p-2 rounded bg-[#071028] text-sm md:text-base text-gray-100 border border-gray-700"
                rows={4}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setGmailModalOpen(false)} className="text-sm md:text-base">
                Cancel
              </Button>
              <Button onClick={handleSendViaSmtp} disabled={sendingEmail || !recipientEmail} className="text-sm md:text-base">
                {sendingEmail ? 'Sending…' : 'Send'}
              </Button>
              <Button onClick={handleSendViaGmailOAuth} disabled={sendingEmail || !recipientEmail} variant="outline">
                {sendingEmail ? 'Sending…' : 'Authorize & Send (Gmail API)'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sticker Properties */}
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
          <ShapeSelector selectedShape={selectedStickerData.shape || 'rectangle'} onShapeChange={(shape) => {
            setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, shape } : s));
            saveToHistory();
          }} />
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
          <Slider.Root
            className="relative flex items-center w-full h-5 mb-2"
            value={[selectedStickerData.width]}
            onValueChange={(value) => {
              const newSize = value[0];
              const aspectRatio = selectedStickerData.width / selectedStickerData.height;
              setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, width: newSize, height: newSize / aspectRatio } : s));
            }}
            max={300}
            min={30}
          >
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
          <Slider.Root
            className="relative flex items-center w-full h-5"
            value={[selectedStickerData.rotation]}
            onValueChange={(value) => {
              setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, rotation: value[0] } : s));
            }}
            onValueCommit={() => saveToHistory()}
            max={360}
            min={0}
            step={1}
          >
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
              <Slider.Root
                className="relative flex items-center w-full h-5"
                value={[selectedStickerData.outlineWidth || 0]}
                onValueChange={(value) => {
                  setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, outlineWidth: value[0] } : s));
                }}
                max={10}
                min={0}
                step={1}
              >
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
          <Slider.Root
            className="relative flex items-center w-full h-5"
            value={[selectedStickerData.borderRadius || 0]}
            onValueChange={(value) => {
              setStickers(prev => prev.map(s => s.id === selectedStickerData.id ? { ...s, borderRadius: value[0] } : s));
            }}
            max={100}
            min={0}
            step={1}
          >
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

      {/* Image Properties */}
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
          <ShapeSelector selectedShape={selectedImage.shape} onShapeChange={(shape) => {
            setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, shape } : img));
            saveToHistory();
          }} />
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
          <Slider.Root
            className="relative flex items-center w-full h-5 mb-2"
            value={[selectedImage.width]}
            onValueChange={(value) => {
              const newWidth = value[0];
              const aspectRatio = selectedImage.width / selectedImage.height;
              setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, width: newWidth, height: newWidth / aspectRatio } : img));
            }}
            max={600}
            min={50}
          >
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
          <Slider.Root
            className="relative flex items-center w-full h-5"
            value={[selectedImage.rotation]}
            onValueChange={(value) => {
              setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, rotation: value[0] } : img));
            }}
            onValueCommit={() => saveToHistory()}
            max={360}
            min={0}
            step={1}
          >
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
              <Slider.Root
                className="relative flex items-center w-full h-5"
                value={[selectedImage.outlineWidth || 0]}
                onValueChange={(value) => {
                  setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, outlineWidth: value[0] } : img));
                }}
                max={10}
                min={0}
                step={1}
              >
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
          <Slider.Root
            className="relative flex items-center w-full h-5"
            value={[selectedImage.borderRadius || 0]}
            onValueChange={(value) => {
              setUserImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, borderRadius: value[0] } : img));
            }}
            max={100}
            min={0}
            step={1}
          >
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

      {/* Text Properties - empty state shown if needed */}
      {!selectedStickerData && !selectedImage && !selectedText && (
        <div className="text-sm text-gray-400 space-y-2">
          <p className="mb-4">Select a sticker or image to customize.</p>
        </div>
      )}
    </div>
  );
}
