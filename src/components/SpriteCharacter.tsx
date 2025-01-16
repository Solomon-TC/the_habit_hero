'use client';

import { Character } from '../types/character';

interface Props {
  character: Character;
  width?: number;
  height?: number;
}

export default function SpriteCharacter({ character, width = 128, height = 192 }: Props) {
  const parts = [
    { type: 'body', style: character.body_type, color: character.skin_color },
    { type: 'hair', style: character.hair_style, color: character.hair_color },
    { type: 'shirt', style: character.shirt_style, color: character.shirt_color },
    { type: 'pants', style: character.pants_style, color: character.pants_color },
    { type: 'shoes', style: character.shoes_style, color: character.shoes_color }
  ];

  return (
    <div 
      style={{ 
        position: 'relative',
        width: `${width}px`, 
        height: `${height}px` 
      }}
    >
      {parts.map(({ type, style, color }) => (
        <div 
          key={`${type}-${style}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(/sprites/${type}-${style}.svg)`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: `
              brightness(0)
              saturate(100%)
              invert(1)
              sepia(100%)
              saturate(10000%)
              hue-rotate(${getHueRotate(color)}deg)
              brightness(${getBrightness(color)})
              contrast(${getContrast(color)})
            `.replace(/\s+/g, ' ').trim(),
          }}
        />
      ))}
    </div>
  );
}

function getHueRotate(color: string): number {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const hsl = rgbToHsl(r, g, b);
  return Math.round(hsl[0] * 360);
}

function getBrightness(color: string): number {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const hsl = rgbToHsl(r, g, b);
  return hsl[2];
}

function getContrast(color: string): number {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const hsl = rgbToHsl(r, g, b);
  return 1 + hsl[1] * 2;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
}
