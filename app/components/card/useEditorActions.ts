import { iconStickers } from "../../data/stickers";

// Factory to create addSticker bound function
export function makeAddSticker({ setStickers, selectElement, saveToHistory }: any) {
  return (src: any, isEmoji: boolean = false, isIcon: boolean = false) => {
    // Debug: log incoming src for click-to-add vs drag-to-add differences
    try {
      // eslint-disable-next-line no-console
      console.debug("makeAddSticker called with", { src, isEmoji, isIcon });
    } catch (e) {}

    let normalizedSrc = typeof src === "string" ? src : String(src);

    if (/^\d+$/.test(normalizedSrc)) {
      const idx = parseInt(normalizedSrc, 10);
      if (!Number.isNaN(idx) && iconStickers[idx]) {
        const item = iconStickers[idx];
        normalizedSrc = `icon:${item.name}:${item.color}`;
      }
    }

    if (isIcon) {
      if (!normalizedSrc.startsWith("icon:")) {
        const idx = parseInt(normalizedSrc, 10);
        if (!Number.isNaN(idx) && iconStickers[idx]) {
          const item = iconStickers[idx];
          normalizedSrc = `icon:${item.name}:${item.color}`;
        } else {
          const found = iconStickers.find(
            (i) => i.name.toLowerCase() === normalizedSrc.toLowerCase(),
          );
          if (found) normalizedSrc = `icon:${found.name}:${found.color}`;
          else normalizedSrc = `icon:${normalizedSrc}`;
        }
      }
    }

    const newSticker = {
      id: `sticker-${Date.now()}`,
      src: normalizedSrc,
      x: 200,
      y: 200,
      width: isEmoji ? 80 : isIcon ? 60 : 100,
      height: isEmoji ? 80 : isIcon ? 60 : 100,
      rotation: 0,
      shape: "rectangle",
    };

    setStickers((prev: any) => [...prev, newSticker]);
    selectElement(newSticker.id, "sticker");
    saveToHistory();
  };
}

export function makeHandleSidebarDragStart() {
  return (
    e: React.DragEvent,
    src: string,
    isEmoji: boolean = false,
    isIcon: boolean = false,
  ) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("src", src);
    e.dataTransfer.setData("isEmoji", isEmoji.toString());
    e.dataTransfer.setData("isIcon", isIcon.toString());
    e.dataTransfer.setData("newItem", "true");
  };
}

export function makeHandleDrop({
  canvasRef,
  stickers,
  selectElement,
  updateStickerPosition,
  updateTextPosition,
  saveToHistory,
  setStickers,
}: any) {
  return (e: React.DragEvent) => {
    e.preventDefault();
    const isNewItem = e.dataTransfer.getData("newItem");

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isNewItem === "true") {
        const src = e.dataTransfer.getData("src");
        const isEmoji = e.dataTransfer.getData("isEmoji") === "true";
        const isIcon = e.dataTransfer.getData("isIcon") === "true";
        const newSticker = {
          id: `sticker-${Date.now()}`,
          src,
          x: x - (isEmoji ? 40 : isIcon ? 30 : 50),
          y: y - (isEmoji ? 40 : isIcon ? 30 : 50),
          width: isEmoji ? 80 : isIcon ? 60 : 100,
          height: isEmoji ? 80 : isIcon ? 60 : 100,
          rotation: 0,
          shape: "rectangle",
        };
        setStickers((prev: any) => [...prev, newSticker]);
        selectElement(newSticker.id, "sticker");
        saveToHistory();
      } else {
        const id = e.dataTransfer.getData("id");
        const type = e.dataTransfer.getData("type");

        if (type === "sticker") {
          const sticker = stickers.find((s: any) => s.id === id);
          if (sticker)
            updateStickerPosition(
              id,
              x - sticker.width / 2,
              y - sticker.height / 2,
            );
        } else if (type === "text") {
          updateTextPosition(id, x, y);
        }
      }
    }
  };
}

export function makeHandleImageUpload({ setUserImages, templateData, selectElement, saveToHistory }: any) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;

        setUserImages((prev: any) => {
          const baseIndex = prev.length;
          const newImage = {
            id: `image-${Date.now()}-${baseIndex + index}`,
            src: result,
            x:
              (templateData?.imageArea ? templateData.imageArea.x : 150) +
              (baseIndex + index) * 20,
            y:
              (templateData?.imageArea ? templateData.imageArea.y : 150) +
              (baseIndex + index) * 20,
            width: templateData?.imageArea
              ? templateData.imageArea.width
              : 300,
            height: templateData?.imageArea
              ? templateData.imageArea.height
              : 300,
            rotation: 0,
            shape: "rectangle",
            offset: { x: 0, y: 0 },
            outlineColor: undefined,
            outlineWidth: 0,
          };

          setTimeout(() => selectElement(newImage.id, "image"), 0);

          return [...prev, newImage];
        });
      };
      reader.readAsDataURL(file);
    });

    e.currentTarget.value = "";
    saveToHistory();
  };
}
