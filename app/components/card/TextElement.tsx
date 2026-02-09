import * as ContextMenu from '@radix-ui/react-context-menu';
// removed three-dot DropdownMenu trigger; use right-click context menu only
import { ContextMenuItems } from './ElementMenuItems';
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
          {isSelected && onRotateStart && (
            <ResizeHandles 
              onResizeStart={() => {}}
              onRotateStart={(e) => onRotateStart(e, textElement.id)}
              elementId={textElement.id}
              color="blue"
            />
          )}
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content
          className="min-w-[160px] text-gray-100 z-50"
          style={{ background: 'transparent', padding: 0, boxShadow: 'none', border: 'none' }}
        >
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
