import Image from 'next/image';
import { ImageIcon, Upload } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ShapeSelector } from '@/app/components/card';

interface ImageUploadPanelProps {
  userImage: string | null;
  imageShape: 'rectangle' | 'circle' | 'heart' | 'star' | 'rounded';
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  hasImageArea: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onShapeChange: (shape: 'rectangle' | 'circle' | 'heart' | 'star' | 'rounded') => void;
}

export function ImageUploadPanel({
  userImage,
  imageShape,
  fileInputRef,
  hasImageArea,
  onImageUpload,
  onImageRemove,
  onShapeChange,
}: ImageUploadPanelProps) {
  // Always allow image upload, regardless of whether there's a designated area or not
  return (
    <div className="space-y-4">
      <div className="p-4 bg-[#0a1628] rounded-lg border border-[#26C4E1]">
        <h3 className="font-semibold mb-2 text-gray-300 flex items-center gap-2">
          <ImageIcon size={18} className="text-[#fbbf24]" />
          Image
        </h3>
        <p className="text-sm text-gray-400 mb-3">
          Upload a photo to your card
        </p>
        
        {!userImage ? (
          <>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full mb-2"
              size="lg"
            >
              <Upload size={18} />
              Upload Your Photo
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
          </>
        ) : (
          <div className="space-y-2">
            <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#26C4E1]">
              <Image
                src={userImage}
                alt="Uploaded image"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                Change
              </Button>
              <Button
                onClick={onImageRemove}
                variant="destructive"
                className="flex-1"
                size="sm"
              >
                Remove
              </Button>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />

            {/* Shape Selector */}
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-400 block mb-2">Image Shape</label>
              <ShapeSelector
                selectedShape={imageShape}
                onShapeChange={onShapeChange}
                size="small"
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-[#1a2332] rounded-lg border border-gray-700">
        <p className="text-xs text-gray-400">
          💡 Tip: Click and drag to move, use corners to resize, choose a shape to customize. Hold <kbd className="px-1 py-0.5 bg-[#26C4E1] text-white rounded text-xs">Alt</kbd> and drag to pan image inside shape.
        </p>
      </div>
    </div>
  );
}
