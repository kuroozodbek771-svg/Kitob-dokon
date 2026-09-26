import React from 'react';
import { useBookStore } from '../context/BookStoreContext';
import { BookCard } from '../components/books/BookCard';
import { Heart, ArrowLeft, ShoppingBag, Trash2, BookOpen } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { favorites, books, navigateTo, addToCart, showToast } = useBookStore();

  const favoriteBooks = books.filter((book) => favorites.includes(book.id));

  const handleAddAllToCart = () => {
    if (favoriteBooks.length === 0) return;
    favoriteBooks.forEach((book) => {
      addToCart(book, 1, true);
    });
    showToast(`Barcha ${favoriteBooks.length} ta sevimli kitob savatga qo'shildi!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigateTo('catalog')}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Katalogga qaytish</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900">
              Sevimli kitoblar
            </h1>
            {favoriteBooks.length > 0 && (
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold tabular-nums">
                {favoriteBooks.length} ta
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Sizga ma'qul kelgan va saqlab qo'yilgan kitoblar to'plami
          </p>
        </div>

        {/* Action button if items exist */}
        {favoriteBooks.length > 0 && (
          <button
            onClick={handleAddAllToCart}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Barchasini savatga qo'shish</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      {favoriteBooks.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16 sm:py-24 bg-white rounded-2xl border border-stone-200/80 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 stroke-1 text-stone-400" />
          </div>
          <h2 className="font-serif-title text-xl font-bold text-stone-900 mb-2">
            Hozircha sevimli kitoblar yo'q
          </h2>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            Katalogdan o'zingizga yoqqan kitoblardagi yurak belgisini bosib, ularni bu yerda saqlab borishingiz mumkin.
          </p>
          <button
            onClick={() => navigateTo('catalog')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-amber-900 transition-colors shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>Kitoblar katalogiga o'tish</span>
          </button>
        </div>
      ) : (
        <div>
          {/* Mobile "Add all to cart" button */}
          <div className="sm:hidden mb-6">
            <button
              onClick={handleAddAllToCart}
              className="w-full flex items-center justify-center gap-2 py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Barchasini savatga qo'shish</span>
            </button>
          </div>

          {/* Grid of favorite books */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {favoriteBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <div className="mt-12 p-4 bg-stone-50 rounded-xl border border-stone-200/60 text-center">
            <p className="text-xs text-stone-500">
              💡 Sevimli kitoblaringiz qurilmangiz xotirasida (localStorage) avtomatik saqlanib turadi.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
