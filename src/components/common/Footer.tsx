import React from 'react';
import { useBookStore } from '../../context/BookStoreContext';
import { BookOpen, MapPin, Phone, Mail, Clock, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const Footer: React.FC = () => {
  const { navigateTo } = useBookStore();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 mb-12 border-b border-stone-800 text-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white">Tezkor yetkazish</h5>
              <p className="text-xs text-stone-400">Toshkent bo'ylab 24 soat ichida</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white">100% asl nusxalar</h5>
              <p className="text-xs text-stone-400">Faqat rasmiy nashriyotlardan</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white">Oson qaytarish</h5>
              <p className="text-xs text-stone-400">14 kun ichida almashtirish</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white">Mijozlarni qo'llab-quvvatlash</h5>
              <p className="text-xs text-stone-400">Har kuni 09:00 dan 21:00 gacha</p>
            </div>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-900 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-serif-title text-2xl font-bold tracking-tight text-white">
                BookStore
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              BookStore — kitobxonlar uchun eng sara badiiy, ilmiy, psixologik va biznes adabiyotlarini jamlagan zamonaviy onlayn kitob do'koni. Maqsadimiz — har bir xonadonga ziyo va ilm ulashish.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-white block mb-2">Qabul qilinadigan to'lovlar:</span>
              <div className="flex items-center gap-2 text-[11px] text-stone-300 font-mono">
                <span className="px-2 py-1 bg-stone-800 rounded border border-stone-700">Payme</span>
                <span className="px-2 py-1 bg-stone-800 rounded border border-stone-700">Click</span>
                <span className="px-2 py-1 bg-stone-800 rounded border border-stone-700">Uzcard</span>
                <span className="px-2 py-1 bg-stone-800 rounded border border-stone-700">Humo</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Kategoriyalar
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateTo('catalog', undefined, cat.id)}
                    className="hover:text-amber-400 transition-colors text-stone-400 text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Xaridorlarga
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => navigateTo('catalog')} className="hover:text-amber-400 transition-colors">
                  Barcha kitoblar
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('favorites')} className="hover:text-amber-400 transition-colors">
                  Sevimli kitoblar
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('cart')} className="hover:text-amber-400 transition-colors">
                  Savatcha
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('profile')} className="hover:text-amber-400 transition-colors">
                  Buyurtmalar tarixi
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin')} className="hover:text-amber-400 transition-colors text-stone-500">
                  Admin panel (Demo)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Bog'lanish
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Toshkent sh., Shayxontohur tumani, Alisher Navoiy shoh ko'chasi, 32-uy</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+998712000011" className="hover:text-white transition-colors">
                  +998 (71) 200-00-11
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>info@bookstore.uz</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 BookStore MCHJ. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Maxfiylik siyosati</span>
            <span>·</span>
            <span>Ommaviy oferta</span>
            <span>·</span>
            <span>Qoidalar</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
