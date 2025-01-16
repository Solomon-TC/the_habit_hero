'use client';

import { Character } from '../types/character';
import styles from './SpriteCharacter.module.css';

interface Props {
  character: Character;
  width?: number;
  height?: number;
}

const createSvgDataUrl = (path: string) => {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 128 192">
      <use href="${path}#sprite" fill="currentColor"/>
    </svg>`
  ).toString('base64')}`;
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
      className={styles.container}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {parts.map(({ type, style, color }) => {
        const svgUrl = createSvgDataUrl(`/sprites/${type}-${style}.svg`);
        return (
          <div 
            key={`${type}-${style}`}
            className={styles.sprite}
            style={{
              maskImage: `url("${svgUrl}")`,
              WebkitMaskImage: `url("${svgUrl}")`,
              backgroundColor: color,
            }}
          />
        );
      })}
    </div>
  );
}
