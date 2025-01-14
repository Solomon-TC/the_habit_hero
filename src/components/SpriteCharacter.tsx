'use client';

import { Character } from '../types/character';

interface Props {
  character: Character;
  width?: number;
  height?: number;
}

type SpriteMap = Record<string, Record<string, string>>;

// Import all SVG files statically
const sprites: SpriteMap = {
  body: {
    default: '/sprites/body-default.svg',
    athletic: '/sprites/body-athletic.svg',
    round: '/sprites/body-round.svg'
  },
  hair: {
    default: '/sprites/hair-default.svg',
    long: '/sprites/hair-long.svg',
    ponytail: '/sprites/hair-ponytail.svg',
    spiky: '/sprites/hair-spiky.svg'
  },
  shirt: {
    default: '/sprites/shirt-default.svg',
    'tank-top': '/sprites/shirt-tank-top.svg',
    'long-sleeve': '/sprites/shirt-long-sleeve.svg',
    hoodie: '/sprites/shirt-hoodie.svg'
  },
  pants: {
    default: '/sprites/pants-default.svg',
    shorts: '/sprites/pants-shorts.svg',
    skirt: '/sprites/pants-skirt.svg',
    baggy: '/sprites/pants-baggy.svg'
  },
  shoes: {
    default: '/sprites/shoes-default.svg',
    boots: '/sprites/shoes-boots.svg',
    sandals: '/sprites/shoes-sandals.svg'
  }
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
      className="relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {parts.map(({ type, style, color }) => {
        const spritePath = sprites[type]?.[style];
        if (!spritePath) return null;

        return (
          <div 
            key={`${type}-${style}`}
            className="absolute inset-0"
            style={{
              WebkitMaskImage: `url(${spritePath})`,
              maskImage: `url(${spritePath})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              backgroundColor: color
            }}
          />
        );
      })}
    </div>
  );
}
