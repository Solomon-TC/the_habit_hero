'use client';

import { Character } from '../types/character';

interface Props {
  character: Character;
  width?: number;
  height?: number;
}

const createSvgMaskUrl = (path: string) => {
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 128 192">
      <rect width="100%" height="100%" fill="white"/>
    </svg>
  `;
  return `url("data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}")`;
};

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
      {parts.map(({ type, style, color }) => {
        const maskUrl = createSvgMaskUrl(`/sprites/${type}-${style}.svg`);
        return (
          <div 
            key={`${type}-${style}`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              backgroundColor: color,
              WebkitMaskImage: maskUrl,
              maskImage: maskUrl,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            }}
          />
        );
      })}
    </div>
  );
}
