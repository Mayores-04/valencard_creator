import { Heart, Star, Sparkles, Music, Coffee, Gift, Crown, Cake, Flower2, Sun, Moon, Cloud } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface IconSticker {
  icon: LucideIcon;
  color: string;
  name: string;
}

export const alphaStickers: string[] = [
  '/stickers/8.png',
  '/stickers/9.png',
  '/stickers/10.png',
  '/stickers/11.png',
  '/stickers/12.png',
  '/stickers/13.png',
  '/stickers/14.png',
  '/stickers/15.png',
  '/stickers/16.png',
  '/stickers/17.png',
  '/stickers/18.png',
  '/stickers/19.png',
  '/stickers/20.png',
  '/stickers/21.png',
  '/stickers/22.png',
  '/stickers/23.png',
  '/stickers/ALPHA ICONS.png',
  '/stickers/ALPHA ICON 2.png',
];

export const loveStickers: string[] = [
  '❤️', '💕', '💖', '💗', '💓', '💝', '🌹', '💐', '🎀', '💌'
];

export const iconStickers: IconSticker[] = [
  { icon: Heart, color: '#ec4899', name: 'Heart' },
  { icon: Star, color: '#fbbf24', name: 'Star' },
  { icon: Sparkles, color: '#a78bfa', name: 'Sparkles' },
  { icon: Music, color: '#60a5fa', name: 'Music' },
  { icon: Coffee, color: '#92400e', name: 'Coffee' },
  { icon: Gift, color: '#f59e0b', name: 'Gift' },
  { icon: Crown, color: '#fbbf24', name: 'Crown' },
  { icon: Cake, color: '#f472b6', name: 'Cake' },
  { icon: Flower2, color: '#fb7185', name: 'Flower' },
  { icon: Sun, color: '#fbbf24', name: 'Sun' },
  { icon: Moon, color: '#818cf8', name: 'Moon' },
  { icon: Cloud, color: '#93c5fd', name: 'Cloud' },
];
