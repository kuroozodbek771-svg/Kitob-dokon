import React, { useState, useEffect } from 'react';
import { useBookStore } from '../context/BookStoreContext';
import { BookCover } from '../components/books/BookCover';
import { formatPrice } from '../utils/format';
import { DEMO_CREDENTIALS } from '../data/books';
import {
  ChevronLeft,
  Truck,
  Store,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  User,
  LogIn,
  MapPin,
  Sparkles
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    checkout,
    navigateTo,
    user,
    login,
    setRedirectAfterLogin,
  } = useBookStore();

  const getInitialAddress = () => {
    if (!user) return '';
    const def = user.addresses?.find((a) => a.isDefault)?.address || user.addresses?.[0]?.address || user.city || '';
    return def;
  };

  // Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '+998 ');
  const [address, setAddress] = useState(getInitialAddress());
  const [deliveryMethod, setDeliveryMethod] = useState<'Yetkazib berish' | "Do'kondan olib ketish">('Yetkazib berish');
  const [paymentMethod, setPaymentMethod] = useState<'Payme' | 'Click' | 'Naqd pul (qabul qilganda)'>('Payme');
  const [notes, setNotes] = useState('');

  // Auto-fill when user signs in or changes
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.fullName);
      if (!phone || phone === '+998 ') setPhone(user.phone);
      if (!address) {
        const def = user.addresses?.find((a) => a.isDefault)?.address || user.addresses?.[0]?.address || user.city || '';
        if (def) setAddress(def);
      }
    }
  }, [user]);

  // Validation errors
  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    address?: string;
  }>({});

  // Loading & confirmation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);

  // If cart is empty and not just confirmed
  if (cart.length === 0 && !confirmedOrderNumber) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif-title text-2xl font-bold text-stone-900 mb-2">
          Savatingizda kitoblar yo'q
        </h2>
        <p className="text-xs text-stone-500 mb-6">
          Buyurtma berish uchun avval kitoblarni savatga qo'shing.
        </p>
        <button
          onClick={() => navigateTo('catalog')}
          className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-amber-900 transition-colors"
        >
          Katalogga o'tish
        </button>
      </div>
    );
  }

  // Calculate actual delivery cost based on method
  const activeDeliveryFee = deliveryMethod === "Do'kondan olib ketish" ? 0 : deliveryFee;
  const activeTotal = cartSubtotal + activeDeliveryFee;

  // Phone validator: Uzbek numbers must have 9 digits (ignoring spaces, dashes, parentheses)
  const validatePhone = (value: string): boolean => {
    const digitsOnly = value.replace(/\D/g, '');
    // e.g. 998901234567 (12 digits) or 901234567 (9 digits)
    return digitsOnly.length === 9 || (digitsOnly.length === 12 && digitsOnly.startsWith('998'));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhone(val);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    // Validate Full Name
    if (!fullName.trim() || fullName.trim().length < 3) {
      newErrors.fullName = "Iltimos, to'liq ism va familiyangizni kiriting (kamida 3 ta belgi)";
    }

    // Validate Phone
    if (!phone.trim()) {
      newErrors.phone = "Telefon raqamingizni kiritish majburiy";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Telefon raqami noto'g'ri. Format: +998 (90) 123-45-67";
    }

    // Validate Address if Delivery is chosen
    if (deliveryMethod === 'Yetkazib berish' && (!address.trim() || address.trim().length < 5)) {
      newErrors.address = "Yetkazib berish manzilini to'liq kiriting (shahar, tuman, ko'cha, uy raqami)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const order = await checkout({
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: deliveryMethod === "Do'kondan olib ketish" ? "Do'kondan olib ketish" : address.trim(),
        deliveryMethod,
        paymentMethod,
      });

      setConfirmedOrderNumber(order.orderNumber);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is successfully placed, show full confirmation UI
  if (confirmedOrderNumber) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="bg-white rounded-2xl border border-stone-200/90 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-700">
              Muvaffaqiyatli qabul qilindi
            </span>
            <h1 className="font-serif-title text-3xl font-bold text-stone-900 mt-1">
              Xaridingiz uchun tashakkur!
            </h1>
            <p className="text-xs text-stone-500 mt-2">
              Buyurtma raqamingiz: <strong className="text-stone-900 font-mono text-sm">#{confirmedOrderNumber}</strong>
            </p>
          </div>

          <div className="bg-stone-50 rounded-xl p-4 text-xs text-stone-600 text-left space-y-2 border border-stone-200/70">
            <div className="flex justify-between pb-2 border-b border-stone-200/60">
              <span className="text-stone-500">Qabul qiluvchi:</span>
              <span className="font-medium text-stone-900">{fullName}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-stone-200/60">
              <span className="text-stone-500">Yetkazish usuli:</span>
              <span className="font-medium text-stone-900">{deliveryMethod}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-stone-200/60">
              <span className="text-stone-500">To'lov usuli:</span>
              <span className="font-medium text-stone-900">{paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-stone-500">Holat:</span>
              <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Kutilmoqda (Operator bog'lanadi)
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed">
            Tez orada operatorimiz siz bilan bog'lanadi. Buyurtma ma'lumotlari profilingizda saqlandi.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigateTo('profile', undefined, undefined, 'orders')}
              className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
            >
              Buyurtmalarimni ko'rish
            </button>
            <button
              onClick={() => navigateTo('catalog')}
              className="px-6 py-3 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              Katalogga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top back button & title */}
      <div className="mb-8">
        <button
          onClick={() => navigateTo('cart')}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-3 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Savatga qaytish</span>
        </button>
        <h1 className="font-serif-title text-3xl font-bold text-stone-900">
          Buyurtmani rasmiylashtirish
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Iltimos, ma'lumotlaringizni to'g'ri kiriting va buyurtmani tasdiqlang
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Auth Notification Banner */}
            {!user ? (
              <div className="p-4 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">
                      Buyurtma berish uchun tizimga kiring
                    </h4>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Tizimga kirsangiz, ma'lumotlaringiz avtomatik to'ldiriladi va buyurtmangiz profilingizda saqlanadi.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setRedirectAfterLogin('checkout');
                      navigateTo('login');
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs whitespace-nowrap"
                  >
                    Tizimga kirish
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRedirectAfterLogin('checkout');
                      login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
                    }}
                    className="flex-1 sm:flex-initial px-3 py-2 bg-amber-200/80 hover:bg-amber-300 text-amber-950 border border-amber-300/80 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    Demo kirish
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-emerald-950 font-semibold">
                      Tizimga kirgansiz: <strong className="font-bold">{user.fullName}</strong>
                    </span>
                    <span className="text-emerald-800 text-[11px] ml-1.5">({user.email})</span>
                    <p className="text-[11px] text-emerald-700">Ma'lumotlaringiz profilingizdan avtomatik to'ldirildi.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('profile')}
                  className="text-[11px] font-bold text-emerald-900 hover:underline shrink-0"
                >
                  Profilni ochish
                </button>
              </div>
            )}

            {/* 1. Shaxsiy ma'lumotlar */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
              <h3 className="font-semibold text-stone-900 text-base pb-3 border-b border-stone-100">
                1. Qabul qiluvchi ma'lumotlari
              </h3>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  Ism va familiya <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                  placeholder="Masalan: Ozodbek Qodirov"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-stone-900 focus:outline-none transition-colors ${
                    errors.fullName
                      ? 'border-red-400 bg-red-50/30 focus:ring-1 focus:ring-red-400'
                      : 'border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600'
                  }`}
                />
                {errors.fullName && (
                  <p className="flex items-center gap-1 text-[11px] text-red-600 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  Telefon raqami <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+998 (90) 123-45-67"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono text-stone-900 focus:outline-none transition-colors ${
                    errors.phone
                      ? 'border-red-400 bg-red-50/30 focus:ring-1 focus:ring-red-400'
                      : 'border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600'
                  }`}
                />
                {errors.phone ? (
                  <p className="flex items-center gap-1 text-[11px] text-red-600 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                ) : (
                  <span className="text-[11px] text-stone-400 block mt-1">
                    Buyurtmani tasdiqlash uchun operatorimiz ushbu raqamga qo'ng'iroq qiladi
                  </span>
                )}
              </div>
            </div>

            {/* 2. Yetkazib berish usuli */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
              <h3 className="font-semibold text-stone-900 text-base pb-3 border-b border-stone-100">
                2. Yetkazib berish usuli
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Yetkazib berish */}
                <div
                  onClick={() => setDeliveryMethod('Yetkazib berish')}
                  className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-3 ${
                    deliveryMethod === 'Yetkazib berish'
                      ? 'border-amber-700 bg-amber-50/60 ring-1 ring-amber-700'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white shadow-xs text-amber-900 shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 text-xs">Kuryer orqali yetkazish</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                      Toshkent bo'ylab 24 soat ichida eshikkacha yetkaziladi
                    </p>
                    <span className="text-[11px] font-bold text-amber-900 block mt-2">
                      {deliveryFee === 0 ? 'Bepul' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                </div>

                {/* Do'kondan olib ketish */}
                <div
                  onClick={() => setDeliveryMethod("Do'kondan olib ketish")}
                  className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-3 ${
                    deliveryMethod === "Do'kondan olib ketish"
                      ? 'border-amber-700 bg-amber-50/60 ring-1 ring-amber-700'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white shadow-xs text-amber-900 shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 text-xs">Do'kondan olib ketish</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                      Markaziy do'konimizdan o'zingiz istalgan paytda olib keting
                    </p>
                    <span className="text-[11px] font-bold text-emerald-700 block mt-2">
                      Bepul
                    </span>
                  </div>
                </div>
              </div>

              {/* Conditional Address Input */}
              {deliveryMethod === 'Yetkazib berish' ? (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-stone-800">
                      Yetkazib berish manzili <span className="text-red-500">*</span>
                    </label>
                  </div>

                  {/* Saved Addresses quick-picker for logged-in user */}
                  {user && user.addresses && user.addresses.length > 0 && (
                    <div className="mb-2.5 p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
                      <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                        Saqlangan manzillaringizdan tanlang:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {user.addresses.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => {
                              setAddress(a.address);
                              if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors flex items-center gap-1 ${
                              address === a.address
                                ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            <MapPin className="w-3 h-3 text-amber-700" />
                            <span>{a.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                    }}
                    placeholder="Shahar, tuman, ko'cha, uy va xonadon raqami, mo'ljal..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-stone-900 focus:outline-none transition-colors ${
                      errors.address
                        ? 'border-red-400 bg-red-50/30 focus:ring-1 focus:ring-red-400'
                        : 'border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600'
                    }`}
                  />
                  {errors.address && (
                    <p className="flex items-center gap-1 text-[11px] text-red-600 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.address}</span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
                  <span className="font-semibold text-stone-900 block">Do'konimiz manzili:</span>
                  <p>Toshkent sh., Shayxontohur tumani, Alisher Navoiy shoh ko'chasi, 32-uy (Mo'ljal: Milliy teatr ro'parasi)</p>
                  <p className="text-[11px] text-stone-400">Ish vaqti: Har kuni 09:00 dan 21:00 gacha</p>
                </div>
              )}

              {/* Extra notes */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Kuryer yoki buyurtma uchun qo'shimcha izoh (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Masalan: Uy kodi 45, kechki 18:00 dan keyin yetkazilsin"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>
            </div>

            {/* 3. To'lov usuli */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
              <h3 className="font-semibold text-stone-900 text-base pb-3 border-b border-stone-100">
                3. To'lov usuli
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Payme' as const, label: 'Payme', desc: 'Ilova yoki karta orqali' },
                  { id: 'Click' as const, label: 'Click', desc: 'Click ilovasi orqali' },
                  { id: 'Naqd pul (qabul qilganda)' as const, label: 'Naqd pul', desc: 'Kitobni olganda' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setPaymentMethod(item.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      paymentMethod === item.id
                        ? 'border-amber-700 bg-amber-50 text-amber-900 ring-1 ring-amber-700'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="block font-bold text-xs">{item.label}</span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit button on mobile */}
            <div className="lg:hidden">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rasmiylashtirilmoqda...</span>
                  </>
                ) : (
                  <>
                    <span>Buyurtmani tasdiqlash ({formatPrice(activeTotal)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-5 sticky top-24">
            <h3 className="font-semibold text-stone-900 text-base pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Sizning buyurtmangiz</span>
              <span className="text-xs font-normal text-stone-500">
                {cart.reduce((s, i) => s + i.quantity, 0)} ta kitob
              </span>
            </h3>

            {/* List of cart items */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map(({ book, quantity }) => (
                <div key={book.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-10 h-14 shrink-0">
                      <BookCover book={book} size="sm" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-semibold text-stone-900 truncate">{book.title}</h4>
                      <p className="text-[11px] text-stone-400 truncate">{book.author}</p>
                      <span className="text-[11px] text-stone-500">
                        {quantity} × {formatPrice(book.price)}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 tabular-nums shrink-0">
                    {formatPrice(book.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Kitoblar narxi:</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Yetkazib berish xizmati:</span>
                <span className="font-semibold tabular-nums text-stone-900">
                  {activeDeliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">Bepul</span>
                  ) : (
                    formatPrice(activeDeliveryFee)
                  )}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Jami to'lov:</span>
                <span className="text-2xl font-extrabold text-stone-900 tabular-nums">
                  {formatPrice(activeTotal)}
                </span>
              </div>
            </div>

            {/* Desktop Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="hidden lg:flex w-full py-3.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition-all shadow-sm items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rasmiylashtirilmoqda...</span>
                </>
              ) : (
                <>
                  <span>Buyurtmani tasdiqlash</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% xavfsiz va kafolatlangan buyurtma</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
