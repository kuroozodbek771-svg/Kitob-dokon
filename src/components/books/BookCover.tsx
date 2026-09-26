import React, { useState } from 'react';
import { Book } from '../../types';
import { BookOpen } from 'lucide-react';

interface BookCoverProps {
  book: Book;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const BookCover: React.FC<BookCoverProps> = ({ book, className = '', size = 'md' }) => {
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(book.image) && !imgError;

  // Visual size classes
  const aspectClass = 'aspect-[3/4]';
  const sizeClasses = {
    sm: 'w-16 h-22 text-xs',
    md: 'w-full h-full text-sm',
    lg: 'w-56 md:w-64 h-auto',
    hero: 'w-64 md:w-80 h-auto shadow-2xl',
  }[size];

  // Dynamic fallback cover design based on book's accent color
  const fallbackBg = book.accentColor || '#334155';

  return (
    <div
      className={`relative ${aspectClass} overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-[1.02] shadow-md flex flex-col justify-between ${sizeClasses} ${className}`}
      style={{ backgroundColor: fallbackBg }}
    >
      {hasImage ? (
        <img
          src={book.image}
          alt={book.title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        /* Typographic artisanal book cover fallback */
        <div className="relative w-full h-full p-4 flex flex-col justify-between text-white select-none overflow-hidden">
          {/* Subtle spine shadow simulation */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
          <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-white/20 pointer-events-none" />
          
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

          {/* Top: Category & Publisher */}
          <div className="relative z-10 pl-2">
            <span className="text-[10px] uppercase tracking-widest text-amber-200/90 font-medium">
              {book.category}
            </span>
          </div>

          {/* Middle: Title & Author */}
          <div className="relative z-10 pl-2 my-auto">
            <h4 className="font-serif-title font-bold text-base md:text-lg leading-snug line-clamp-3 text-white drop-shadow-sm">
              {book.title}
            </h4>
            <div className="w-8 h-[2px] bg-amber-400/80 my-2" />
            <p className="text-xs text-stone-200/90 font-medium line-clamp-1">
              {book.author}
            </p>
          </div>

          {/* Bottom: BookStore badge & Icon */}
          <div className="relative z-10 pl-2 flex items-center justify-between text-[10px] text-stone-300 border-t border-white/15 pt-2">
            <span className="tracking-wide">BookStore</span>
            <BookOpen className="w-3.5 h-3.5 text-amber-300/80" />
          </div>
        </div>
      )}

      {/* Glossy lighting overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 pointer-events-none" />
    </div>
  );
};
