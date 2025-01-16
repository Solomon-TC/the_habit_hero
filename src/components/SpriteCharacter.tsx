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
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        '--sprite-width': `${width}px`,
        '--sprite-height': `${height}px`,
      } as React.CSSProperties}
    >
      {parts.map(({ type, style, color }) => (
        <div 
          key={`${type}-${style}`}
          className="absolute inset-0"
          style={{
            '--sprite-color': color,
            '--sprite-url': `url(/sprites/${type}-${style}.svg)`,
            WebkitMaskImage: 'var(--sprite-url)',
            maskImage: 'var(--sprite-url)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            backgroundColor: 'var(--sprite-color)',
            width: 'var(--sprite-width)',
            height: 'var(--sprite-height)',
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
