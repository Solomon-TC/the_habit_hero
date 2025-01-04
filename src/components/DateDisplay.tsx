'use client';

export default function DateDisplay() {
  return (
    <div className="text-sm text-gray-500">
      {new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </div>
  );
}
