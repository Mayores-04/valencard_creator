import Image from 'next/image';
import * as ContextMenu from '@radix-ui/react-context-menu';
// removed DropdownMenu 3-dot trigger per UX change; use right-click context menu only
import { ContextMenuItems } from './ElementMenuItems';
import { ResizeHandles } from './ResizeHandles';

interface UserImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  shape: 'rectangle' | 'circle' | 'heart' | 'star' | 'rounded';
  offset: { x: number; y: number };
  outlineColor?: string;
  outlineWidth?: number;
  borderRadius?: number;
}

interface ImageElementProps {
  image: UserImage;
  isSelected: boolean;
  isDragging: boolean;
  isResizing: boolean;
  isPanning: boolean;
  onMouseDown: (e: React.MouseEvent, id: string, type: 'image', x: number, y: number) => void;
  onResizeStart: (e: React.MouseEvent, id: string, corner: string, type: 'image') => void;
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

export function ImageElement({
  image,
  isSelected,
  isDragging,
  isResizing,
  isPanning,
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
}: ImageElementProps) {
  // defensive defaults to avoid NaN/invalid CSS when properties are undefined
  const outlineWidth = typeof image.outlineWidth === "number" ? image.outlineWidth : 0;
  const elementBorderRadius = typeof image.borderRadius === "number" ? image.borderRadius : 0;
  const offsetX = image?.offset && typeof image.offset.x === "number" ? image.offset.x : 0;
  const offsetY = image?.offset && typeof image.offset.y === "number" ? image.offset.y : 0;

  return (
    <div
      className={`absolute ${isSelected ? 'ring-2 ring-pink-500' : ''}`}
      style={{
        left: `${image.x}px`,
        top: `${image.y}px`,
        width: `${image.width}px`,
        height: `${image.height}px`,
        transform: `rotate(${image.rotation}deg)`,
        userSelect: 'none',
      }}
    >
      <ContextMenu.Root key={image.id}>
        <ContextMenu.Trigger asChild>
          {/* Image container with shape and outline */}
          <div
            onMouseDown={(e) => {
              if (!isResizing && e.detail === 1) {
                onMouseDown(e, image.id, 'image', image.x, image.y);
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(image.id);
            }}
            className={`absolute inset-0 group ${
              isPanning ? 'cursor-grabbing' : 
              !isResizing && !isDragging ? 'cursor-grab' : 
              isDragging ? 'cursor-grabbing' : 'cursor-default'
            }`}
            style={{
              overflow: 'visible',
              pointerEvents: 'auto',
            }}
            draggable={false}
          >
            {/* Outline layer - rendered behind with same clip-path */}
            {outlineWidth > 0 && (
              <div
                className="absolute"
                style={{
                  inset: `${-outlineWidth}px`,
                  clipPath: image.shape && image.shape !== 'rectangle' ? getClipPath(image.shape) : undefined,
                  backgroundColor: image.outlineColor || '#000000',
                  zIndex: 0,
                  borderRadius: elementBorderRadius ? `${elementBorderRadius + outlineWidth}px` : undefined,
                  overflow: elementBorderRadius ? 'hidden' : undefined,
                }}
              />
            )}
            {/* Main image content */}
            <div 
              className="absolute inset-0 "
              style={{
                zIndex: 1,
                borderRadius: image.borderRadius ? `${image.borderRadius}px` : undefined,
                overflow: image.borderRadius ? 'hidden' : undefined,
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  clipPath: image.shape && image.shape !== 'rectangle' ? getClipPath(image.shape) : undefined,
                }}
              >
                <Image
                  src={image.src}
                  alt="User uploaded"
                  fill
                  className="pointer-events-none"
                  style={{
                    objectFit: 'cover',
                    objectPosition: `${50 + offsetX}% ${50 + offsetY}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Portal >
          <ContextMenu.Content >
            <ContextMenuItems
              elementId={image.id}
              elementType="image"
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

      {/* Resize and Rotation handles - outside context menu */}
      {isSelected && (
        <ResizeHandles 
          onResizeStart={(e, id, corner) => onResizeStart(e, id, corner, 'image')} 
          onRotateStart={onRotateStart ? (e) => onRotateStart(e, image.id) : undefined}
          elementId={image.id} 
          color="#26C4E1" 
        />
      )}
    </div>
  );
}