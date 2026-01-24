import { Heart, Star } from 'lucide-react';

interface ShapeSelectorProps {
  selectedShape: 'rectangle' | 'circle' | 'heart' | 'star' | 'rounded';
  onShapeChange: (shape: 'rectangle' | 'circle' | 'heart' | 'star' | 'rounded') => void;
  size?: 'small' | 'medium';
}

export function ShapeSelector({ selectedShape, onShapeChange, size = 'medium' }: ShapeSelectorProps) {
  const iconSize = size === 'small' ? 16 : 24;
  const gridClass = size === 'small' ? 'grid grid-cols-5 gap-1.5 md:gap-2' : 'grid grid-cols-5 gap-1.5 md:gap-2';

  return (
    <div className={gridClass}>
      <button
        onClick={() => onShapeChange('rectangle')}
        className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
          selectedShape === 'rectangle'
            ? 'border-[#26C4E1] bg-[#26C4E1] bg-opacity-20'
            : 'border-gray-600 hover:border-[#26C4E1] bg-[#0a1628]'
        }`}
        title="Rectangle"
      >
        <div className={`bg-[#26C4E1] rounded ${size === 'small' ? 'w-4 h-4 sm:w-6 sm:h-6' : 'w-6 h-6 sm:w-8 sm:h-8'}`}></div>
      </button>
      
      <button
        onClick={() => onShapeChange('rounded')}
        className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
          selectedShape === 'rounded'
            ? 'border-[#26C4E1] bg-[#26C4E1] bg-opacity-20'
            : 'border-gray-600 hover:border-[#26C4E1] bg-[#0a1628]'
        }`}
        title="Rounded"
      >
        <div className={`bg-[#26C4E1] rounded-xl ${size === 'small' ? 'w-4 h-4 sm:w-6 sm:h-6' : 'w-6 h-6 sm:w-8 sm:h-8'}`}></div>
      </button>
      
      <button
        onClick={() => onShapeChange('circle')}
        className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
          selectedShape === 'circle'
            ? 'border-[#26C4E1] bg-[#26C4E1] bg-opacity-20'
            : 'border-gray-600 hover:border-[#26C4E1] bg-[#0a1628]'
        }`}
        title="Circle"
      >
        <div className={`bg-[#26C4E1] rounded-full ${size === 'small' ? 'w-4 h-4 sm:w-6 sm:h-6' : 'w-6 h-6 sm:w-8 sm:h-8'}`}></div>
      </button>
      
      <button
        onClick={() => onShapeChange('heart')}
        className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
          selectedShape === 'heart'
            ? 'border-[#26C4E1] bg-[#26C4E1] bg-opacity-20'
            : 'border-gray-600 hover:border-[#26C4E1] bg-[#0a1628]'
        }`}
        title="Heart"
      >
        <Heart size={iconSize} className="text-[#26C4E1]" fill="#26C4E1" />
      </button>
      
      <button
        onClick={() => onShapeChange('star')}
        className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
          selectedShape === 'star'
            ? 'border-[#26C4E1] bg-[#26C4E1] bg-opacity-20'
            : 'border-gray-600 hover:border-[#26C4E1] bg-[#0a1628]'
        }`}
        title="Star"
      >
        <Star size={iconSize} className="text-[#26C4E1]" fill="#26C4E1" />
      </button>
    </div>
  );
}
