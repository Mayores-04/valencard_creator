export interface FontFamily {
  name: string;
  value: string;
  category: 'Serif' | 'Sans-serif' | 'Script' | 'Handwriting' | 'Display';
}

export interface TextTemplate {
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
}

export const fontFamilies: FontFamily[] = [
  { name: 'Classic', value: 'Georgia, serif', category: 'Serif' },
  { name: 'Modern', value: 'Arial, sans-serif', category: 'Sans-serif' },
  { name: 'Elegant Script', value: "'Dancing Script', cursive", category: 'Script' },
  { name: 'Romantic', value: "'Great Vibes', cursive", category: 'Script' },
  { name: 'Handwritten', value: "'Indie Flower', cursive", category: 'Handwriting' },
  { name: 'Playful', value: "'Pacifico', cursive", category: 'Display' },
  { name: 'Vintage', value: "'Playfair Display', serif", category: 'Serif' },
  { name: 'Luxury', value: "'Cinzel', serif", category: 'Serif' },
  { name: 'Love Letter', value: "'Allura', cursive", category: 'Script' },
  { name: 'Sweet', value: "'Satisfy', cursive", category: 'Handwriting' },
  { name: 'Bold Script', value: "'Lobster', cursive", category: 'Display' },
  { name: 'Fancy', value: "'Tangerine', cursive", category: 'Script' },
  { name: 'Alex Brush', value: "'Alex Brush', cursive", category: 'Script' },
  { name: 'Amatic', value: "'Amatic SC', cursive", category: 'Handwriting' },
  { name: 'Architects', value: "'Architects Daughter', cursive", category: 'Handwriting' },
  { name: 'Caveat', value: "'Caveat', cursive", category: 'Handwriting' },
  { name: 'Comforter', value: "'Comforter', cursive", category: 'Script' },
  { name: 'Cookie', value: "'Cookie', cursive", category: 'Script' },
  { name: 'Courgette', value: "'Courgette', cursive", category: 'Script' },
  { name: 'Damion', value: "'Damion', cursive", category: 'Script' },
  { name: 'Grand Hotel', value: "'Grand Hotel', cursive", category: 'Script' },
  { name: 'Homemade Apple', value: "'Homemade Apple', cursive", category: 'Handwriting' },
  { name: 'Kalam', value: "'Kalam', cursive", category: 'Handwriting' },
  { name: 'Kaushan Script', value: "'Kaushan Script', cursive", category: 'Script' },
  { name: 'Love Ya', value: "'Love Ya Like A Sister', cursive", category: 'Display' },
  { name: 'Marck Script', value: "'Marck Script', cursive", category: 'Script' },
  { name: 'Merienda', value: "'Merienda', cursive", category: 'Handwriting' },
  { name: 'Norican', value: "'Norican', cursive", category: 'Script' },
  { name: 'Parisienne', value: "'Parisienne', cursive", category: 'Script' },
  { name: 'Patrick Hand', value: "'Patrick Hand', cursive", category: 'Handwriting' },
  { name: 'Permanent Marker', value: "'Permanent Marker', cursive", category: 'Handwriting' },
  { name: 'Pinyon Script', value: "'Pinyon Script', cursive", category: 'Script' },
  { name: 'Raleway', value: "'Raleway', sans-serif", category: 'Sans-serif' },
  { name: 'Rochester', value: "'Rochester', cursive", category: 'Script' },
  { name: 'Sacramento', value: "'Sacramento', cursive", category: 'Script' },
  { name: 'Shadows Into Light', value: "'Shadows Into Light', cursive", category: 'Handwriting' },
  { name: 'Yellowtail', value: "'Yellowtail', cursive", category: 'Script' },
  { name: 'Zeyada', value: "'Zeyada', cursive", category: 'Script' },
  { name: 'Oswald', value: "'Oswald', sans-serif", category: 'Sans-serif' },
  { name: 'Ubuntu', value: "'Ubuntu', sans-serif", category: 'Sans-serif' },
  { name: 'Lato', value: "'Lato', sans-serif", category: 'Sans-serif' },
];

export const textTemplates: TextTemplate[] = [
  { text: 'I Love You', fontSize: 48, color: '#ec4899', fontFamily: "'Great Vibes', cursive" },
  { text: 'Be Mine', fontSize: 42, color: '#ef4444', fontFamily: "'Pacifico', cursive" },
  { text: 'Happy Valentine\'s', fontSize: 36, color: '#f43f5e', fontFamily: "'Dancing Script', cursive" },
  { text: 'Forever Yours', fontSize: 40, color: '#db2777', fontFamily: "'Allura', cursive" },
  { text: 'XOXO', fontSize: 52, color: '#e11d48', fontFamily: "'Lobster', cursive" },
  { text: 'You & Me', fontSize: 38, color: '#be185d', fontFamily: "'Satisfy', cursive" },
  { text: 'My Valentine', fontSize: 36, color: '#f472b6', fontFamily: "'Tangerine', cursive" },
  { text: 'Love Always', fontSize: 40, color: '#ec4899', fontFamily: "'Cinzel', serif" },
  { text: 'Together Forever', fontSize: 32, color: '#f43f5e', fontFamily: "'Playfair Display', serif" },
  { text: 'With Love', fontSize: 38, color: '#fb7185', fontFamily: "'Indie Flower', cursive" },
];
