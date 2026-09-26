import React, { useState } from 'react';
import { useBookStore } from '../context/BookStoreContext';
import { CATEGORIES } from '../data/categories';
import { CategoryCard } from '../components/books/CategoryCard';
import { BookCard } from '../components/books/BookCard';
import { Search, ArrowRight, BookOpen, Sparkles, TrendingUp, Compass, Award } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { books, navigateTo, setSearchQuery } = useBookStore();
  const [heroSearch, setHeroSearch] = useState('');

  const featuredBooks = books.filter((b) => b.isFeatured).slice(0, 4);
  const popularBooks = books.filter((b) => b.isPopular).slice(0, 4);
  const newArrivals = books.filter((b) => b.isNewArrival).slice(0, 4);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setSearchQuery(heroSearch);
      navigateTo('catalog');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-stone-900 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_bookstore_banner_1790426359113.jpg"
            alt="BookStore Sanctuary"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 brightness-75 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>O'zbekistondagi eng boy adabiyotlar olami</span>
            </div>

            <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Mutolaa zavqi va yangi bilimlar maskani
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-xl">
              Klassik durdonalardan tortib zamonaviy xalqaro bestsellerlargacha. Sevimli kitobingizni oson toping va uyingizgacha tezkor yetkazib berishdan bahramand bo'ling.
            </p>

            {/* Hero Quick Search Box */}
            <form
              onSubmit={handleHeroSearch}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl"
            >
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Muallif, asar nomi yoki mavzu..."
                  className="w-full pl-11 pr-4 py-3.5 bg-white text-stone-900 rounded-xl text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-lg"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shrink-0"
              >
                <span>Izlash</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick stats / metrics */}
            <div className="pt-4 flex items-center gap-6 sm:gap-10 text-stone-300 text-xs font-medium">
              <div>
                <span className="text-white font-bold text-lg tabular-nums block">10 000+</span>
                <span className="text-stone-400">Kitoblar soni</span>
              </div>
              <div className="w-[1px] h-8 bg-stone-700" />
              <div>
                <span className="text-white font-bold text-lg tabular-nums block">24 soat</span>
                <span className="text-stone-400">Tezkor yetkazish</span>
              </div>
              <div className="w-[1px] h-8 bg-stone-700" />
              <div>
                <span className="text-white font-bold text-lg tabular-nums block">100%</span>
                <span className="text-stone-400">Asl nashrlar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Yo'nalishlar</span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900">
              Kitob kategoriyalari
            </h2>
          </div>
          <button
            onClick={() => navigateTo('catalog')}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-amber-900 transition-colors group"
          >
            <span>Barcha yo'nalishlar</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* 3. FEATURED BOOKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Ekspertlar tavsiyasi</span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900">
              Tavsiya etilgan kitoblar
            </h2>
          </div>
          <button
            onClick={() => navigateTo('catalog')}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-amber-900 transition-colors group"
          >
            <span>Katalogga o'tish</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} featured />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-stone-950 text-white p-8 sm:p-12 lg:p-16 border border-stone-800">
          <div className="absolute inset-0 z-0 opacity-30">
            <img
              src="/src/assets/images/promo_reading_desk_1790426374690.jpg"
              alt="Kitobxonlar klubi"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Maxsus taklif
            </span>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white leading-tight">
              Shaxsiy kutubxonangizni bugun to'ldiring
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              Biznes, psixologiya va badiiy adabiyotlarga qiziqasizmi? BookStore do'konida 150 000 so'mdan ortiq buyurtma bering va bepul yetkazib berish xizmatiga ega bo'ling.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => navigateTo('catalog')}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                Kitoblarni ko'rish
              </button>
              <button
                onClick={() => navigateTo('register')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/20"
              >
                A'zo bo'lish
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. POPULAR BOOKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>O'quvchilar tanlovi</span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900">
              Ommabop kitoblar
            </h2>
          </div>
          <button
            onClick={() => navigateTo('catalog')}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-amber-900 transition-colors group"
          >
            <span>Barchasini ko'rish</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {popularBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* 6. NEW ARRIVALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Yangi nashrlar</span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900">
              Yangi kelgan kitoblar
            </h2>
          </div>
          <button
            onClick={() => navigateTo('catalog')}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-amber-900 transition-colors group"
          >
            <span>Katalogga o'tish</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {newArrivals.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
};
