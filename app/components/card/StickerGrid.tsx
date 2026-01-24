import Image from 'next/image';

interface StickerGridProps {
  stickers: string[];
  type: 'alpha' | 'emoji' | 'icon';
  onStickerClick: (sticker: string, isEmoji?: boolean, isIcon?: boolean) => void;
  onDragStart: (e: React.DragEvent, sticker: string, isEmoji?: boolean, isIcon?: boolean) => void;
  iconData?: Array<{ name: string; icon: any; color: string }>;
}

export function StickerGrid({ stickers, type, onStickerClick, onDragStart, iconData }: StickerGridProps) {
  const gridClass = type === 'alpha' ? 'grid-cols-2 sm:grid-cols-3' : type === 'emoji' ? 'grid-cols-4 sm:grid-cols-5' : 'grid-cols-3 sm:grid-cols-4';
  const borderColor = type === 'alpha' ? '#26C4E1' : type === 'emoji' ? '#ec4899' : '#a855f7';

  if (type === 'icon' && iconData) {
    return (
      <div className={`grid ${gridClass} gap-1.5 md:gap-2`}>
        {iconData.map((iconItem, index) => {
          const IconComponent = iconItem.icon;
          const iconString = `icon:${iconItem.name}:${iconItem.color}`;
          return (
            <div
              key={index}
              draggable
              onDragStart={(e) => onDragStart(e, iconString, false, true)}
              onClick={() => onStickerClick(iconString, false, true)}
              className="aspect-square border-2 border-gray-600 rounded-lg hover:border-[#a855f7] hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition bg-[#0a1628] cursor-grab active:cursor-grabbing flex items-center justify-center"
              title={`${iconItem.name} - Drag to canvas or click to add`}
            >
              <IconComponent size={24} className="sm:w-8 sm:h-8" color={iconItem.color} strokeWidth={2} />
            </div>
          );
        })}
      </div>
    );
  }

  if (type === 'emoji') {
    return (
      <div className={`grid ${gridClass} gap-1.5 md:gap-2`}>
        {stickers.map((emoji, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => onDragStart(e, emoji, true, false)}
            onClick={() => onStickerClick(emoji, true, false)}
            className="text-2xl sm:text-3xl aspect-square border-2 border-gray-600 rounded-lg hover:border-[#ec4899] hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition bg-[#0a1628] cursor-grab active:cursor-grabbing flex items-center justify-center"
            title="Drag to canvas or click to add"
          >
            {emoji}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${gridClass} gap-1.5 md:gap-2`}>
      {stickers.map((sticker, index) => (
        <div
          key={index}
          draggable
          onDragStart={(e) => onDragStart(e, sticker, false)}
          onClick={() => onStickerClick(sticker)}
          className="aspect-square border-2 border-gray-600 rounded-lg hover:border-[#26C4E1] hover:shadow-[0_0_15px_rgba(38,196,225,0.5)] transition overflow-hidden bg-[#0a1628] cursor-grab active:cursor-grabbing"
          title="Drag to canvas or click to add"
        >
          <Image
            src={sticker}
            alt="ALPHA sticker"
            width={60}
            height={60}
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
      ))}
    </div>
  );
}
