export interface Sticker {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  shape?: 'rectangle' | 'circle' | 'heart' | 'star' | 'rounded';
  outlineColor?: string;
  outlineWidth?: number;
  borderRadius?: number;
}

export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  rotation: number;
  outlineColor?: string;
  outlineWidth?: number;
  borderRadius?: number;
}

export interface UserImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  shape: 'rectangle' | 'circle' | 'heart' | 'star' | 'rounded';
  offset: { x: number; y: number };
  outlineColor?: string;
  outlineWidth?: number;
  borderRadius?: number;
}

export type ShapeType = 'rectangle' | 'circle' | 'heart' | 'star' | 'rounded';
