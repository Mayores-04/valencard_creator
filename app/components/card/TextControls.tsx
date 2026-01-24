import * as Slider from '@radix-ui/react-slider';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { TextElement } from '@/app/components/card';

interface TextControlsProps {
  selectedTextId: string;
  textElement: TextElement | undefined;
  fontFamilies: Array<{ name: string; value: string; category: string }>;
  onFontChange: (id: string, font: string) => void;
  onColorChange: (id: string, color: string) => void;
  onSizeChange: (id: string, size: number) => void;
}

export function TextControls({
  selectedTextId,
  textElement,
  fontFamilies,
  onFontChange,
  onColorChange,
  onSizeChange,
}: TextControlsProps) {
  if (!textElement) return null;

  return (
    <div className="p-3 md:p-4 bg-[#0a1628] rounded-lg border border-gray-700">
      <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-300">Text Settings</h3>
      
      <div className="space-y-3 md:space-y-4">
        <div>
          <label className="text-xs md:text-sm font-medium text-gray-400 block mb-1.5 md:mb-2">Font Style</label>
          <Select
            value={textElement.fontFamily || 'Arial'}
            onValueChange={(value) => onFontChange(selectedTextId, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font, index) => (
                <SelectItem
                  key={index}
                  value={font.value}
                  style={{ fontFamily: font.value }}
                >
                  {font.name} ({font.category})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs md:text-sm font-medium text-gray-400 block mb-1.5 md:mb-2">Color</label>
          <Input
            type="color"
            value={textElement.color || '#000000'}
            onChange={(e) => onColorChange(selectedTextId, e.target.value)}
            className="w-full h-10 md:h-12 cursor-pointer"
            title="Text color"
          />
        </div>
        
        <div>
          <label className="text-xs md:text-sm font-medium text-gray-400 block mb-1.5 md:mb-2">
            Size: {textElement.fontSize}px
          </label>
          <Slider.Root
            value={[textElement.fontSize || 24]}
            onValueChange={(value) => onSizeChange(selectedTextId, value[0])}
            min={12}
            max={72}
            step={1}
            className="relative flex items-center select-none touch-none w-full h-5"
          >
            <Slider.Track className="bg-gray-700 relative grow rounded-full h-1">
              <Slider.Range className="absolute bg-gradient-to-r from-[#26C4E1] to-[#60a5fa] rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-[#0a1628] border-2 border-[#26C4E1] rounded-full hover:bg-[#26C4E1] focus:outline-none focus:ring-2 focus:ring-[#26C4E1] shadow-[0_0_10px_rgba(38,196,225,0.5)] cursor-pointer"
              aria-label="Font size"
            />
          </Slider.Root>
        </div>
      </div>
    </div>
  );
}
