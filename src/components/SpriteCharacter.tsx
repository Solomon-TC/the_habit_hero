'use client';

import { Character } from '../types/character';
import BodyDefault from '../assets/sprites/body-default.svg';
import BodyAthletic from '../assets/sprites/body-athletic.svg';
import BodyRound from '../assets/sprites/body-round.svg';
import HairDefault from '../assets/sprites/hair-default.svg';
import HairLong from '../assets/sprites/hair-long.svg';
import HairPonytail from '../assets/sprites/hair-ponytail.svg';
import HairSpiky from '../assets/sprites/hair-spiky.svg';
import ShirtDefault from '../assets/sprites/shirt-default.svg';
import ShirtTankTop from '../assets/sprites/shirt-tank-top.svg';
import ShirtLongSleeve from '../assets/sprites/shirt-long-sleeve.svg';
import ShirtHoodie from '../assets/sprites/shirt-hoodie.svg';
import PantsDefault from '../assets/sprites/pants-default.svg';
import PantsShorts from '../assets/sprites/pants-shorts.svg';
import PantsSkirt from '../assets/sprites/pants-skirt.svg';
import PantsBaggy from '../assets/sprites/pants-baggy.svg';
import ShoesDefault from '../assets/sprites/shoes-default.svg';
import ShoesBoots from '../assets/sprites/shoes-boots.svg';
import ShoesSandals from '../assets/sprites/shoes-sandals.svg';

interface Props {
  character: Character;
  width?: number;
  height?: number;
}

type SpriteComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type SpriteMap = {
  body: {
    default: SpriteComponent;
    athletic: SpriteComponent;
    round: SpriteComponent;
  };
  hair: {
    default: SpriteComponent;
    long: SpriteComponent;
    ponytail: SpriteComponent;
    spiky: SpriteComponent;
  };
  shirt: {
    default: SpriteComponent;
    'tank-top': SpriteComponent;
    'long-sleeve': SpriteComponent;
    hoodie: SpriteComponent;
  };
  pants: {
    default: SpriteComponent;
    shorts: SpriteComponent;
    skirt: SpriteComponent;
    baggy: SpriteComponent;
  };
  shoes: {
    default: SpriteComponent;
    boots: SpriteComponent;
    sandals: SpriteComponent;
  };
};

const sprites: SpriteMap = {
  body: {
    default: BodyDefault,
    athletic: BodyAthletic,
    round: BodyRound,
  },
  hair: {
    default: HairDefault,
    long: HairLong,
    ponytail: HairPonytail,
    spiky: HairSpiky,
  },
  shirt: {
    default: ShirtDefault,
    'tank-top': ShirtTankTop,
    'long-sleeve': ShirtLongSleeve,
    hoodie: ShirtHoodie,
  },
  pants: {
    default: PantsDefault,
    shorts: PantsShorts,
    skirt: PantsSkirt,
    baggy: PantsBaggy,
  },
  shoes: {
    default: ShoesDefault,
    boots: ShoesBoots,
    sandals: ShoesSandals,
  },
};

export default function SpriteCharacter({ character, width = 128, height = 192 }: Props) {
  const parts = [
    { type: 'body' as const, style: character.body_type, color: character.skin_color },
    { type: 'hair' as const, style: character.hair_style, color: character.hair_color },
    { type: 'shirt' as const, style: character.shirt_style, color: character.shirt_color },
    { type: 'pants' as const, style: character.pants_style, color: character.pants_color },
    { type: 'shoes' as const, style: character.shoes_style, color: character.shoes_color }
  ];

  return (
    <div 
      className="relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {parts.map(({ type, style, color }) => {
        const SpriteComponent = sprites[type][style as keyof (typeof sprites)[typeof type]];
        if (!SpriteComponent) return null;

        return (
          <div 
            key={`${type}-${style}`}
            className="absolute inset-0"
          >
            <SpriteComponent
              width={width}
              height={height}
              style={{
                filter: `brightness(0) saturate(100%) invert(1) drop-shadow(0 0 0 ${color})`,
                mixBlendMode: 'multiply',
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
