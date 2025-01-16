'use client';

import { Character } from '../types/character';
import styles from './CharacterSprite.module.css';

interface Props {
  character: Character;
  className?: string;
}

export default function CharacterSprite({ character, className = '' }: Props) {
  const parts = [
    { type: 'body', style: character.body_type, color: character.skin_color },
    { type: 'hair', style: character.hair_style, color: character.hair_color },
    { type: 'shirt', style: character.shirt_style, color: character.shirt_color },
    { type: 'pants', style: character.pants_style, color: character.pants_color },
    { type: 'shoes', style: character.shoes_style, color: character.shoes_color }
  ];

  return (
    <div className={`${styles.container} ${className}`}>
      {parts.map(({ type, style, color }) => (
        <div
          key={`${type}-${style}`}
          className={`
            ${styles.part}
            ${styles[type]}
            ${styles[`${type}-${style}`]}
          `}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
