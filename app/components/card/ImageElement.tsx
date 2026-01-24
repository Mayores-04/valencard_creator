import Image from 'next/image';
import * as ContextMenu from '@radix-ui/react-context-menu';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/app/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { DropdownMenuItems, ContextMenuItems } from './ElementMenuItems';
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
  return (
    <ContextMenu.Root key={image.id}>
      <ContextMenu.Trigger>
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
            {image.outlineWidth && image.outlineWidth > 0 && (
              <div
                className="absolute"
                style={{
                  inset: `${-image.outlineWidth}px`,
                  clipPath: image.shape && image.shape !== 'rectangle' ? getClipPath(image.shape) : undefined,
                  backgroundColor: image.outlineColor || '#000000',
                  zIndex: 0,
                  borderRadius: image.borderRadius ? `${image.borderRadius + image.outlineWidth}px` : undefined,
                  overflow: image.borderRadius ? 'hidden' : undefined,
                }}
              />
            )}
            {/* Main image content */}
            <div 
              className="absolute inset-0"
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
                    objectPosition: `${50 + image.offset.x}% ${50 + image.offset.y}%`,
                  }}
                />
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
                  <DropdownMenu.Content className="min-w-[160px] bg-[#1a2332] text-gray-100 rounded-md p-1 shadow-lg border border-gray-700 z-50">
                    <DropdownMenuItems
                      elementId={image.id}
                      elementType="image"
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
                onResizeStart={(e, id, corner) => onResizeStart(e, id, corner, 'image')} 
                onRotateStart={onRotateStart ? (e) => onRotateStart(e, image.id) : undefined}
                elementId={image.id} 
                color="#26C4E1" 
              />
            </>
          )}
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="min-w-[160px] bg-[#1a2332] text-gray-100 rounded-md p-1 shadow-lg border border-gray-700 z-50">
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
  );
}
