import React, { useState } from 'react';
import { useBookStore } from '../context/BookStoreContext';
import { BookCover } from '../components/books/BookCover';
import { BookCard } from '../components/books/BookCard';
import { formatPrice, calculateDiscount } from '../utils/format';
import {
  Heart,
  ShoppingBag,
  Star,
  CheckCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
  Share2,
  BookOpen,
  Calendar,
  Layers,
  Globe,
  Hash
} from 'lucide-react';

export const BookDetailsPage: React.FC = () => {
  const {
    selectedBook,
    books,
    addToCart,
    toggleFavorite,
    isFavorite,
    navigateTo,
    showToast,
  } = useBookStore();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!selectedBook) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-stone-900 mb-2">Kitob topilmadi</h2>
        <button
          onClick={() => navigateTo('catalog')}
          className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm"
        >
          Katalogga qaytish
        </button>
      </div>
    );
  }

  const favorited = isFavorite(selectedBook.id);
  const discount = selectedBook.originalPrice
    ? calculateDiscount(selectedBook.originalPrice, selectedBook.price)
    : 0;

  // Similar books from same category (excluding current)
  const similarBooks = books
    .filter((b) => b.category === selectedBook.category && b.id !== selectedBook.id)
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Kitob havolasi nusxalandi!", "info");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigateTo('catalog')}
          className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Katalogga qaytish</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 p-2 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Ulashish</span>
        </button>
      </div>

      {/* Main Contiguous Purchase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        {/* Left Column: Visual Stage (4 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm bg-stone-100/80 rounded-2xl p-6 sm:p-8 flex items-center justify-center border border-stone-200/80 shadow-xs">
            <BookCover book={selectedBook} size="hero" />
          </div>
          <p className="text-[11px] text-stone-400 mt-3 text-center">
            * Muqova dizayni nashriyot tomonidan yangilangan bo'lishi mumkin
          </p>
        </div>

        {/* Right Column: Title, Metadata, Contiguous Purchase Module (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Category & Status */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-800">
              {selectedBook.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mavjud ({selectedBook.stock} ta omborda)</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-2">
            {selectedBook.title}
          </h1>

          {/* Author & Rating */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pb-5 mb-6 border-b border-stone-200/80">
            <span className="font-medium text-stone-900 text-sm">
              Muallif: <span className="underline decoration-stone-300">{selectedBook.author}</span>
            </span>
            <span className="text-stone-300">·</span>
            <div className="flex items-center gap-1">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(selectedBook.rating) ? 'fill-current' : 'text-stone-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-stone-900 ml-1">
                {selectedBook.rating.toFixed(1)}
              </span>
              <span className="text-stone-400">({selectedBook.reviewCount} sharh)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 mb-6">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 tabular-nums">
                {formatPrice(selectedBook.price)}
              </span>
              {selectedBook.originalPrice && (
                <>
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    {formatPrice(selectedBook.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    -{discount}% chegirma
                  </span>
                </>
              )}
            </div>

            {/* Quantity Stepper + Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center justify-between border border-stone-300 rounded-lg bg-white px-3 py-2 w-32 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-stone-600 hover:text-stone-900 font-bold px-2 py-0.5"
                >
                  -
                </button>
                <span className="font-semibold text-stone-900 tabular-nums text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(selectedBook.stock, q + 1))}
                  className="text-stone-600 hover:text-stone-900 font-bold px-2 py-0.5"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                type="button"
                onClick={() => {
                  addToCart(selectedBook, quantity);
                  setJustAdded(true);
                  setTimeout(() => setJustAdded(false), 1500);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-98 text-white ${
                  justAdded
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-stone-900 hover:bg-amber-900'
                }`}
              >
                {justAdded ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Savatga qo'shildi!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Savatga qo'shish</span>
                  </>
                )}
              </button>

              {/* Favorites button */}
              <button
                type="button"
                onClick={() => toggleFavorite(selectedBook.id)}
                className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-medium text-xs sm:text-sm active:scale-95 ${
                  favorited
                    ? 'border-red-200 bg-red-50 text-red-600'
                    : 'border-stone-300 bg-white text-stone-700 hover:text-red-600 hover:border-red-200'
                }`}
                title={favorited ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current text-red-600' : ''}`} />
                <span className="hidden sm:inline">
                  {favorited ? 'Sevimlilarda' : 'Sevimlilarga'}
                </span>
              </button>
            </div>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-stone-600 mb-6">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-stone-200/60">
              <Truck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>24 soatda yetkazish</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-stone-200/60">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Asl nashr kafolati</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-stone-200/60 col-span-2 sm:col-span-1">
              <RotateCcw className="w-4 h-4 text-amber-700 shrink-0" />
              <span>14 kunlik qaytarish</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 mb-8">
            <h3 className="font-semibold text-stone-900 text-base">
              Kitob haqida
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {selectedBook.description}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="space-y-3">
            <h3 className="font-semibold text-stone-900 text-sm">
              Xususiyatlari
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-xs bg-white p-4 rounded-xl border border-stone-200">
              <div>
                <span className="text-stone-400 block mb-0.5">Nashriyot:</span>
                <span className="font-medium text-stone-800">{selectedBook.publisher}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">Yili:</span>
                <span className="font-medium text-stone-800">{selectedBook.year}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">Sahifalar soni:</span>
                <span className="font-medium text-stone-800 tabular-nums">{selectedBook.pages} bet</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">Muqova:</span>
                <span className="font-medium text-stone-800">{selectedBook.coverType} muqova</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">Tili:</span>
                <span className="font-medium text-stone-800">{selectedBook.language}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">ISBN kodi:</span>
                <span className="font-mono text-stone-800 text-[11px]">{selectedBook.isbn}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Books Section */}
      {similarBooks.length > 0 && (
        <section className="pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif-title text-2xl font-bold text-stone-900">
              O'xshash kitoblar
            </h3>
            <button
              onClick={() => navigateTo('catalog', undefined, selectedBook.category)}
              className="text-xs font-semibold text-amber-800 hover:underline"
            >
              Ushbu bo'limdagi barcha kitoblar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {similarBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
