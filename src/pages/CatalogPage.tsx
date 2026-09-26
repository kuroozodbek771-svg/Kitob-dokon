import React, { useState, useMemo } from 'react';
import { useBookStore } from '../context/BookStoreContext';
import { CATEGORIES } from '../data/categories';
import { BookGrid } from '../components/books/BookGrid';
import { CategoryId } from '../types';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Check,
  ChevronDown,
  X
} from 'lucide-react';
import { formatPrice } from '../utils/format';

export const CatalogPage: React.FC = () => {
  const { books, filter, setFilter, resetFilter } = useBookStore();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(8);

  // Extract unique authors
  const authors = useMemo(() => {
    const list = Array.from(new Set(books.map((b) => b.author)));
    return list.sort();
  }, [books]);

  // Filter & Sort logic
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Search query: Kitob nomi, Muallif, Kategoriya
        if (filter.searchQuery.trim()) {
          const query = filter.searchQuery.toLowerCase().trim();
          const matchTitle = book.title.toLowerCase().includes(query);
          const matchAuthor = book.author.toLowerCase().includes(query);
          const matchCategory = book.category.toLowerCase().includes(query);
          if (!matchTitle && !matchAuthor && !matchCategory) {
            return false;
          }
        }

        // Category filter
        if (filter.selectedCategory !== 'all' && book.category !== filter.selectedCategory) {
          return false;
        }

        // Author filter
        if (filter.selectedAuthor !== 'all' && book.author !== filter.selectedAuthor) {
          return false;
        }

        // Price range (Minimal narx va Maksimal narx)
        if (book.price < filter.minPrice || book.price > filter.maxPrice) {
          return false;
        }

        // Rating filter
        if (filter.minRating > 0 && book.rating < filter.minRating) {
          return false;
        }

        // In stock
        if (filter.inStockOnly && book.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === 'price-asc') return a.price - b.price;
        if (filter.sortBy === 'price-desc') return b.price - a.price;
        if (filter.sortBy === 'rating') return b.rating - a.rating;
        if (filter.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        // default: Tavsiya etilgan ('popular')
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.rating - a.rating;
      });
  }, [books, filter]);

  const visibleBooks = filteredBooks.slice(0, displayLimit);
  const hasMore = displayLimit < filteredBooks.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <span>Bosh sahifa</span>
          <span aria-hidden="true">/</span>
          <span className="text-stone-900 font-medium">Kitoblar katalogi</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-stone-900">
            Kitoblar katalogi
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            Jami: <strong className="text-stone-900">{filteredBooks.length}</strong> ta kitob
          </p>
        </div>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
        {/* Realtime Search on Title, Author, Category */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Kitob nomi, muallif yoki kategoriya bo'yicha qidirish..."
            className="w-full pl-10 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:bg-white transition-all placeholder:text-stone-400"
          />
          {filter.searchQuery && (
            <button
              onClick={() => setFilter((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
              title="Qidiruvni tozalash"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sorting & Mobile Filter trigger */}
        <div className="flex items-center gap-3 justify-between md:justify-end">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtrlar</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 whitespace-nowrap hidden sm:inline">
              Tartiblash:
            </span>
            <select
              value={filter.sortBy}
              onChange={(e) => setFilter((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer"
            >
              <option value="popular">Tavsiya etilgan</option>
              <option value="price-asc">Narx: arzon → qimmat</option>
              <option value="price-desc">Narx: qimmat → arzon</option>
              <option value="rating">Reyting bo'yicha</option>
              <option value="newest">Yangi kitoblar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Book Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 space-y-6 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="font-semibold text-stone-900 text-sm">Filtrlar</span>
              <button
                onClick={resetFilter}
                className="text-[11px] font-semibold text-amber-800 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Tozalash</span>
              </button>
            </div>

            {/* 1. Kategoriya filtri */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2.5">
                Kategoriya
              </label>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                <button
                  onClick={() => setFilter((prev) => ({ ...prev, selectedCategory: 'all' }))}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    filter.selectedCategory === 'all'
                      ? 'bg-amber-50 text-amber-900 font-semibold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>Barchasi</span>
                  <span className="text-[11px] text-stone-400">{books.length}</span>
                </button>
                {CATEGORIES.map((cat) => {
                  const count = books.filter((b) => b.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setFilter((prev) => ({ ...prev, selectedCategory: cat.id }))}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        filter.selectedCategory === cat.id
                          ? 'bg-amber-50 text-amber-900 font-semibold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[11px] text-stone-400">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Muallif filtri */}
            <div className="pt-4 border-t border-stone-100">
              <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2.5">
                Muallif
              </label>
              <select
                value={filter.selectedAuthor}
                onChange={(e) => setFilter((prev) => ({ ...prev, selectedAuthor: e.target.value }))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-600"
              >
                <option value="all">Barcha mualliflar</option>
                {authors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Minimal va Maksimal narx filtri */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider">
                Narx oralig'i (so'm)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-stone-400 block mb-1">Minimal:</span>
                  <input
                    type="number"
                    min={0}
                    max={200000}
                    step={5000}
                    value={filter.minPrice}
                    onChange={(e) =>
                      setFilter((prev) => ({ ...prev, minPrice: Number(e.target.value) || 0 }))
                    }
                    className="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded text-xs font-semibold tabular-nums text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block mb-1">Maksimal:</span>
                  <input
                    type="number"
                    min={0}
                    max={200000}
                    step={5000}
                    value={filter.maxPrice}
                    onChange={(e) =>
                      setFilter((prev) => ({ ...prev, maxPrice: Number(e.target.value) || 200000 }))
                    }
                    className="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded text-xs font-semibold tabular-nums text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>
              <input
                type="range"
                min={30000}
                max={200000}
                step={5000}
                value={filter.maxPrice}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                }
                className="w-full accent-amber-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 tabular-nums">
                <span>0 so'm</span>
                <span>{formatPrice(filter.maxPrice)} gacha</span>
              </div>
            </div>

            {/* 4. Reyting filtri */}
            <div className="pt-4 border-t border-stone-100">
              <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                Reyting
              </label>
              <div className="space-y-1">
                {[
                  { label: 'Barchasi', value: 0 },
                  { label: '4.8 va undan yuqori ★', value: 4.8 },
                  { label: '4.5 va undan yuqori ★', value: 4.5 },
                  { label: '4.0 va undan yuqori ★', value: 4.0 },
                ].map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setFilter((prev) => ({ ...prev, minRating: r.value }))}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      filter.minRating === r.value
                        ? 'bg-amber-50 text-amber-900 font-semibold'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{r.label}</span>
                    {filter.minRating === r.value && <Check className="w-3.5 h-3.5 text-amber-800" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Omborda mavjudlik */}
            <div className="pt-4 border-t border-stone-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filter.inStockOnly}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, inStockOnly: e.target.checked }))
                  }
                  className="rounded border-stone-300 text-amber-700 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-stone-700 font-medium">
                  Faqat mavjud kitoblar
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Book Grid */}
        <div className="lg:col-span-3">
          <BookGrid
            books={visibleBooks}
            emptyMessage="Kitob topilmadi"
          />

          {/* Load More Pagination Button */}
          {hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setDisplayLimit((prev) => prev + 4)}
                className="px-8 py-3 bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 rounded-xl text-xs font-semibold shadow-xs transition-colors active:scale-95"
              >
                Yana ko'rsatish ({filteredBooks.length - displayLimit} ta qoldi)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-semibold text-stone-900 text-base">Filtrlar</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category */}
              <div>
                <span className="text-xs font-semibold text-stone-900 block mb-2">Kategoriya</span>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  <button
                    onClick={() => setFilter((prev) => ({ ...prev, selectedCategory: 'all' }))}
                    className={`w-full text-left px-2 py-1.5 text-xs rounded ${
                      filter.selectedCategory === 'all'
                        ? 'bg-amber-100 text-amber-900 font-semibold'
                        : 'text-stone-600'
                    }`}
                  >
                    Barchasi
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilter((prev) => ({ ...prev, selectedCategory: cat.id }))}
                      className={`w-full text-left px-2 py-1.5 text-xs rounded truncate ${
                        filter.selectedCategory === cat.id
                          ? 'bg-amber-100 text-amber-900 font-semibold'
                          : 'text-stone-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Author */}
              <div className="pt-3 border-t border-stone-100">
                <span className="text-xs font-semibold text-stone-900 block mb-2">Muallif</span>
                <select
                  value={filter.selectedAuthor}
                  onChange={(e) => setFilter((prev) => ({ ...prev, selectedAuthor: e.target.value }))}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded text-xs"
                >
                  <option value="all">Barcha mualliflar</option>
                  {authors.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Price */}
              <div className="pt-3 border-t border-stone-100">
                <div className="flex justify-between text-xs font-semibold text-stone-900 mb-1">
                  <span>Maksimal narx:</span>
                  <span className="tabular-nums">{formatPrice(filter.maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={30000}
                  max={200000}
                  step={5000}
                  value={filter.maxPrice}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                  }
                  className="w-full accent-amber-700"
                />
              </div>

              {/* Mobile Rating */}
              <div className="pt-3 border-t border-stone-100">
                <span className="text-xs font-semibold text-stone-900 block mb-2">Minimal reyting</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[0, 4.0, 4.5, 4.8].map((v) => (
                    <button
                      key={v}
                      onClick={() => setFilter((prev) => ({ ...prev, minRating: v }))}
                      className={`px-2 py-1.5 rounded text-xs text-center border font-medium ${
                        filter.minRating === v
                          ? 'border-amber-700 bg-amber-50 text-amber-900 font-semibold'
                          : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      {v === 0 ? 'Barchasi' : `${v}+ ★`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex gap-2">
              <button
                onClick={() => {
                  resetFilter();
                  setMobileFilterOpen(false);
                }}
                className="w-1/2 py-2.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium"
              >
                Tozalash
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold"
              >
                Ko'rish ({filteredBooks.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
