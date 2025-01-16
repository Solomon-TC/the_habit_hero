'use client';

import { Character } from '../types/character';
import styles from './SpriteCharacter.module.css';

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
      className={styles.container}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
      }}
    >
      {parts.map(({ type, style, color }) => (
        <div 
          key={`${type}-${style}`}
          className={styles.part}
          style={{
            backgroundColor: color,
            backgroundImage: `url(/sprites/${type}-${style}.svg)`,
            maskImage: `url(/sprites/${type}-${style}.svg)`,
            WebkitMaskImage: `url(/sprites/${type}-${style}.svg)`,
          }}
        />
      ))}
    </div>
  );
}
