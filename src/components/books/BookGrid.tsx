import React from 'react';
import { Book } from '../../types';
import { BookCard } from './BookCard';
import { BookX, RotateCcw } from 'lucide-react';
import { useBookStore } from '../../context/BookStoreContext';

interface BookGridProps {
  books: Book[];
  emptyMessage?: string;
}

export const BookGrid: React.FC<BookGridProps> = ({
  books,
  emptyMessage = "Kitob topilmadi",
}) => {
  const { resetFilter } = useBookStore();

  if (books.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-white rounded-2xl border border-stone-200/90 shadow-xs max-w-md mx-auto my-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto mb-4 border border-amber-200/60">
          <BookX className="w-8 h-8" />
        </div>
        <h3 className="font-serif-title text-xl font-bold text-stone-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-xs text-stone-500 leading-relaxed mb-6">
          Kiritilgan qidiruv yoki tanlangan filtrlarga mos kitob topilmadi. Qidiruv so'zini o'zgartiring yoki filtrlarni tozalang.
        </p>
        <button
          onClick={resetFilter}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Filtrlarni tozalash</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};
