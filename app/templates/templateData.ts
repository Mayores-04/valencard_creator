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
    thumbnail: '/templates/random/blank.png',
    category: 'love',
    description: 'Start from scratch with a blank canvas',
  },
  {
    id: 'hearts-bg',
    name: 'Hearts Background',
    thumbnail: '/templates/random/hearts-bg.png',
    category: 'love',
    description: 'Beautiful pink and red hearts pattern',
    imageArea: {
      x: 150,
      y: 150,
      width: 300,
      height: 300,
      borderRadius: 150,
    },
  },
  {
    id: 'romantic-rose',
    name: 'Romantic Rose',
    thumbnail: '/templates/random/rose.png',
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
    thumbnail: '/templates/random/bear.png',
    category: 'cute',
    description: 'Adorable teddy bear with hearts',
    imageArea: {
      x: 200,
      y: 200,
      width: 200,
      height: 200,
      borderRadius: 100,
    },
  },
  {
    id: 'alpha-love',
    name: 'ALPHA Love',
    thumbnail: '/templates/alpha/valencard_template1.png',
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
    thumbnail: '/templates/alpha/valencard_template2.png',
    category: 'alpha',
    description: 'Exclusive ALPHA Valentine design',
    imageArea: {
      x: 100,
      y: 150,
      width: 400,
      height: 400,
      borderRadius: 200,
    },
  },
];

// Get template background image URL
export function generateTemplateBackground(templateId: string): string {
  const template = templates.find(t => t.id === templateId);
  return template?.thumbnail || '/templates/random/blank.png';
}

// Generate thumbnail previews
export function generateThumbnail(templateId: string): string {
  return generateTemplateBackground(templateId);
}
