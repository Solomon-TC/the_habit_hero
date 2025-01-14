'use client';

import { Character } from '../types/character';
import { useEffect, useState } from 'react';

interface Props {
  character: Character;
  width?: number;
  height?: number;
}

export default function SpriteCharacter({ character, width = 128, height = 192 }: Props) {
  const [svgContents, setSvgContents] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadSvgs = async () => {
      const parts = [
        { type: 'body', style: character.body_type },
        { type: 'hair', style: character.hair_style },
        { type: 'shirt', style: character.shirt_style },
        { type: 'pants', style: character.pants_style },
        { type: 'shoes', style: character.shoes_style }
      ];

      const contents: { [key: string]: string } = {};
      
      for (const part of parts) {
        try {
          const response = await fetch(`/sprites/${part.type}-${part.style}.svg`);
          const text = await response.text();
          contents[`${part.type}-${part.style}`] = text;
        } catch (error) {
          console.error(`Error loading ${part.type}-${part.style}.svg:`, error);
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
      className="relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {parts.map(({ type, style, color }) => {
        const svgContent = svgContents[`${type}-${style}`];
        if (!svgContent) return null;

        const coloredSvg = svgContent
          .replace(/#F5D0C5/g, color)
          .replace(/#FFFFFF/g, color)
          .replace(/#ffffff/g, color);

        return (
          <div 
            key={`${type}-${style}`}
            className="absolute inset-0"
            dangerouslySetInnerHTML={{ 
              __html: coloredSvg
            }}
          />
        );
      })}
    </div>
  );
}
