// components/SymbolIcon.tsx
import { useState } from 'react';
import Image from 'next/image';
interface SymbolIconProps {
  symbol: string;
  name: string;
  size?: number;
  className?: string;
}

export function SymbolIcon({ symbol, name, size = 18, className }: SymbolIconProps) {
  const [hasError, setHasError] = useState(false);
  
  // Base URL for your Supabase storage
  const baseUrl = 'https://temclhpanngnkczcgzbt.supabase.co/storage/v1/object/public/symbols-icon/';
  
  // If icon fails to load, show a fallback
  if (hasError) {
    return (
      <div 
        className={`relative flex size-8 shrink-0 h-6 w-6 overflow-hidden rounded-full ${className}`}
      >
        <span className="flex size-full items-center justify-center rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
          {name.charAt(0)}
        </span>
      </div>
    );
  }

  console.log(name);
  
  return (
    <Image
    priority
      src={`${baseUrl}/${name.toLowerCase().replace(/ /g, "-")}.svg`}
      alt={name || symbol}
      width={size}
      height={size}
      className={`${className} rounded-full w-6 h-6`}
      onError={() => setHasError(true)}
    />
  );
}