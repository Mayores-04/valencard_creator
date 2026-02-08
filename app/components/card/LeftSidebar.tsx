import { useState, useRef, useMemo, useCallback } from "react";

import * as ScrollArea  from "@radix-ui/react-scroll-area";
import * as Tabs from "@radix-ui/react-tabs";
import * as Separator from '@radix-ui/react-separator';
import * as Slider from '@radix-ui/react-slider';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

import { ChevronDown, Type } from "lucide-react";

import { 
  Sticker, 
  TextElement as TextElementType,
  UserImage,
  StickerGrid,
  BackgroundSelector,
  TextControls,
  ImageUploadPanel
} from '@/app/components/card';

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

type ElementType = 'sticker' | 'text' | 'image';

export let toolMinimized = false;

interface LeftSidebarProps {
  selectedImageId: string | null;
  selectedText: string | null;
  selectedSticker: string | null;
  userImages: UserImage[];
  textElements: TextElementType[];
  background: string;
  uploadSessionId: string | null;
  lastPolledFiles: string[];
  lastPolledDebug: any;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  addSticker: (src: string, isEmoji?: boolean, isIcon?: boolean) => void;
  addText: () => void;
  addTextTemplate: (template: typeof textTemplates[0]) => void;
  handleSidebarDragStart: (e: React.DragEvent, src: string, isEmoji?: boolean, isIcon?: boolean) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteElement: (id: string, type: ElementType) => void;
  deleteSelected: () => void;
  setBackground: (bg: string) => void;
  updateTextFont: (id: string, font: string) => void;
  updateTextColor: (id: string, color: string) => void;
  updateTextSize: (id: string, size: number) => void;
  createUploadSession: () => string;
  startPolling: (sessionId: string) => void;
  setCroppingImageId: (id: string | null) => void;
  setIsCropping: (value: boolean) => void;
  setCropRect: (rect: { x: number; y: number; w: number; h: number } | null) => void;
  setUserImages: (updater: (prev: UserImage[]) => UserImage[]) => void;
}

