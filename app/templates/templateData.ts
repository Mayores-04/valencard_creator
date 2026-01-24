// Template data for Valentine cards
export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  category: 'alpha' | 'love' | 'romantic' | 'cute';
  description: string;
  imageArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
    borderRadius?: number;
  };
}

export const templates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    thumbnail: '/templates/blank.svg',
    category: 'love',
    description: 'Start from scratch with a blank canvas',
  },
  {
    id: 'hearts-bg',
    name: 'Hearts Background',
    thumbnail: '/templates/hearts-bg.svg',
    category: 'love',
    description: 'Beautiful pink and red hearts pattern',
    imageArea: {
      x: 150,
      y: 150,
      width: 300,
      height: 300,
      borderRadius: 150, // Circular
    },
  },
  {
    id: 'romantic-rose',
    name: 'Romantic Rose',
    thumbnail: '/templates/rose.svg',
    category: 'romantic',
    description: 'Elegant rose design for your loved one',
    imageArea: {
      x: 100,
      y: 100,
      width: 400,
      height: 300,
      borderRadius: 20,
    },
  },
  {
    id: 'cute-bear',
    name: 'Cute Teddy Bear',
    thumbnail: '/templates/bear.svg',
    category: 'cute',
    description: 'Adorable teddy bear with hearts',
    imageArea: {
      x: 200,
      y: 200,
      width: 200,
      height: 200,
      borderRadius: 100, // Circular
    },
  },
  {
    id: 'alpha-love',
    name: 'ALPHA Love',
    thumbnail: '/templates/alpha-love.svg',
    category: 'alpha',
    description: 'ALPHA organization special edition',
    imageArea: {
      x: 125,
      y: 125,
      width: 350,
      height: 350,
      borderRadius: 20,
    },
  },
  {
    id: 'alpha-valentine',
    name: 'ALPHA Valentine',
    thumbnail: '/templates/alpha-valentine.svg',
    category: 'alpha',
    description: 'Exclusive ALPHA Valentine design',
    imageArea: {
      x: 100,
      y: 150,
      width: 400,
      height: 400,
      borderRadius: 200, // Circular
    },
  },
];

// Generate SVG templates as data URLs
export function generateTemplateBackground(templateId: string): string {
  const svgContent = getSvgContent(templateId);
  // Use URL encoding instead of base64 to avoid Unicode issues
  return 'data:image/svg+xml,' + encodeURIComponent(svgContent);
}

