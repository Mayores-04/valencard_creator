interface ResizeHandlesProps {
  onResizeStart: (e: React.MouseEvent, id: string, corner: string) => void;
  onRotateStart?: (e: React.MouseEvent, id: string) => void;
  elementId: string;
  color?: string;
}

export function ResizeHandles({ onResizeStart, onRotateStart, elementId, color = 'pink' }: ResizeHandlesProps) {
  const handleColor = color === 'pink' ? 'bg-pink-500' : 'bg-blue-500';

  return (
    <>
      {/* Corner resize handles */}
      <div
        className={`absolute -top-1 -left-1 w-3 h-3 ${handleColor} rounded-full cursor-nw-resize hover:w-4 hover:h-4 hover:-top-1.5 hover:-left-1.5 transition-all z-[100] pointer-events-auto`}
        onMouseDown={(e) => onResizeStart(e, elementId, 'nw')}
        draggable={false}
      />
      <div
        className={`absolute -top-1 -right-1 w-3 h-3 ${handleColor} rounded-full cursor-ne-resize hover:w-4 hover:h-4 hover:-top-1.5 hover:-right-1.5 transition-all z-[100] pointer-events-auto`}
        onMouseDown={(e) => onResizeStart(e, elementId, 'ne')}
        draggable={false}
      />
      <div
        className={`absolute -bottom-1 -left-1 w-3 h-3 ${handleColor} rounded-full cursor-sw-resize hover:w-4 hover:h-4 hover:-bottom-1.5 hover:-left-1.5 transition-all z-[100] pointer-events-auto`}
        onMouseDown={(e) => onResizeStart(e, elementId, 'sw')}
        draggable={false}
      />
      <div
        className={`absolute -bottom-1 -right-1 w-3 h-3 ${handleColor} rounded-full cursor-se-resize hover:w-4 hover:h-4 hover:-bottom-1.5 hover:-right-1.5 transition-all z-[100] pointer-events-auto`}
        onMouseDown={(e) => onResizeStart(e, elementId, 'se')}
        draggable={false}
      />

      {/* Rotation handle */}
      {onRotateStart && (
        <div
          className={`absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 ${handleColor} rounded-full cursor-grab hover:cursor-grabbing hover:w-7 hover:h-7 transition-all z-[100] pointer-events-auto flex items-center justify-center shadow-lg`}
          onMouseDown={(e) => onRotateStart(e, elementId)}
          draggable={false}
          title="Rotate"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
        </div>
      )}
    </>
  );
}