export function LeftSidebar({
  selectedImageId,
  selectedText,
  selectedSticker,
  userImages,
  textElements,
  background,
  uploadSessionId,
  lastPolledFiles,
  lastPolledDebug,
  fileInputRef,
  addSticker,
  addText,
  addTextTemplate,
  handleSidebarDragStart,
  handleImageUpload,
  deleteElement,
  deleteSelected,
  setBackground,
  updateTextFont,
  updateTextColor,
  updateTextSize,
  createUploadSession,
  startPolling,
  setCroppingImageId,
  setIsCropping,
  setCropRect,
  setUserImages,
}: LeftSidebarProps) {
  const [toolHidden, isToolHidden] = useState(true);

  const hideTools = () => {
    isToolHidden(false);
    toolMinimized = true;
  };

  const showTools = () => {
    isToolHidden(false);
    toolMinimized = false;
  };

  const selectedImage = useMemo(
    () => (selectedImageId ? userImages.find((img) => img.id === selectedImageId) : null),
    [selectedImageId, userImages]
  );

  const toolVisibilityState = `absolute ${toolHidden ? 'hidden lg:visible' : 'visible'} lg:flex w-full h-full lg:w-72 lg:max-w-xs bg-[#1a2332] border-b lg:border-b-0 lg:border-r border-gray-700 z-100`;

  return (
    <>
      <ScrollArea.Root className={toolVisibilityState} id="toolSidebar">
        <ScrollArea.Viewport className="w-full h-full p-4">
          {/* Heading and minimize */}
          <div className="flex w-full justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#26C4E1] bg-clip-text text-transparent">Tools</h2>
            <ChevronDown className="visible lg:hidden cursor-pointer" onClick={hideTools} />
          </div>

          <Tabs.Root defaultValue="stickers" className="w-full">
            {/* Tool type selection */}
            <Tabs.List className="grid grid-cols-2 md:grid-cols-2 gap-1.5 md:gap-2 mb-3 md:mb-4">
              <Tabs.Trigger
                value="stickers"
                className="px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ec4899] data-[state=active]:to-[#f472b6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(236,72,153,0.5)] data-[state=inactive]:bg-[#0a1628] data-[state=inactive]:text-gray-300"
              >
                Stickers
              </Tabs.Trigger>
              <Tabs.Trigger
                value="image"
                className="px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#fbbf24] data-[state=active]:to-[#f59e0b] data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(251,191,36,0.5)] data-[state=inactive]:bg-[#0a1628] data-[state=inactive]:text-gray-300"
              >
                Image
              </Tabs.Trigger>
              <Tabs.Trigger
                value="text"
                className="px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26C4E1] data-[state=active]:to-[#60a5fa] data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(38,196,225,0.5)] data-[state=inactive]:bg-[#0a1628] data-[state=inactive]:text-gray-300"
              >
                Text
              </Tabs.Trigger>
              <Tabs.Trigger
                value="background"
                className="px-3 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#a855f7] data-[state=active]:to-[#c084fc] data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(168,85,247,0.5)] data-[state=inactive]:bg-[#0a1628] data-[state=inactive]:text-gray-300"
              >
                BG
              </Tabs.Trigger>
            </Tabs.List>

            {/* Stickers */}
            <Tabs.Content value="stickers" className="relative outline-none overflow-auto max-h-full h-full">
              <div className="mb-4">
                <h3 className="font-semibold mb-3 text-gray-300">Stickers</h3>
                <StickerGrid stickers={alphaStickers} type="alpha" onStickerClick={addSticker} onDragStart={handleSidebarDragStart} />
                <Separator.Root className="my-4 h-px bg-gray-700" />
                <StickerGrid stickers={loveStickers} type="emoji" onStickerClick={addSticker} onDragStart={handleSidebarDragStart} />
                <Separator.Root className="my-4 h-px bg-gray-700" />
                <h3 className="font-semibold mb-3 text-gray-300">Icon Stickers</h3>
                <StickerGrid stickers={[]} type="icon" iconData={iconStickers} onStickerClick={addSticker} onDragStart={handleSidebarDragStart} />
              </div>
            </Tabs.Content>

            {/* Image Tab */}
            <Tabs.Content value="image" className="outline-none">
              <ImageUploadPanel
                userImage={selectedImage?.src || null}
                imageShape={selectedImage?.shape || 'rectangle'}
                fileInputRef={fileInputRef}
                hasImageArea={true}
                onImageUpload={handleImageUpload}
                onImageRemove={() => selectedImageId && deleteElement(selectedImageId, 'image')}
                onShapeChange={(shape) => selectedImageId && setUserImages((prev) => prev.map((img) => (img.id === selectedImageId ? { ...img, shape } : img)))}
              />

              {selectedImageId && (
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setCroppingImageId(selectedImageId);
                      setIsCropping(true);
                      setCropRect(null);
                    }}
                  >
                    Crop
                  </Button>
                </div>
              )}

              <div className="mt-4 p-3 border border-gray-700 rounded bg-[#071028]">
                <h3 className="font-semibold mb-2 text-gray-300">Insert from Phone (Scan QR)</h3>
                {!uploadSessionId ? (
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => { const s = createUploadSession(); startPolling(s); }} size="sm">
                      Create Session & QR
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col items-center gap-3">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`${location.origin}/upload/${uploadSessionId}`)}`} alt="QR" />
                      <div>
                        <div className="text-sm text-gray-300">Open this on your phone:</div>
                        <a className="text-xs text-cyan-300 break-all" href={`/upload/${uploadSessionId}`} target="_blank" rel="noreferrer">
                          {`${location.origin}/upload/${uploadSessionId}`}
                        </a>
                        <div className="mt-2 flex gap-2">
                          <Button onClick={() => navigator.clipboard?.writeText(`${location.origin}/upload/${uploadSessionId}`)} size="sm">
                            Copy URL
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-400">New uploads will automatically appear on the canvas.</div>
                    <div className="mt-3 text-xs text-gray-300">
                      <div className="font-medium">Debug — last polled uploads:</div>
                      {lastPolledFiles.length === 0 ? (
                        <div className="text-xs text-gray-400">(no files returned yet)</div>
                      ) : (
                        <ul className="text-xs break-all mt-1">
                          {lastPolledFiles.map((f, i) => (
                            <li key={i} className="mt-1">
                              <a href={f} target="_blank" rel="noreferrer" className="text-cyan-300">
                                {f}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                      {lastPolledDebug && (
                        <div className="mt-2 text-xs text-gray-400">
                          <div className="font-medium">Debug details:</div>
                          <pre className="text-xs whitespace-pre-wrap break-all mt-1">{JSON.stringify(lastPolledDebug, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Tabs.Content>

            {/* Text Tab */}
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
                textElement={textElements.find((t) => t.id === selectedText)}
                fontFamilies={fontFamilies}
                onFontChange={updateTextFont}
                onColorChange={updateTextColor}
                onSizeChange={updateTextSize}
              />
            </Tabs.Content>

            {/* Background Tab */}
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
                className="w-full h-12 cursor-pointer"
              />
            </Tabs.Content>
          </Tabs.Root>

          <Separator.Root className="my-3 md:my-4 h-px bg-gray-700" />
          <Button
            onClick={deleteSelected}
            disabled={!selectedSticker && !selectedText && !selectedImageId}
            variant="destructive"
            className="w-full text-sm md:text-base"
            size="lg"
          >
            Delete Selected
          </Button>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="flex select-none touch-none p-0.5 bg-[#0a1628] data-[orientation=vertical]:w-2.5" orientation="vertical">
          <ScrollArea.Thumb className="flex-1 bg-gradient-to-b from-[#26C4E1] to-[#60a5fa] rounded-lg" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* Toggle button for Tools Sidebar */}
      <div
        className={`${toolHidden ? 'fixed' : 'hidden'} left-0 mx-2 lg:hidden my-1 flex items-start z-50 bg-[#1a2332] rounded-md p-2 shadow-lg border border-gray-700 cursor-pointer`}
        onClick={showTools}
      >
        <span className="p-2 text-xs font-semibold text-gray-100">Tools</span>
      </div>
    </>
  );
}