function getSvgContent(templateId: string): string {
  switch (templateId) {
    case 'blank':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
          <rect width="600" height="800" fill="#ffffff"/>
        </svg>`;
    
    case 'hearts-bg':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#FFE5E5;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#FFB3C1;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="600" height="800" fill="url(#grad1)"/>
          <g opacity="0.3">
            ${Array.from({ length: 20 }, (_, i) => {
              const x = (i % 5) * 120 + 60;
              const y = Math.floor(i / 5) * 200 + 100;
              return `<path d="M ${x},${y + 20} C ${x},${y + 10} ${x + 20},${y} ${x + 25},${y} S ${x + 50},${y + 10} ${x + 50},${y + 20} C ${x + 50},${y + 35} ${x + 25},${y + 50} ${x + 25},${y + 70} C ${x + 25},${y + 50} ${x},${y + 35} ${x},${y + 20} Z" fill="#FF6B9D"/>`;
            }).join('\n')}
          </g>
        </svg>`;
    
    case 'romantic-rose':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
          <rect width="600" height="800" fill="#FFF5F7"/>
          <ellipse cx="300" cy="400" rx="150" ry="150" fill="#FF1744" opacity="0.1"/>
          <path d="M 300 200 Q 250 250 250 300 Q 250 350 300 400 Q 350 350 350 300 Q 350 250 300 200 Z" fill="#E91E63" opacity="0.3"/>
          <circle cx="280" cy="280" r="30" fill="#F06292" opacity="0.4"/>
          <circle cx="320" cy="280" r="25" fill="#F48FB1" opacity="0.4"/>
          <text x="300" y="650" text-anchor="middle" font-size="48" font-family="serif" fill="#C2185B" font-style="italic">Love</text>
        </svg>`;
    
    case 'cute-bear':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
          <rect width="600" height="800" fill="#FFF9C4"/>
          <circle cx="200" cy="200" r="50" fill="#8D6E63"/>
          <circle cx="400" cy="200" r="50" fill="#8D6E63"/>
          <circle cx="300" cy="280" r="100" fill="#A1887F"/>
          <circle cx="270" cy="260" r="15" fill="#3E2723"/>
          <circle cx="330" cy="260" r="15" fill="#3E2723"/>
          <ellipse cx="300" cy="300" rx="25" ry="15" fill="#6D4C41"/>
          <path d="M 260 320 Q 300 340 340 320" stroke="#3E2723" stroke-width="3" fill="none"/>
          <path d="M 280 380 C 280 360 285 350 300 350 C 315 350 320 360 320 380 C 320 400 310 410 300 415 C 290 410 280 400 280 380 Z" fill="#E91E63"/>
          <text x="300" y="700" text-anchor="middle" font-size="36" font-family="cursive" fill="#FF6090">Be Mine! 💕</text>
        </svg>`;
    
    case 'alpha-love':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
          <defs>
            <linearGradient id="alphaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#667EEA;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#764BA2;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="600" height="800" fill="url(#alphaGrad)"/>
          <text x="300" y="150" text-anchor="middle" font-size="72" font-family="Arial Black" fill="#FFFFFF" font-weight="bold">ALPHA</text>
          <path d="M 300 250 C 300 240 320 230 325 230 S 350 240 350 250 C 350 265 325 280 325 300 C 325 280 300 265 300 250 Z" fill="#FFFFFF" opacity="0.9"/>
          <path d="M 250 300 C 250 290 270 280 275 280 S 300 290 300 300 C 300 315 275 330 275 350 C 275 330 250 315 250 300 Z" fill="#FFFFFF" opacity="0.7"/>
          <path d="M 350 300 C 350 290 370 280 375 280 S 400 290 400 300 C 400 315 375 330 375 350 C 375 330 350 315 350 300 Z" fill="#FFFFFF" opacity="0.7"/>
          <text x="300" y="700" text-anchor="middle" font-size="32" font-family="Arial" fill="#FFFFFF">Happy Valentine's Day!</text>
        </svg>`;
    
    case 'alpha-valentine':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
          <rect width="600" height="800" fill="#1A1A2E"/>
          <circle cx="300" cy="400" r="200" fill="#16213E" opacity="0.5"/>
          <text x="300" y="250" text-anchor="middle" font-size="64" font-family="Arial Black" fill="#E94560" font-weight="bold">ALPHA</text>
          <text x="300" y="320" text-anchor="middle" font-size="28" font-family="Arial" fill="#EAEAEA">Organization</text>
          <rect x="200" y="380" width="200" height="4" fill="#E94560" opacity="0.6"/>
          <path d="M 300 450 L 280 470 L 290 480 L 300 470 L 310 480 L 320 470 Z" fill="#E94560"/>
          <text x="300" y="580" text-anchor="middle" font-size="36" font-family="Arial" fill="#EAEAEA" font-style="italic">Together Forever</text>
          <circle cx="150" cy="150" r="5" fill="#E94560" opacity="0.6"/>
          <circle cx="450" cy="200" r="7" fill="#E94560" opacity="0.4"/>
          <circle cx="100" cy="600" r="6" fill="#E94560" opacity="0.5"/>
          <circle cx="500" cy="650" r="8" fill="#E94560" opacity="0.5"/>
        </svg>`;
    
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
          <rect width="600" height="800" fill="#ffffff"/>
        </svg>`;
  }
}

// Generate thumbnail previews
export function generateThumbnail(templateId: string): string {
  const bg = generateTemplateBackground(templateId);
  return bg; // For simplicity, using the same as background
}
