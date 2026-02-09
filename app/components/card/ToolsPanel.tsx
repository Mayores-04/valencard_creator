"use client";
import React, { useRef } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ChevronDown, Type } from "lucide-react";
import {
  StickerGrid,
  ImageUploadPanel,
  TextControls,
  BackgroundSelector,
} from "@/app/components/card";

interface Props {
  className?: string;
  hideTools: () => void;
  addSticker: any;
  handleSidebarDragStart: any;
  alphaStickers: any[];
  loveStickers: any[];
  iconStickers: any[];
  handleImageUpload: any;
  selectedImage: any;
  selectedImageId: string | null;
  createUploadSession: any;
  startPolling: any;
  uploadSessionId: string | null;
  stopPolling: any;
  lastPolledFiles?: string[];
  lastPolledDebug?: any;
  addText: any;
  addTextTemplate: any;
  textTemplates: any[];
  fontFamilies: any[];
  updateTextFont: any;
  updateTextColor: any;
  updateTextSize: any;
  background: string;
  setBackground: any;
  solidColors: any[];
  gradients: any[];
  patterns: any[];
  backgroundImages: any[];
  deleteSelected: any;
  selectedSticker: string | null;
  selectedText: string | null;
  selectedImageIdProp: string | null;
}

export default function ToolsPanel(props: Props) {
  const {
    className,
    hideTools,
    addSticker,
    handleSidebarDragStart,
    alphaStickers,
    loveStickers,
    iconStickers,
    handleImageUpload,
    selectedImage,
    selectedImageId,
    createUploadSession,
    startPolling,
    uploadSessionId,
    stopPolling,
    lastPolledFiles,
    lastPolledDebug,
    addText,
    addTextTemplate,
    textTemplates,
    fontFamilies,
    updateTextFont,
    updateTextColor,
    updateTextSize,
    background,
    setBackground,
    solidColors,
    gradients,
    patterns,
    backgroundImages,
    deleteSelected,
    selectedSticker,
    selectedText,
    selectedImageIdProp,
  } = props;

  return (
    <ScrollArea.Root className={className}>
      <ScrollArea.Viewport className="w-full h-full p-4">
        <div className="flex w-full justify-between items-center mb-6">
          <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#26C4E1] bg-clip-text text-transparent">
            Tools
          </h2>
          <ChevronDown className="visible lg:hidden" onClick={hideTools} />
        </div>

        <Tabs.Root defaultValue="stickers" className="w-full">
          <Tabs.List className="grid grid-cols-2 md:grid-cols-2 gap-1.5 md:gap-2 mb-3 md:mb-4">
            <Tabs.Trigger
              value="stickers"
              className="px-3 py-2 rounded-md text-sm font-medium bg-[#071028] text-gray-200 hover:bg-[#0b1220] focus:outline-none focus:ring-2 focus:ring-[#26C4E1]"
            >
              Stickers
            </Tabs.Trigger>
            <Tabs.Trigger
              value="image"
              className="px-3 py-2 rounded-md text-sm font-medium bg-[#071028] text-gray-200 hover:bg-[#0b1220] focus:outline-none focus:ring-2 focus:ring-[#26C4E1]"
            >
              Image
            </Tabs.Trigger>
            <Tabs.Trigger
              value="text"
              className="px-3 py-2 rounded-md text-sm font-medium bg-[#071028] text-gray-200 hover:bg-[#0b1220] focus:outline-none focus:ring-2 focus:ring-[#26C4E1]"
            >
              Text
            </Tabs.Trigger>
            <Tabs.Trigger
              value="background"
              className="px-3 py-2 rounded-md text-sm font-medium bg-[#071028] text-gray-200 hover:bg-[#0b1220] focus:outline-none focus:ring-2 focus:ring-[#26C4E1]"
            >
              BG
            </Tabs.Trigger>
          </Tabs.List>

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

          <Tabs.Content value="image" className="outline-none">
            <ImageUploadPanel
              userImage={selectedImage?.src || null}
              imageShape={selectedImage?.shape || "rectangle"}
              fileInputRef={useRef<HTMLInputElement | null>(null)}
              hasImageArea={true}
              onImageUpload={handleImageUpload}
              onImageRemove={() => {}}
              onShapeChange={() => {}}
            />

            <div className="mt-4 p-3 border border-gray-700 rounded bg-[#071028]">
              <h3 className="font-semibold mb-2 text-gray-300">Insert from Phone (Scan QR)</h3>
              {!uploadSessionId ? (
                <div className="flex flex-col gap-2">
                  <Button onClick={() => { const s = createUploadSession(); startPolling(s); }} size="sm">Create Session & QR</Button>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col items-center gap-3">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`${location.origin}/upload/${uploadSessionId}`)}`} alt="QR" />
                    <div>
                      <div className="text-sm text-gray-300">Open this on your phone:</div>
                      <a className="text-xs text-cyan-300 break-all" href={`/upload/${uploadSessionId}`} target="_blank" rel="noreferrer">{`${location.origin}/upload/${uploadSessionId}`}</a>
                      <div className="mt-2 flex gap-2">
                        <Button onClick={() => navigator.clipboard?.writeText(`${location.origin}/upload/${uploadSessionId}`)} size="sm">Copy URL</Button>
                        <Button onClick={() => { stopPolling(); }} variant="destructive" size="sm">Stop</Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-400">New uploads will automatically appear on the canvas.</div>
                </div>
              )}
            </div>
          </Tabs.Content>

          <Tabs.Content value="text" className="outline-none">
            <Button onClick={addText} className="w-full mb-4" size="lg"><Type size={18} /> Add Custom Text</Button>
            <Separator.Root className="my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-3 text-gray-300">Text Templates</h3>
            <div className="grid grid-cols-1 gap-2 mb-4">
              {textTemplates.map((template: any, index: number) => (
                <Button key={index} onClick={() => addTextTemplate(template)} variant="outline" className="text-left justify-start h-auto py-3 border-gray-600 hover:border-[#26C4E1]" style={{ fontFamily: template.fontFamily, color: template.color, fontSize: "18px" }}>{template.text}</Button>
              ))}
            </div>
            <Separator.Root className="my-4 h-px bg-gray-700" />
            <TextControls selectedTextId={selectedText || ""} textElement={undefined} fontFamilies={fontFamilies} onFontChange={updateTextFont} onColorChange={updateTextColor} onSizeChange={updateTextSize} />
          </Tabs.Content>

          <Tabs.Content value="background" className="outline-none">
            <BackgroundSelector currentBackground={background} onBackgroundChange={setBackground} solidColors={solidColors} gradients={gradients} patterns={patterns} backgroundImages={backgroundImages} />
            <Separator.Root className="my-4 h-px bg-gray-700" />
            <h3 className="font-semibold mb-3 text-gray-300">Custom Color</h3>
            <Input type="color" value={background.startsWith("#") ? background : "#ffffff"} onChange={(e) => setBackground(e.target.value)} onBlur={() => {}} className="w-full h-12 cursor-pointer" />
          </Tabs.Content>
        </Tabs.Root>

        <Separator.Root className="my-3 md:my-4 h-px bg-gray-700" />
        <Button onClick={deleteSelected} disabled={!selectedSticker && !selectedText && !selectedImageId} variant="destructive" className="w-full text-sm md:text-base" size="lg">Delete Selected</Button>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="flex select-none touch-none p-0.5 bg-[#0a1628] data-[orientation=vertical]:w-2.5" orientation="vertical">
        <ScrollArea.Thumb className="flex-1 bg-gradient-to-b from-[#26C4E1] to-[#60a5fa] rounded-lg" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
