import * as ContextMenu from '@radix-ui/react-context-menu';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/app/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { DropdownMenuItems, ContextMenuItems } from './ElementMenuItems';
import { ResizeHandles } from './ResizeHandles';

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  rotation: number;
  outlineColor?: string;
  outlineWidth?: number;
}

interface TextElementProps {
  textElement: TextElement;
  isSelected: boolean;
  isDragging: boolean;
  isResizing: boolean;
  onMouseDown: (e: React.MouseEvent, id: string, x: number, y: number) => void;
  onRotateStart?: (e: React.MouseEvent, id: string) => void;
  onSelect: (id: string) => void;
  onCopy: (id: string, type: 'sticker' | 'text' | 'image') => void;
  onBringToFront: (id: string, type: 'sticker' | 'text' | 'image') => void;
  onBringForward: (id: string, type: 'sticker' | 'text' | 'image') => void;
  onSendBackward: (id: string, type: 'sticker' | 'text' | 'image') => void;
  onSendToBack: (id: string, type: 'sticker' | 'text' | 'image') => void;
  onDelete: (id: string, type: 'sticker' | 'text' | 'image') => void;
}

export function TextElementComponent({
  textElement,
  isSelected,
  isDragging,
  isResizing,
  onMouseDown,
  onRotateStart,
  onSelect,
  onCopy,
  onBringToFront,
  onBringForward,
  onSendBackward,
  onSendToBack,
  onDelete,
}: TextElementProps) {
  return (
    <ContextMenu.Root key={textElement.id}>
      <ContextMenu.Trigger>
        <div
          onMouseDown={(e) => {
            if (!isResizing && e.detail === 1) {
              onMouseDown(e, textElement.id, textElement.x, textElement.y);
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(textElement.id);
          }}
          className={`absolute select-none group ${!isResizing && !isDragging ? 'cursor-move' : isDragging ? 'cursor-grabbing' : 'cursor-default'} ${isSelected ? 'ring-2 ring-blue-500 px-2 py-1' : ''}`}
          style={{
            left: `${textElement.x}px`,
            top: `${textElement.y}px`,
            fontSize: `${textElement.fontSize}px`,
            color: textElement.color,
            fontFamily: textElement.fontFamily,
            transform: `rotate(${textElement.rotation}deg)`,
            WebkitTextStroke: textElement.outlineWidth && textElement.outlineWidth > 0 ? `${textElement.outlineWidth}px ${textElement.outlineColor || '#000000'}` : 'none',
          }}
          draggable={false}
        >
          {textElement.text}
          
          {/* Three-dot options button */}
          {isSelected && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#ec4899] text-white rounded-full hover:bg-[#db2777] flex items-center justify-center shadow-lg z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="min-w-[160px] bg-[#1a2332] text-gray-100 rounded-md p-1 shadow-lg border border-gray-700 z-50">
                  <DropdownMenuItems
                    elementId={textElement.id}
                    elementType="text"
                    onCopy={onCopy}
                    onBringToFront={onBringToFront}
                    onBringForward={onBringForward}
                    onSendBackward={onSendBackward}
                    onSendToBack={onSendToBack}
                    onDelete={onDelete}
                  />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>

          {/* Rotation handle for text */}
          {isSelected && onRotateStart && (
            <ResizeHandles 
              onResizeStart={() => {}}
              onRotateStart={(e) => onRotateStart(e, textElement.id)}
              elementId={textElement.id}
              color="blue"
            />
          )}
            </DropdownMenu.Root>
          )}
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="min-w-[160px] bg-[#1a2332] text-gray-100 rounded-md p-1 shadow-lg border border-gray-700 z-50">
          <ContextMenuItems
            elementId={textElement.id}
            elementType="text"
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
