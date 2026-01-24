export interface Color {
  name: string;
  value: string;
}

export interface Gradient {
  name: string;
  value: string;
}

export interface Pattern {
  name: string;
  value: string;
  size?: string;
}

export interface BackgroundImage {
  name: string;
  url: string;
}

export const solidColors: Color[] = [
  { name: 'White', value: '#ffffff' },
  { name: 'Pink', value: '#fce7f3' },
  { name: 'Rose', value: '#ffe4e6' },
  { name: 'Red', value: '#fee2e2' },
  { name: 'Purple', value: '#f3e8ff' },
  { name: 'Blue', value: '#dbeafe' },
  { name: 'Lavender', value: '#e9d5ff' },
  { name: 'Peach', value: '#fed7aa' },
  { name: 'Yellow', value: '#fef3c7' },
  { name: 'Mint', value: '#d1fae5' },
  { name: 'Cream', value: '#fef9e7' },
  { name: 'Gray', value: '#f3f4f6' },
];

export const gradients: Gradient[] = [
  { name: 'Pink Love', value: 'linear-gradient(135deg, #fce7f3 0%, #fda4af 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #fef3c7 0%, #fca5a5 100%)' },
  { name: 'Purple Dream', value: 'linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%)' },
  { name: 'Ocean Blue', value: 'linear-gradient(135deg, #dbeafe 0%, #60a5fa 100%)' },
  { name: 'Rose Gold', value: 'linear-gradient(135deg, #ffe4e6 0%, #f9a8d4 100%)' },
  { name: 'Valentine', value: 'linear-gradient(135deg, #ffe4e6 0%, #fda4af 50%, #fb7185 100%)' },
  { name: 'Peach Glow', value: 'linear-gradient(135deg, #fed7aa 0%, #fb923c 100%)' },
  { name: 'Cotton Candy', value: 'linear-gradient(135deg, #fae8ff 0%, #ddd6fe 100%)' },
];

export const patterns: Pattern[] = [
  { 
    name: 'Hearts', 
    value: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 45 C 30 45 15 35 15 25 C 15 20 17 15 22 15 C 25 15 28 17 30 20 C 32 17 35 15 38 15 C 43 15 45 20 45 25 C 45 35 30 45 30 45 Z\' fill=\'%23fda4af\' opacity=\'0.2\'/%3E%3C/svg%3E")' 
  },
  { 
    name: 'Dots', 
    value: 'radial-gradient(circle, #fda4af 1px, transparent 1px)', 
    size: '20px 20px' 
  },
  { 
    name: 'Stripes', 
    value: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fce7f3 10px, #fce7f3 20px)' 
  },
];

export const backgroundImages: BackgroundImage[] = [
  { name: 'Valentine Sky', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=800&fit=crop' },
  { name: 'Pink Flowers', url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=800&fit=crop' },
  { name: 'Rose Garden', url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&h=800&fit=crop' },
  { name: 'Love Letters', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop' },
  { name: 'Sunset Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=800&fit=crop' },
  { name: 'Cherry Blossoms', url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&h=800&fit=crop' },
  { name: 'Starry Night', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=800&fit=crop' },
  { name: 'Fairy Lights', url: 'https://images.unsplash.com/photo-1482802525670-8e399e12e0cd?w=600&h=800&fit=crop' },
];
