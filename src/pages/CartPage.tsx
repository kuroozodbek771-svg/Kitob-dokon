import React from 'react';
import { useBookStore } from '../context/BookStoreContext';
import { BookCover } from '../components/books/BookCover';
import { formatPrice } from '../utils/format';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    navigateTo,
  } = useBookStore();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-5">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif-title text-2xl font-bold text-stone-900 mb-2">
          Savatingiz hozircha bo'sh
        </h2>
        <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
          Katalogimizdan o'zingizga ma'qul bo'lgan ajoyib asarlarni tanlang va xaridni boshlang.
        </p>
        <button
          onClick={() => navigateTo('catalog')}
          className="px-6 py-3 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-2"
        >
          <span>Kitoblar katalogiga o'tish</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif-title text-3xl font-bold text-stone-900">
            Xarid savatchasi
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Savatda {cart.reduce((s, i) => s + i.quantity, 0)} ta kitob bor
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-red-600 transition-colors"
        >
          Savatni tozalash
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(({ book, quantity }) => (
            <div
              key={book.id}
              className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => navigateTo('book-details', book.id)}
              >
                <div className="w-16 h-22 shrink-0">
                  <BookCover book={book} size="sm" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase text-amber-800 tracking-wider">
                    {book.category}
                  </span>
                  <h3 className="font-semibold text-stone-900 text-sm hover:text-amber-800 transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-stone-500 mb-2">{book.author}</p>
                  <span className="text-sm font-bold text-stone-900 tabular-nums">
                    {formatPrice(book.price)}
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Total */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                  <button
                    onClick={() => updateQuantity(book.id, -1)}
                    className="p-1.5 text-stone-600 hover:text-stone-900"
                    title="Kamaytirish"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-semibold tabular-nums text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(book.id, 1)}
                    className="p-1.5 text-stone-600 hover:text-stone-900"
                    title="Ko'paytirish"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <span className="text-sm font-bold text-stone-900 tabular-nums block">
                    {formatPrice(book.price * quantity)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(book.id)}
                  className="p-2 text-stone-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                  title="O'chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Value note */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 flex items-center gap-3 text-xs text-amber-900">
            <Truck className="w-5 h-5 text-amber-700 shrink-0" />
            <p>
              {cartSubtotal >= 150000 ? (
                <span className="font-semibold text-emerald-800">
                  Tabriklaymiz! Sizga Toshkent bo'ylab yetkazib berish butunlay bepul.
                </span>
              ) : (
                <span>
                  Yana{' '}
                  <strong className="font-semibold">{formatPrice(150000 - cartSubtotal)}</strong>{' '}
                  lik kitob qo'shing va bepul yetkazib berish imkoniyatini qo'lga kiriting!
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-xl border border-stone-200/80 space-y-5 sticky top-24">
            <h3 className="font-semibold text-stone-900 text-base pb-3 border-b border-stone-100">
              Buyurtma xulosasi
            </h3>

            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Kitoblar narxi:</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Yetkazib berish xizmati:</span>
                <span className="font-semibold tabular-nums text-stone-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">Bepul</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Jami to'lov:</span>
                <span className="text-xl font-extrabold text-stone-900 tabular-nums">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-3.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>Buyurtmani rasmiylashtirish</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Xavfsiz va kafolatlangan to'lov</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
