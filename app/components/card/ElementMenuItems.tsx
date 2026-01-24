import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { Copy, MoveUp, MoveDown, ArrowUpToLine, ArrowDownToLine, Trash2 } from 'lucide-react';

interface MenuItemsProps {
  elementId: string;
  elementType: 'sticker' | 'text' | 'image';
  onCopy: (id: string, type: 'sticker' | 'text' | 'image') => void;
  onBringToFront: (id: string, type: 'sticker' | 'text' | 'image') => void;
  onBringForward: (id: string, type: 'sticker' | 'text' | 'image') => void;
  onSendBackward: (id: string, type: 'sticker' | 'text' | 'image') => void;
  onSendToBack: (id: string, type: 'sticker' | 'text' | 'image') => void;
  onDelete: (id: string, type: 'sticker' | 'text' | 'image') => void;
}

export function DropdownMenuItems({ elementId, elementType, onCopy, onBringToFront, onBringForward, onSendBackward, onSendToBack, onDelete }: MenuItemsProps) {
  return (
    <>
      <DropdownMenu.Item
        className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#26C4E1]/10 rounded flex items-center gap-2"
        onSelect={() => onCopy(elementId, elementType)}
      >
        <Copy className="w-4 h-4 text-[#26C4E1]" /> Copy
      </DropdownMenu.Item>
      <DropdownMenu.Separator className="h-px bg-gray-700 my-1" />
      <DropdownMenu.Item
        className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
        onSelect={() => onBringToFront(elementId, elementType)}
      >
        <ArrowUpToLine className="w-4 h-4 text-[#a855f7]" /> Bring to Front
      </DropdownMenu.Item>
      <DropdownMenu.Item
        className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
        onSelect={() => onBringForward(elementId, elementType)}
      >
        <MoveUp className="w-4 h-4 text-[#a855f7]" /> Bring Forward
      </DropdownMenu.Item>
      <DropdownMenu.Item
        className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
        onSelect={() => onSendBackward(elementId, elementType)}
      >
        <MoveDown className="w-4 h-4 text-[#a855f7]" /> Send Backward
      </DropdownMenu.Item>
      <DropdownMenu.Item
        className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
        onSelect={() => onSendToBack(elementId, elementType)}
      >
        <ArrowDownToLine className="w-4 h-4 text-[#a855f7]" /> Send to Back
      </DropdownMenu.Item>
      <DropdownMenu.Separator className="h-px bg-gray-700 my-1" />
      <DropdownMenu.Item
        className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-red-900/20 rounded flex items-center gap-2 text-red-400"
        onSelect={() => onDelete(elementId, elementType)}
      >
        <Trash2 className="w-4 h-4" /> Delete
      </DropdownMenu.Item>
    </>
  );
}

export function ContextMenuItems({ elementId, elementType, onCopy, onBringToFront, onBringForward, onSendBackward, onSendToBack, onDelete }: MenuItemsProps) {
  return (
    <>
      <ContextMenu.Item
        className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#26C4E1]/10 rounded flex items-center gap-2"
        onSelect={() => onCopy(elementId, elementType)}
      >
        <Copy className="w-4 h-4 text-[#26C4E1]" /> Copy
      </ContextMenu.Item>
      <ContextMenu.Separator className="h-px bg-gray-700 my-1" />
      <ContextMenu.Item
        className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
        onSelect={() => onBringToFront(elementId, elementType)}
      >
        <ArrowUpToLine className="w-4 h-4 text-[#a855f7]" /> Bring to Front
      </ContextMenu.Item>
      <ContextMenu.Item
        className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
        onSelect={() => onBringForward(elementId, elementType)}
      >
        <MoveUp className="w-4 h-4 text-[#a855f7]" /> Bring Forward
      </ContextMenu.Item>
      <ContextMenu.Item
        className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
        onSelect={() => onSendBackward(elementId, elementType)}
      >
        <MoveDown className="w-4 h-4 text-[#a855f7]" /> Send Backward
      </ContextMenu.Item>
      <ContextMenu.Item
        className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-[#a855f7]/10 rounded flex items-center gap-2"
        onSelect={() => onSendToBack(elementId, elementType)}
      >
        <ArrowDownToLine className="w-4 h-4 text-[#a855f7]" /> Send to Back
      </ContextMenu.Item>
      <ContextMenu.Separator className="h-px bg-gray-700 my-1" />
      <ContextMenu.Item
        className="text-sm px-3 py-2 outline-none cursor-pointer hover:bg-red-900/20 rounded flex items-center gap-2 text-red-400"
        onSelect={() => onDelete(elementId, elementType)}
      >
        <Trash2 className="w-4 h-4" /> Delete
      </ContextMenu.Item>
    </>
  );
}
