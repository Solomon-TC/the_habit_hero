'use client';

type Props = {
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
};

export default function FriendCharacterDisplay({ 
  colorPrimary, 
  colorSecondary, 
  colorAccent 
}: Props) {
  return (
    <div 
      className="w-full h-full relative"
      style={{ 
        background: `linear-gradient(135deg, ${colorPrimary}, ${colorSecondary})` 
      }}
    >
      {/* Character Avatar */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center">
          <div 
            className="w-16 h-16 rounded-full"
            style={{ backgroundColor: colorAccent }}
          />
        </div>
      </div>
    </div>
  );
}
