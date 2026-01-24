import Image from 'next/image';
import { useEffect, useState } from 'react';
import * as Separator from '@radix-ui/react-separator';
import { Button } from '../ui/button';

interface BackgroundSelectorProps {
  currentBackground: string;
  onBackgroundChange: (value: string) => void;
  solidColors: Array<{ name: string; value: string }>;
  gradients: Array<{ name: string; value: string }>;
  patterns: Array<{ name: string; value: string; size?: string }>;
  backgroundImages: Array<{ name: string; url: string }>;
}

export function BackgroundSelector({
  currentBackground,
  onBackgroundChange,
  solidColors,
  gradients,
  patterns,
  backgroundImages,
}: BackgroundSelectorProps) {
  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-3 text-gray-300">Solid Colors</h3>
      <div className="grid grid-cols-4 gap-2">
        {solidColors.map((color, index) => (
          <Button
            key={index}
            onClick={() => onBackgroundChange(color.value)}
            className={`btn-color aspect-square ${
              currentBackground === color.value ? 'border-[#26C4E1] ring-2 ring-[#26C4E1] shadow-[0_0_15px_rgba(38,196,225,0.5)]' : 'border-gray-600 hover:border-[#26C4E1]'
            } border-2 rounded-lg transition`}
            style={{ backgroundColor: color.value }}
            title={color.name}
            aria-label={color.name}
          />
        ))}
      </div>

      <Separator.Root className="my-4 h-px bg-gray-700" />

      <h3 className="font-semibold mb-3 text-gray-300">Gradients</h3>
      <div className="grid grid-cols-2 gap-2">
        {gradients.map((gradient, index) => (
          <Button
            key={index}
            onClick={() => onBackgroundChange(gradient.value)}
            className={`btn-color h-16 border-2 rounded-lg transition ${
              currentBackground === gradient.value ? 'border-[#26C4E1] ring-2 ring-[#26C4E1] shadow-[0_0_15px_rgba(38,196,225,0.5)]' : 'border-gray-600 hover:border-[#a855f7]'
            }`}
            style={{ background: gradient.value }}
            title={gradient.name}
            aria-label={gradient.name}
          />
        ))}
      </div>

      <Separator.Root className="my-4 h-px bg-gray-700" />

      <h3 className="font-semibold mb-3 text-gray-300">Patterns</h3>
      <div className="grid grid-cols-2 gap-2">
        {patterns.map((pattern, index) => (
          <Button
            key={index}
            onClick={() => {
              // Apply the pattern CSS directly as the background value.
              onBackgroundChange(pattern.value);
            }}
            className="btn-color h-16 border-2 border-gray-600 hover:border-[#ec4899] bg-white rounded-lg transition"
            style={{ 
              background: pattern.value,
              backgroundSize: pattern.size || 'auto',
              backgroundColor: '#ffffff'
            }}
            title={pattern.name}
            aria-label={pattern.name}
          />
        ))}
      </div>

      <Separator.Root className="my-4 h-px bg-gray-700" />

      <h3 className="font-semibold mb-3 text-gray-300">Background Images</h3>
      <div className="grid grid-cols-2 gap-2">
        {backgroundImages.map((bgImage, index) => (
          <BackgroundImageButton
            key={index}
            url={bgImage.url}
            name={bgImage.name}
            active={currentBackground.includes(bgImage.url)}
            onSelect={() => onBackgroundChange(`url(${bgImage.url})`)}
          />
        ))}
      </div>
    </div>
  );
}

function BackgroundImageButton({ url, name, onSelect, active }: { url: string; name: string; onSelect: () => void; active: boolean }) {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    const img = document.createElement('img');
    img.onload = () => { if (mounted) setAvailable(true); };
    img.onerror = () => { if (mounted) setAvailable(false); };
    img.src = url;
    return () => { mounted = false; };
  }, [url]);

  return (
    <button
      onClick={() => available !== false && onSelect()}
      disabled={available === false}
      className={`btn-color h-24 overflow-hidden relative border-2 rounded-lg transition ${active ? 'border-[#a855f7] ring-2 ring-[#a855f7] shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-gray-600 hover:border-[#a855f7]'} ${available === false ? 'opacity-40 cursor-not-allowed' : ''}`}
      title={name}
      aria-label={name}
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} />
      {available === false && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-gray-200">Unavailable</div>
      )}
    </button>
  );
}
