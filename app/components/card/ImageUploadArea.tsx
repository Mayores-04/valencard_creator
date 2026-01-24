import Image from 'next/image';
import { Upload } from 'lucide-react';
import { ResizeHandles } from './ResizeHandles';

interface ImageUploadAreaProps {
  userImage: string | null;
  imageSize: { width: number; height: number; x: number; y: number } | null;
  imageArea: { x: number; y: number; width: number; height: number };
  imageShape: 'rectangle' | 'circle' | 'heart' | 'star' | 'rounded';
  imageOffset: { x: number; y: number };
  isSelected: boolean;
  isDragging: boolean;
  isPanning: boolean;
  isResizing: boolean;
  onImageClick: () => void;
  onImageMouseDown: (e: React.MouseEvent) => void;
  onResizeStart: (e: React.MouseEvent, corner: string) => void;
  getImageClipPath: (shape: string) => string;
}

export function ImageUploadArea({
  userImage,
  imageSize,
  imageArea,
  imageShape,
  imageOffset,
  isSelected,
  isDragging,
  isPanning,
  isResizing,
  onImageClick,
  onImageMouseDown,
  onResizeStart,
  getImageClipPath,
}: ImageUploadAreaProps) {
  const effectiveSize = imageSize || imageArea;

  return (
    <div
      className={`absolute ${!isResizing && !isDragging && !isPanning ? 'cursor-grab' : isPanning ? 'cursor-grabbing' : isDragging ? 'cursor-grabbing' : 'cursor-default'} ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
      style={{
        left: `${effectiveSize.x}px`,
        top: `${effectiveSize.y}px`,
        width: `${effectiveSize.width}px`,
        height: `${effectiveSize.height}px`,
        clipPath: getImageClipPath(imageShape),
      }}
      onClick={onImageClick}
      onMouseDown={onImageMouseDown}
      draggable={false}
    >
      {userImage ? (
        <Image
          src={userImage}
          alt="User uploaded"
          fill
          className="select-none pointer-events-none"
          style={{
            objectFit: 'cover',
            objectPosition: `${50 + imageOffset.x}% ${50 + imageOffset.y}%`,
          }}
          draggable={false}
        />
      ) : (
        <div className="w-full h-full border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center bg-gray-50">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Click to upload image</span>
        </div>
      )}

      {/* Resize handles for image */}
      {isSelected && userImage && (
        <ResizeHandles onResizeStart={(e, _, corner) => onResizeStart(e, corner)} elementId="image" color="purple" />
      )}
    </div>
  );
}
