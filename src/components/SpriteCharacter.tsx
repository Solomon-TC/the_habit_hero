'use client';

import { Character } from '../types/character';

interface Props {
  character: Character;
  width?: number;
  height?: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return [0, 0, 0];
  }
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];
}

function getColorFilter(color: string): string {
  const [r, g, b] = hexToRgb(color);
  const brightness = (r + g + b) / (255 * 3);
  const saturation = Math.max(r, g, b) - Math.min(r, g, b);

  return `
    brightness(0)
    saturate(100%)
    invert(1)
    sepia(${saturation / 255})
    saturate(${1 + saturation / 255})
    hue-rotate(${Math.round((r + g + b) / 3)}deg)
    brightness(${0.5 + brightness / 2})
  `.replace(/\s+/g, ' ').trim();
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
            filter: getColorFilter(color),
          }}
        />
      ))}
    </div>
  );
}
