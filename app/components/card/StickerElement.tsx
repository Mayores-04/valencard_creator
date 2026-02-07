import Image from 'next/image';
import * as ContextMenu from '@radix-ui/react-context-menu';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/app/components/ui/button';
import { MoreVertical, Heart, Star, Sparkles, Music, Coffee, Gift, Crown, Cake, Flower2, Sun, Moon, Cloud } from 'lucide-react';
import { DropdownMenuItems, ContextMenuItems } from './ElementMenuItems';
import { ResizeHandles } from './ResizeHandles';

interface Sticker {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  shape?: 'rectangle' | 'circle' | 'heart' | 'star' | 'rounded';
  outlineColor?: string;
  outlineWidth?: number;
  borderRadius?: number;
}

interface StickerElementProps {
  sticker: Sticker;
  isSelected: boolean;
  isDragging: boolean;
  isResizing: boolean;
  onMouseDown: (e: React.MouseEvent, id: string, x: number, y: number) => void;
  onResizeStart: (e: React.MouseEvent, id: string, corner: string) => void;
  onRotateStart?: (e: React.MouseEvent, id: string) => void;
  onSelect: (id: string) => void;
  getClipPath: (shape?: string) => string;
  onCopy: (id: string, type: 'sticker' | 'text' | 'image') => void;
  onBringToFront: (id: string, type: 'sticker' | 'text' | 'image') => void;
  onBringForward: (id: string, type: 'sticker' | 'text' | 'image') => void;
  onSendBackward: (id: string, type: 'sticker' | 'text' | 'image') => void;
  onSendToBack: (id: string, type: 'sticker' | 'text' | 'image') => void;
  onDelete: (id: string, type: 'sticker' | 'text' | 'image') => void;
}

const iconStickers = [
  { icon: Heart, color: '#ec4899', name: 'Heart' },
  { icon: Star, color: '#fbbf24', name: 'Star' },
  { icon: Sparkles, color: '#a78bfa', name: 'Sparkles' },
  { icon: Music, color: '#60a5fa', name: 'Music' },
  { icon: Coffee, color: '#92400e', name: 'Coffee' },
  { icon: Gift, color: '#f59e0b', name: 'Gift' },
  { icon: Crown, color: '#fbbf24', name: 'Crown' },
  { icon: Cake, color: '#f472b6', name: 'Cake' },
  { icon: Flower2, color: '#fb7185', name: 'Flower' },
  { icon: Sun, color: '#fbbf24', name: 'Sun' },
  { icon: Moon, color: '#818cf8', name: 'Moon' },
  { icon: Cloud, color: '#93c5fd', name: 'Cloud' },
];

export function StickerElement({
  sticker,
  isSelected,
  isDragging,
  isResizing,
  onMouseDown,
  onResizeStart,
  onRotateStart,
  onSelect,
  getClipPath,
  onCopy,
  onBringToFront,
  onBringForward,
  onSendBackward,
  onSendToBack,
  onDelete,
}: StickerElementProps) {
  const renderSticker = () => {
    if (sticker.src.startsWith('/')) {
      return (
        <Image
          src={sticker.src}
          alt="Sticker"
          width={sticker.width}
          height={sticker.height}
          className="w-full h-full object-contain pointer-events-none"
        />
      );
    }
    
    if (sticker.src.startsWith('icon:')) {
      const [, iconName, iconColor] = sticker.src.split(':');
      const iconItem = iconStickers.find(i => i.name === iconName);
      if (iconItem) {
        const IconComponent = iconItem.icon;
        return (
          <div className="w-full h-full flex items-center justify-center">
            <IconComponent 
              size={Math.min(sticker.width, sticker.height) * 0.8} 
              color={iconColor} 
              strokeWidth={2} 
              className="pointer-events-none" 
            />
          </div>
        );
      }
      return null;
    }
    
    return (
      <span className="text-6xl select-none flex items-center justify-center w-full h-full">
        {sticker.src}
      </span>
    );
  };
  return (
    <ContextMenu.Root key={sticker.id}>
      <ContextMenu.Trigger>
        <div
          className={`absolute ${isSelected ? 'ring-2 ring-pink-500' : ''}`}
          style={{
            left: `${sticker.x}px`,
            top: `${sticker.y}px`,
            width: `${sticker.width}px`,
            height: `${sticker.height}px`,
            transform: `rotate(${sticker.rotation}deg)`,
            userSelect: 'none',
          }}
        >
          {/* Sticker content with shape and outline */}
          <div
            onMouseDown={(e) => {
              if (!isResizing && e.detail === 1) {
                onMouseDown(e, sticker.id, sticker.x, sticker.y);
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(sticker.id);
            }}
            className={`absolute inset-0 group ${!isResizing && !isDragging ? 'cursor-move' : isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
            style={{
              overflow: 'visible',
              pointerEvents: 'auto',
            }}
            draggable={false}
          >
            {/* Outline layer - rendered behind with same clip-path */}
            {sticker.outlineWidth && sticker.outlineWidth > 0 && (
              <div
                className="absolute"
                style={{
                  inset: `${-sticker.outlineWidth}px`,
                  clipPath: sticker.shape && sticker.shape !== 'rectangle' ? getClipPath(sticker.shape) : undefined,
                  backgroundColor: sticker.outlineColor || '#000000',
                  zIndex: 0,
                  borderRadius: sticker.borderRadius ? `${sticker.borderRadius + sticker.outlineWidth}px` : undefined,
                  overflow: sticker.borderRadius ? 'hidden' : undefined,
                }}
              />
            )}
            {/* Main sticker content */}
            <div 
              className="absolute inset-0"
              style={{
                zIndex: 1,
                borderRadius: sticker.borderRadius ? `${sticker.borderRadius}px` : undefined,
                overflow: sticker.borderRadius ? 'hidden' : undefined,
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  clipPath: sticker.shape && sticker.shape !== 'rectangle' ? getClipPath(sticker.shape) : undefined,
                }}
              >
                {renderSticker()}
              </div>
            </div>
          </div>

          {/* Three-dot options button and resize handles - outside clipped area */}
          {isSelected && (
            <>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#a855f7] text-white rounded-full hover:bg-[#9333ea] flex items-center justify-center shadow-lg z-20 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="min-w-[160px] bg-[#1a2332] text-gray-100 rounded-md p-1 shadow-lg border border-gray-700 z-50" side="right" align="start" sideOffset={8}>
                    <DropdownMenuItems
                      elementId={sticker.id}
                      elementType="sticker"
                      onCopy={onCopy}
                      onBringToFront={onBringToFront}
                      onBringForward={onBringForward}
                      onSendBackward={onSendBackward}
                      onSendToBack={onSendToBack}
                      onDelete={onDelete}
                    />
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>

              {/* Resize and Rotation handles */}
              <ResizeHandles 
                onResizeStart={onResizeStart} 
                onRotateStart={onRotateStart ? (e) => onRotateStart(e, sticker.id) : undefined}
                elementId={sticker.id} 
                color="pink" 
              />
            </>
          )}
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="min-w-[160px] bg-[#1a2332] text-gray-100 rounded-md p-1 shadow-lg border border-gray-700 z-50">
          <ContextMenuItems
            elementId={sticker.id}
            elementType="sticker"
            onCopy={onCopy}
            onBringToFront={onBringToFront}
            onBringForward={onBringForward}
            onSendBackward={onSendBackward}
            onSendToBack={onSendToBack}
            onDelete={onDelete}
          />
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
