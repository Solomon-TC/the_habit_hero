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
      className="relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {parts.map(({ type, style, color }) => (
        <div 
          key={`${type}-${style}`}
          className="absolute inset-0"
        >
          <img
            src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='100%25' height='100%25' fill='%23000'/%3E%3C/svg%3E`}
            alt={`${type} ${style}`}
            width={width}
            height={height}
            style={{
              WebkitMaskImage: `url(/sprites/${type}-${style}.svg)`,
              maskImage: `url(/sprites/${type}-${style}.svg)`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              backgroundColor: color,
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      ))}
    </div>
  );
}
