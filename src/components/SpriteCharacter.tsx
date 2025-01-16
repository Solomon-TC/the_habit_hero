'use client';

import { Character } from '../types/character';

interface Props {
  character: Character;
  width?: number;
  height?: number;
}

const createSvgMaskUrl = () => {
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="192">
      <path d="M0 0h128v192H0z" fill="white"/>
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

  const maskUrl = createSvgMaskUrl();

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
            backgroundColor: color,
            WebkitMaskImage: maskUrl,
            maskImage: maskUrl,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            backgroundImage: `url(/sprites/${type}-${style}.svg)`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ))}
    </div>
  );
}
