'use client';

import { useEffect, useRef } from 'react';
import { Character } from '../types/character';

interface Props {
  character: Character;
  width?: number;
  height?: number;
}

export default function SpriteCharacter({ character, width = 128, height = 192 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadAndDrawSVG = async (svgPath: string, color?: string): Promise<void> => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      try {
        const response = await fetch(svgPath);
        const svgText = await response.text();
        
        // If color is provided, replace the default white fill and strokes
        const coloredSvg = color 
          ? svgText
              .replace(/#FFFFFF/g, color)
              .replace(/#F0F0F0/g, adjustColor(color, -10))
              .replace(/#E0E0E0/g, adjustColor(color, -20))
          : svgText;

        const blob = new Blob([coloredSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(url);
            resolve();
          };
          img.onerror = reject;
          img.src = url;
        });
      } catch (error) {
        console.error('Error loading SVG:', error);
      }
    };

    const drawCharacter = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw character parts in order
      await loadAndDrawSVG(`/sprites/body-${character.body_type}.svg`, character.skin_color);
      await loadAndDrawSVG(`/sprites/hair-${character.hair_style}.svg`, character.hair_color);
      await loadAndDrawSVG(`/sprites/shirt-${character.shirt_style}.svg`, character.shirt_color);
      await loadAndDrawSVG(`/sprites/pants-${character.pants_style}.svg`, character.pants_color);
      await loadAndDrawSVG(`/sprites/shoes-${character.shoes_style}.svg`, character.shoes_color);
    };

    drawCharacter();
  }, [character, width, height]);

  // Helper function to adjust colors for shading
  const adjustColor = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
    
    return '#' + [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
  };

  return (
    <canvas 
      ref={canvasRef}
      width={width}
      height={height}
      className="pixelated"
      style={{
        imageRendering: 'pixelated',
        width: `${width}px`,
        height: `${height}px`
      }}
    />
  );
}
