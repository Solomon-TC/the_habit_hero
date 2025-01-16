'use client';

import { Character } from '../types/character';
import styles from './SpriteCharacter.module.css';
import { useEffect, useState } from 'react';

interface Props {
  character: Character;
  width?: number;
  height?: number;
}

export default function SpriteCharacter({ character, width = 128, height = 192 }: Props) {
  const [svgContents, setSvgContents] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadSvgs = async () => {
      const parts = [
        { type: 'body', style: character.body_type },
        { type: 'hair', style: character.hair_style },
        { type: 'shirt', style: character.shirt_style },
        { type: 'pants', style: character.pants_style },
        { type: 'shoes', style: character.shoes_style }
      ];

      const contents: Record<string, string> = {};
      for (const { type, style } of parts) {
        try {
          const svgModule = await import(`../../public/sprites/${type}-${style}.svg`);
          contents[`${type}-${style}`] = svgModule.default;
        } catch (error) {
          console.error(`Error loading SVG: ${type}-${style}`, error);
        }
      }

      setSvgContents(contents);
    };

    loadSvgs();
  }, [character]);

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
        const svgUrl = svgContents[`${type}-${style}`];
        if (!svgUrl) return null;

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
