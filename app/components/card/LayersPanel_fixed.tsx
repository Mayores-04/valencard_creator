import React from 'react';
import { Eye, EyeOff, GripVertical, Trash2 } from 'lucide-react';

type LayerItem = {
  id: string;
  type: 'sticker' | 'text' | 'image';
  label: string;
  thumbnail?: string | null;
  hidden?: boolean;
};

interface Props {
  layers: LayerItem[];
  selectedId: string | null;
  onSelect: (id: string, type: LayerItem['type']) => void;
  onBringForward: (id: string, type: LayerItem['type']) => void;
  onSendBackward: (id: string, type: LayerItem['type']) => void;
  onBringToFront: (id: string, type: LayerItem['type']) => void;
  onSendToBack: (id: string, type: LayerItem['type']) => void;
  onDelete: (id: string, type: LayerItem['type']) => void;
  onToggleHidden: (id: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

export default function LayersPanel({
  layers,
  selectedId,
  onSelect,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onDelete,
  onToggleHidden,
  onReorder,
}: Props) {
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const from = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!Number.isNaN(from) && from !== dropIndex && onReorder) {
      onReorder(from, dropIndex);
    }
  };

  return (
    <div className="bg-[#071028] border border-gray-700 rounded-lg shadow-lg p-2 max-60 text-sm text-gray-200">
      <div className="flex items-center justify-between px-2 py-1 mb-2">
        <strong className="text-xs text-gray-300">Layers</strong>
      </div>

      <div className="space-y-1 overflow-auto max-h-[420px]">
        {layers.map((layer, index) => (
          <div
            key={`${layer.type}-${layer.id}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, index)}
            className={`flex items-center gap-2 px-2 py-1 rounded cursor-move transition-all ${
              selectedId === layer.id
                ? 'bg-[#0b1220] ring-1 ring-[#26C4E1]'
                : 'hover:bg-[#071827]'
            }`}
          >
            <GripVertical className="w-3 h-3 text-gray-500 flex-shrink-0" />

            <button
              onClick={() => onToggleHidden(layer.id)}
              className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:bg-gray-800 flex-shrink-0"
            >
              {layer.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>

            <button
              onClick={() => onSelect(layer.id, layer.type)}
              className="flex-1 text-left truncate min-w-0"
              title={`${layer.type} ${layer.label}`}
            >
              <div className="text-xs truncate">{layer.label}</div>
              <div className="text-[10px] text-gray-400">{layer.type}</div>
            </button>

            <button
              onClick={() => onDelete(layer.id, layer.type)}
              className="p-1 rounded hover:bg-red-900/20 text-red-400 flex-shrink-0"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
