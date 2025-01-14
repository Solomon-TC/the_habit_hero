'use client';

import { Character } from '../types/character';

interface Props {
  character: Character;
  width?: number;
  height?: number;
}

export default function SpriteCharacter({ character, width = 128, height = 192 }: Props) {
  return (
    <div 
      className="relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="absolute inset-0">
        <img
          src={`/sprites/body-${character.body_type}.svg`}
          alt={`${character.body_type} body`}
          className="absolute inset-0 w-full h-full"
          style={{ filter: `drop-shadow(0 0 0 ${character.skin_color})` }}
        />
        <img
          src={`/sprites/hair-${character.hair_style}.svg`}
          alt={`${character.hair_style} hair`}
          className="absolute inset-0 w-full h-full"
          style={{ filter: `drop-shadow(0 0 0 ${character.hair_color})` }}
        />
        <img
          src={`/sprites/shirt-${character.shirt_style}.svg`}
          alt={`${character.shirt_style} shirt`}
          className="absolute inset-0 w-full h-full"
          style={{ filter: `drop-shadow(0 0 0 ${character.shirt_color})` }}
        />
        <img
          src={`/sprites/pants-${character.pants_style}.svg`}
          alt={`${character.pants_style} pants`}
          className="absolute inset-0 w-full h-full"
          style={{ filter: `drop-shadow(0 0 0 ${character.pants_color})` }}
        />
        <img
          src={`/sprites/shoes-${character.shoes_style}.svg`}
          alt={`${character.shoes_style} shoes`}
          className="absolute inset-0 w-full h-full"
          style={{ filter: `drop-shadow(0 0 0 ${character.shoes_color})` }}
        />
      </div>
    </div>
  );
}
