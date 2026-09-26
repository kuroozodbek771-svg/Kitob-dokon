import React, { useState, useRef, useEffect } from 'react';
import { useBookStore } from '../../context/BookStoreContext';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  BookOpen,
  LogOut,
  ChevronDown,
  Package,
  MapPin,
  Settings
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigateTo,
    cartCount,
    favorites,
    user,
    logout,
    filter,
    setSearchQuery,
  } = useBookStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filter.searchQuery);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    navigateTo('catalog');
    setSearchOpen(false);
  };

  const navLinks: { label: string; route: import('../../types').PageRoute }[] = [
    { label: 'Bosh sahifa', route: 'home' },
    { label: 'Katalog', route: 'catalog' },
    { label: 'Sevimli kitoblar', route: 'favorites' },
    { label: 'Savat', route: 'cart' },
    { label: 'Profil', route: user ? 'profile' : 'login' },
    { label: 'Admin', route: 'admin' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
      {/* Top micro announcement bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4 text-center">
        <p className="max-w-7xl mx-auto truncate">
          150 000 so'mdan yuqori xaridlarga Toshkent bo'ylab yetkazib berish bepul! 📚
        </p>
      </div>

      {/* Main Navigation (3-Zone Top Bar Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark with subtle book glyph */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 text-stone-900 hover:text-amber-900 transition-colors text-left focus-visible:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-bold shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-serif-title text-2xl font-bold tracking-tight text-stone-900">
              BookStore
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-stone-600">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.label}
                onClick={() => navigateTo(link.route)}
                className={`transition-colors relative py-1 focus-visible:outline-none ${
                  isActive
                    ? 'text-stone-900 font-semibold'
                    : 'hover:text-stone-900 text-stone-600'
                }`}
              >
                {link.label}
                {link.route === 'favorites' && favorites.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold">
                    {favorites.length}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions (Search, Favorites, Cart, Account) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            title="Qidiruv"
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Favorites link */}
          <button
            onClick={() => navigateTo('favorites')}
            title="Sevimli kitoblar"
            className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors hidden sm:flex"
          >
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Cart button */}
          <button
            onClick={() => navigateTo('cart')}
            title="Savatcha"
            className="relative flex items-center gap-2 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-lg text-sm font-medium transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-stone-800" />
            <span className="font-semibold tabular-nums">{cartCount}</span>
          </button>

          {/* User Profile / Login with Dropdown */}
          {user ? (
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-xs font-medium text-stone-800 transition-colors shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-[11px]">
                  {(user.fullName || user.firstName || 'F').charAt(0)}
                </div>
                <span className="truncate max-w-[90px]">{user.firstName || user.fullName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-stone-200/90 shadow-lg py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-2.5 border-b border-stone-100">
                    <p className="font-semibold text-stone-900 truncate">{user.fullName}</p>
                    <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigateTo('profile', undefined, undefined, 'info');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>Shaxsiy ma'lumotlar</span>
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('profile', undefined, undefined, 'orders');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 font-medium"
                    >
                      <Package className="w-3.5 h-3.5 text-stone-400" />
                      <span>Buyurtmalarim</span>
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('favorites');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 font-medium"
                    >
                      <Heart className="w-3.5 h-3.5 text-stone-400" />
                      <span>Sevimli kitoblar</span>
                      {favorites.length > 0 && (
                        <span className="ml-auto text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded-full">
                          {favorites.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('profile', undefined, undefined, 'addresses');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 font-medium"
                    >
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>Manzillarim</span>
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('profile', undefined, undefined, 'settings');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 font-medium"
                    >
                      <Settings className="w-3.5 h-3.5 text-stone-400" />
                      <span>Sozlamalar</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-stone-100">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>Tizimdan chiqish</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigateTo('login')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-amber-900 transition-colors shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Kirish</span>
            </button>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="border-t border-stone-200/80 bg-stone-50 py-3 px-4 animate-in fade-in duration-150">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Kitob nomi, muallif yoki mavzu bo'yicha qidirish..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 shadow-sm"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Qidirish
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2.5 text-stone-500 hover:text-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  navigateTo(link.route);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                  currentRoute === link.route
                    ? 'bg-stone-100 text-stone-900 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>{link.label}</span>
                {link.route === 'favorites' && favorites.length > 0 && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
                    {favorites.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            {user ? (
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                    {(user.fullName || user.firstName || 'F').charAt(0)}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-stone-900">{user.fullName}</p>
                    <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200/50 text-xs">
                  <button
                    onClick={() => {
                      navigateTo('profile');
                      setMobileMenuOpen(false);
                    }}
                    className="py-1.5 px-2 bg-white border border-stone-200 text-stone-800 rounded-lg text-center font-medium hover:bg-stone-100"
                  >
                    Profil
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="py-1.5 px-2 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg text-center font-medium"
                  >
                    Chiqish
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigateTo('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-sm font-semibold text-center hover:bg-stone-800"
              >
                Tizimga kirish
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
