import React, { useState } from 'react';
import { Book } from '../../types';
import { useBookStore } from '../../context/BookStoreContext';
import { BookCover } from './BookCover';
import { formatPrice } from '../../utils/format';
import { Heart, ShoppingBag, Star, Eye, Check } from 'lucide-react';

interface BookCardProps {
  book: Book;
  featured?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { navigateTo, addToCart, toggleFavorite, isFavorite } = useBookStore();
  const favorited = isFavorite(book.id);
  const [justAdded, setJustAdded] = useState(false);

  const handleCardClick = () => {
    navigateTo('book-details', book.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(book.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer bg-white rounded-xl border border-stone-200/90 hover:border-amber-300 p-3.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
    >
      <div>
        {/* Cover Container */}
        <div className="relative mb-3 bg-stone-100/90 rounded-lg overflow-hidden flex items-center justify-center p-2.5">
          <BookCover book={book} size="md" />

          {/* Floating Favorite Button */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20">
            <button
              type="button"
              onClick={handleToggleFavorite}
              title={favorited ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
              className={`p-2 rounded-full transition-all backdrop-blur-md shadow-sm active:scale-90 ${
                favorited
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 ring-1 ring-red-200'
                  : 'bg-white/95 text-stone-600 hover:text-red-500 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current text-red-600' : ''}`} />
            </button>
          </div>

          {/* Stock badge */}
          <div className="absolute bottom-2 left-2 z-20">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-md border ${
                book.stock <= 5
                  ? 'text-amber-900 bg-amber-100/90 border-amber-300'
                  : 'text-stone-700 bg-white/90 border-stone-200/80'
              }`}
            >
              Omborda: {book.stock} ta
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
          <span className="capitalize font-medium text-amber-800 tracking-wide text-[11px]">
            {book.category}
          </span>
          <div className="flex items-center text-stone-700 font-semibold text-xs">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-0.5" />
            <span>{book.rating.toFixed(1)}</span>
            <span className="text-[10px] text-stone-400 font-normal ml-0.5">
              ({book.reviewCount})
            </span>
          </div>
        </div>

        {/* Title & Author */}
        <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-2 group-hover:text-amber-900 transition-colors mb-1">
          {book.title}
        </h3>
        <p className="text-xs text-stone-500 line-clamp-1 mb-2">
          {book.author}
        </p>
      </div>

      {/* Pricing and Action Buttons */}
      <div className="pt-2.5 border-t border-stone-100 mt-auto space-y-2.5">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-stone-900 tabular-nums">
              {formatPrice(book.price)}
            </span>
            {book.originalPrice && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {formatPrice(book.originalPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {/* Batafsil button */}
          <button
            type="button"
            onClick={handleCardClick}
            className="flex items-center justify-center gap-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            <span>Batafsil</span>
          </button>

          {/* Savatga qo'shish button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all active:scale-95 text-white ${
              justAdded
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-stone-900 hover:bg-amber-900'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Qo'shildi</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Savatga</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
