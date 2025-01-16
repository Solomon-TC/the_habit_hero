'use client';

import { Character } from '../types/character';
import Image from 'next/image';

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
          <Image
            src={`/sprites/${type}-${style}.svg`}
            alt={`${type} ${style}`}
            width={width}
            height={height}
            style={{
              filter: `brightness(0) saturate(100%) invert(1) drop-shadow(0 0 0 ${color})`,
              mixBlendMode: 'multiply',
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
