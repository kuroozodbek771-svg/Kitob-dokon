import React, { useState, useEffect } from 'react';
import { useBookStore } from '../context/BookStoreContext';
import { BookCard } from '../components/books/BookCard';
import { BookCover } from '../components/books/BookCover';
import { formatPrice } from '../utils/format';
import { OrderStatus } from '../types';
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  AlertTriangle,
  X,
  Search,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    user,
    logout,
    orders,
    favorites,
    books,
    navigateTo,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    activeProfileTab,
    setActiveProfileTab,
    showToast,
    addToCart,
    setRedirectAfterLogin,
  } = useBookStore();

  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'favorites' | 'addresses' | 'settings'>('info');

  // Sync with context activeProfileTab if navigated from Header
  useEffect(() => {
    if (activeProfileTab) {
      setActiveTab(activeProfileTab);
    }
  }, [activeProfileTab]);

  // Edit Personal Info state
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState(user?.firstName || '');
  const [lastNameInput, setLastNameInput] = useState(user?.lastName || '');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '');
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [cityInput, setCityInput] = useState(user?.city || 'Toshkent');

  // Sync inputs when user changes
  useEffect(() => {
    if (user) {
      setFirstNameInput(user.firstName || '');
      setLastNameInput(user.lastName || '');
      setPhoneInput(user.phone || '');
      setEmailInput(user.email || '');
      setCityInput(user.city || 'Toshkent');
    }
  }, [user]);

  // Orders filter
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  // Address modal state
  const [newAddressModalOpen, setNewAddressModalOpen] = useState(false);
  const [addrTitle, setAddrTitle] = useState('Uy');
  const [addrRecipient, setAddrRecipient] = useState(user?.fullName || '');
  const [addrPhone, setAddrPhone] = useState(user?.phone || '+998 ');
  const [addrCity, setAddrCity] = useState('Toshkent');
  const [addrText, setAddrText] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Logout confirmation modal
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // If user is not logged in
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 mx-auto flex items-center justify-center font-bold mb-4 shadow-xs">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-serif-title text-2xl font-bold text-stone-900 mb-2">
          Profilga kirish
        </h2>
        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
          Profilingizni ko'rish, buyurtmalar tarixini kuzatish va manzillarni boshqarish uchun tizimga kiring.
        </p>
        <button
          onClick={() => {
            setRedirectAfterLogin('profile');
            navigateTo('login');
          }}
          className="px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-amber-900 transition-colors shadow-sm"
        >
          Kirish yoki Ro'yxatdan o'tish
        </button>
      </div>
    );
  }

  const favoriteBooks = books.filter((b) => favorites.includes(b.id));

  // Handle Info Save
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstNameInput.trim() || !lastNameInput.trim()) {
      showToast("Ism va familiyani kiritish majburiy", 'warning');
      return;
    }
    updateProfile({
      firstName: firstNameInput.trim(),
      lastName: lastNameInput.trim(),
      fullName: `${firstNameInput.trim()} ${lastNameInput.trim()}`,
      phone: phoneInput.trim(),
      email: emailInput.trim(),
      city: cityInput.trim(),
    });
    setIsEditingInfo(false);
  };

  // Handle Add Address
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrText.trim()) {
      showToast("Iltimos, manzil matnini to'liq kiriting", 'warning');
      return;
    }
    addAddress({
      title: addrTitle,
      recipientName: addrRecipient || user.fullName,
      phone: addrPhone || user.phone,
      city: addrCity,
      address: addrText.trim(),
      isDefault: addrIsDefault,
    });
    setNewAddressModalOpen(false);
    setAddrText('');
  };

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'active') {
      return ['Yangi', 'Tasdiqlangan', 'Tayyorlanmoqda', 'Yetkazilmoqda', 'Kutilmoqda'].includes(ord.status);
    }
    if (orderFilter === 'completed') {
      return ['Yetkazildi', 'Yetkazib berildi'].includes(ord.status);
    }
    if (orderFilter === 'cancelled') {
      return ord.status === 'Bekor qilindi';
    }
    return true;
  });

  // Render Status Badge
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Yangi':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            Yangi
          </span>
        );
      case 'Tasdiqlangan':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Tasdiqlangan
          </span>
        );
      case 'Tayyorlanmoqda':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-full flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Tayyorlanmoqda
          </span>
        );
      case 'Yetkazilmoqda':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 rounded-full flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            Yetkazilmoqda
          </span>
        );
      case 'Yetkazildi':
      case 'Yetkazib berildi':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Yetkazildi
          </span>
        );
      case 'Bekor qilindi':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 rounded-full flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Bekor qilindi
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-stone-100 text-stone-700 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* User Header Profile Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-2xl border border-amber-200/80 shadow-2xs">
            {(user.firstName || user.fullName || 'F').charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900">
                {user.fullName}
              </h1>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                Faol kitobxon
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                {user.email}
              </span>
              <span className="text-stone-300">·</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                {user.phone}
              </span>
              <span className="text-stone-300">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                A'zo bo'lgan: {user.joinedDate}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setLogoutModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 border border-stone-200 hover:border-red-300 bg-stone-50 hover:bg-red-50 text-stone-600 hover:text-red-700 rounded-xl text-xs font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Chiqish</span>
        </button>
      </div>

      {/* Main Grid: Sidebar + Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white rounded-2xl border border-stone-200/90 p-2.5 shadow-2xs space-y-1">
            {/* 1. Shaxsiy ma'lumotlar */}
            <button
              onClick={() => {
                setActiveTab('info');
                setActiveProfileTab('info');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'info'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100/70'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Shaxsiy ma'lumotlar</span>
            </button>

            {/* 2. Buyurtmalarim */}
            <button
              onClick={() => {
                setActiveTab('orders');
                setActiveProfileTab('orders');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Buyurtmalarim</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-800'
              }`}>
                {orders.length}
              </span>
            </button>

            {/* 3. Sevimli kitoblar */}
            <button
              onClick={() => {
                setActiveTab('favorites');
                setActiveProfileTab('favorites');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'favorites'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4" />
                <span>Sevimli kitoblar</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'favorites' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
              }`}>
                {favorites.length}
              </span>
            </button>

            {/* 4. Manzillarim */}
            <button
              onClick={() => {
                setActiveTab('addresses');
                setActiveProfileTab('addresses');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'addresses'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>Manzillarim</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-800'
              }`}>
                {user.addresses?.length || 0}
              </span>
            </button>

            {/* 5. Sozlamalar */}
            <button
              onClick={() => {
                setActiveTab('settings');
                setActiveProfileTab('settings');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100/70'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Sozlamalar</span>
            </button>

            {/* 6. Chiqish */}
            <div className="pt-2 border-t border-stone-100">
              <button
                onClick={() => setLogoutModalOpen(true)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content Area (8 cols on lg) */}
        <div className="lg:col-span-8">
          {/* TAB 1: SHAXSIY MA'LUMOTLAR */}
          {activeTab === 'info' && (
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
                <div>
                  <h2 className="font-serif-title text-xl font-bold text-stone-900">
                    Shaxsiy ma'lumotlar
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Hisob qaydnomangiz ma'lumotlarini ko'rish va yangilash
                  </p>
                </div>
                {!isEditingInfo ? (
                  <button
                    onClick={() => setIsEditingInfo(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-amber-900 transition-colors shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Ma'lumotlarni tahrirlash</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingInfo(false)}
                    className="px-3.5 py-2 border border-stone-300 text-stone-600 hover:bg-stone-50 rounded-xl text-xs font-medium"
                  >
                    Bekor qilish
                  </button>
                )}
              </div>

              {!isEditingInfo ? (
                /* View Mode */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-50/80 rounded-xl border border-stone-100 space-y-1">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      Ism:
                    </span>
                    <p className="text-sm font-bold text-stone-900">
                      {user.firstName || user.fullName.split(' ')[0]}
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50/80 rounded-xl border border-stone-100 space-y-1">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      Familiya:
                    </span>
                    <p className="text-sm font-bold text-stone-900">
                      {user.lastName || user.fullName.split(' ').slice(1).join(' ') || '—'}
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50/80 rounded-xl border border-stone-100 space-y-1">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      Telefon raqami:
                    </span>
                    <p className="text-sm font-bold text-stone-900 font-mono">
                      {user.phone}
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50/80 rounded-xl border border-stone-100 space-y-1">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      Elektron pochta:
                    </span>
                    <p className="text-sm font-bold text-stone-900">
                      {user.email}
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50/80 rounded-xl border border-stone-100 space-y-1 sm:col-span-2">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      Shahar / Yashash hududi:
                    </span>
                    <p className="text-sm font-bold text-stone-900">
                      {user.city}
                    </p>
                  </div>
                </div>
              ) : (
                /* Edit Mode Form */
                <form onSubmit={handleSaveInfo} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Ism <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={firstNameInput}
                        onChange={(e) => setFirstNameInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Familiya <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={lastNameInput}
                        onChange={(e) => setLastNameInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Telefon raqami <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 font-mono focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Elektron pochta <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Shahar / Hudud
                    </label>
                    <input
                      type="text"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
                    >
                      O'zgarishlarni saqlash
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingInfo(false)}
                      className="px-5 py-2.5 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-medium"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: BUYURTMALARIM */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif-title text-xl font-bold text-stone-900">
                    Buyurtmalarim ({orders.length})
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Barcha amalga oshirilgan xaridlar va ularning yetkazib berish holati
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100 rounded-xl text-xs font-medium">
                  <button
                    onClick={() => setOrderFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      orderFilter === 'all' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Barchasi
                  </button>
                  <button
                    onClick={() => setOrderFilter('active')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      orderFilter === 'active' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Jarayonda
                  </button>
                  <button
                    onClick={() => setOrderFilter('completed')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      orderFilter === 'completed' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Yetkazilgan
                  </button>
                  <button
                    onClick={() => setOrderFilter('cancelled')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      orderFilter === 'cancelled' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Bekor qilingan
                  </button>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-stone-200/90 shadow-xs">
                  <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <h3 className="font-semibold text-stone-900 text-sm mb-1">
                    Bu bo'limda buyurtmalar mavjud emas
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    Katalogimizdan qiziqarli kitoblarni tanlab xarid qilishingiz mumkin.
                  </p>
                  <button
                    onClick={() => navigateTo('catalog')}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Kitoblar katalogiga o'tish
                  </button>
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4"
                  >
                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900 text-sm">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-stone-300">·</span>
                          <span className="text-xs text-stone-500">{ord.date}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Yetkazish: <strong className="text-stone-700">{ord.deliveryMethod || 'Yetkazib berish'}</strong>
                          {' '}· To'lov: <strong className="text-stone-700">{ord.paymentMethod}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {renderStatusBadge(ord.status)}
                      </div>
                    </div>

                    {/* Book items in this order */}
                    <div className="space-y-3">
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-stone-50/70 border border-stone-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-14 bg-stone-200 rounded shrink-0 overflow-hidden shadow-2xs">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-stone-800 text-amber-300 flex items-center justify-center text-[8px] font-bold p-1 text-center">
                                  {item.title.slice(0, 10)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-stone-900 text-xs">
                                {item.title}
                              </p>
                              <p className="text-[11px] text-stone-500">
                                {item.author} · <span className="font-bold text-stone-700">{item.quantity} dona</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-stone-900 text-xs tabular-nums">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <p className="text-[10px] text-stone-400 tabular-nums">
                              ({formatPrice(item.price)} / dona)
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Destination Address & Summary */}
                    <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="text-stone-500 max-w-md">
                        <span className="text-[11px] font-semibold text-stone-400 block">Yetkazib berish manzili:</span>
                        <p className="text-xs text-stone-700 truncate">{ord.deliveryAddress}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[11px] text-stone-400 block">Jami summa:</span>
                          <span className="text-base font-bold text-stone-900 tabular-nums">
                            {formatPrice(ord.total)}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            // Quick re-order: add items back to cart
                            ord.items.forEach((item) => {
                              const b = books.find((x) => x.id === item.bookId);
                              if (b) addToCart(b, item.quantity, true);
                            });
                            showToast(`Buyurtmadagi ${ord.items.length} ta kitob savatga qo'shildi!`, 'success');
                            navigateTo('cart');
                          }}
                          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                          title="Savatga qayta qo'shish"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Qayta buyurtma</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: SEVIMLI KITOBLAR */}
          {activeTab === 'favorites' && (
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <h2 className="font-serif-title text-xl font-bold text-stone-900">
                    Sevimli kitoblar ({favoriteBooks.length})
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Sizga ma'qul kelgan va saqlab qo'yilgan kitoblar to'plami
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('favorites')}
                  className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1"
                >
                  <span>To'liq sahifada ko'rish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {favoriteBooks.length === 0 ? (
                <div className="p-12 text-center">
                  <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="text-xs text-stone-500 mb-4">
                    Hozircha sevimli kitoblar ro'yxatingiz bo'sh.
                  </p>
                  <button
                    onClick={() => navigateTo('catalog')}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
                  >
                    Kitoblar katalogiga o'tish
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MANZILLARIM */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <h2 className="font-serif-title text-xl font-bold text-stone-900">
                    Yetkazib berish manzillari ({user.addresses?.length || 0})
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Buyurtmalarni tezkor rasmiylashtirish uchun saqlangan manzillar
                  </p>
                </div>
                <button
                  onClick={() => {
                    setAddrRecipient(user.fullName);
                    setAddrPhone(user.phone);
                    setNewAddressModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-amber-900 transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yangi manzil</span>
                </button>
              </div>

              {(!user.addresses || user.addresses.length === 0) ? (
                <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200/70">
                  <MapPin className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs text-stone-600 mb-3">Hozircha saqlangan manzil mavjud emas</p>
                  <button
                    onClick={() => setNewAddressModalOpen(true)}
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold"
                  >
                    Birinchi manzilni qo'shish
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded-xl border transition-all ${
                        addr.isDefault
                          ? 'border-amber-400 bg-amber-50/20 shadow-2xs'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-xs">{addr.title}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold">
                              Asosiy
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                          title="Manzilni o'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-stone-700 font-medium leading-relaxed mb-3">
                        {addr.address}
                      </p>

                      <div className="text-[11px] text-stone-500 space-y-0.5 mb-3 pt-2 border-t border-stone-100">
                        <p>Qabul qiluvchi: <strong className="text-stone-800">{addr.recipientName}</strong></p>
                        <p>Tel: <strong className="text-stone-800 font-mono">{addr.phone}</strong></p>
                        <p>Shahar: <strong className="text-stone-800">{addr.city}</strong></p>
                      </div>

                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="w-full py-1.5 border border-stone-200 hover:border-stone-300 text-stone-700 rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          Asosiy manzil qilib belgilash
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SOZLAMALAR */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="pb-4 border-b border-stone-100">
                <h2 className="font-serif-title text-xl font-bold text-stone-900">
                  Hisob sozlamalari
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Xavfsizlik va ilova imtiyozlarini moslashtiring
                </p>
              </div>

              {/* Password change form */}
              <div className="p-5 bg-stone-50/80 rounded-xl border border-stone-200/70 space-y-4">
                <h3 className="font-semibold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-stone-600" />
                  <span>Xavfsizlik va Parolni o'zgartirish</span>
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast("Parol muvaffaqiyatli yangilandi!", 'success');
                  }}
                  className="space-y-3 max-w-md"
                >
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Joriy parol
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Yangi parol (kamida 8 ta belgi)
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Parolni yangilash
                  </button>
                </form>
              </div>

              {/* Preferences */}
              <div className="p-5 bg-stone-50/80 rounded-xl border border-stone-200/70 space-y-3 text-xs">
                <h3 className="font-semibold text-stone-900 uppercase tracking-wider">
                  Xabarnomalar
                </h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-stone-300 text-amber-700 focus:ring-amber-500"
                  />
                  <span className="text-stone-700">Buyurtma holati haqida SMS xabarnomalar olish</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-stone-300 text-amber-700 focus:ring-amber-500"
                  />
                  <span className="text-stone-700">Yangi chegirma va aksiyalar haqida yangiliklar olish</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add New Address */}
      {newAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setNewAddressModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-title text-xl font-bold text-stone-900">
                  Yangi manzil qo'shish
                </h3>
                <p className="text-xs text-stone-500">
                  Yetkazib berish manzilini kiriting
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Manzil nomi
                  </label>
                  <input
                    type="text"
                    required
                    value={addrTitle}
                    onChange={(e) => setAddrTitle(e.target.value)}
                    placeholder="Masalan: Uy, Ishxona"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Shahar
                  </label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    placeholder="Toshkent"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Qabul qiluvchi shaxs
                </label>
                <input
                  type="text"
                  required
                  value={addrRecipient}
                  onChange={(e) => setAddrRecipient(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Telefon raqam
                </label>
                <input
                  type="tel"
                  required
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  To'liq manzil (ko'cha, uy, xonadon) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={addrText}
                  onChange={(e) => setAddrText(e.target.value)}
                  placeholder="Masalan: Yunusobod tumani, 19-mavze, 4-uy, 12-xonadon"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-600"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                <input
                  type="checkbox"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600"
                />
                <span>Ushbu manzilni asosiy qilib belgilash</span>
              </label>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewAddressModalOpen(false)}
                  className="flex-1 py-2.5 border border-stone-300 text-stone-700 rounded-xl text-xs font-medium"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Logout Confirmation */}
      {logoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-title text-lg font-bold text-stone-900">
                Tizimdan chiqmoqchimisiz?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Profilingizdan chiqsangiz ham, xaridlaringiz va sevimli kitoblaringiz saqlanib qoladi.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="flex-1 py-2.5 border border-stone-300 text-stone-700 rounded-xl text-xs font-medium hover:bg-stone-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => {
                  setLogoutModalOpen(false);
                  logout();
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Ha, chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
