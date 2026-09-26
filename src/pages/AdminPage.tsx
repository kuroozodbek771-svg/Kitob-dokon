import React, { useState } from 'react';
import { useBookStore } from '../context/BookStoreContext';
import { CATEGORIES } from '../data/categories';
import { formatPrice } from '../utils/format';
import { Modal } from '../components/common/Modal';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  ShoppingBag,
  Users,
  Boxes,
  BarChart3,
  Plus,
  ArrowLeft,
  Search,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  PackageCheck
} from 'lucide-react';

type AdminTab =
  | 'dashboard'
  | 'books'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'inventory'
  | 'reports';

export const AdminPage: React.FC = () => {
  const { books, orders, navigateTo, showToast } = useBookStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [newBookModalOpen, setNewBookModalOpen] = useState(false);
  const [searchAdmin, setSearchAdmin] = useState('');

  // Sample quick stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalBooksCount = books.length;
  const lowStockBooks = books.filter((b) => b.stock <= 15);

  const adminNav = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books' as const, label: 'Kitoblar', icon: BookOpen },
    { id: 'categories' as const, label: 'Kategoriyalar', icon: FolderTree },
    { id: 'orders' as const, label: 'Buyurtmalar', icon: ShoppingBag },
    { id: 'customers' as const, label: 'Mijozlar', icon: Users },
    { id: 'inventory' as const, label: 'Omborxona', icon: Boxes },
    { id: 'reports' as const, label: 'Hisobotlar', icon: BarChart3 },
  ];

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    setNewBookModalOpen(false);
    showToast("Yangi kitob tizimga kiritildi (Demo rejim)", "success");
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Admin Bar */}
      <div className="bg-stone-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-white px-2 py-1 bg-stone-800 rounded-md transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Do'konga qaytish</span>
          </button>
          <div className="h-4 w-[1px] bg-stone-700" />
          <span className="font-serif-title text-base font-bold text-white">
            BookStore Boshqaruv Markazi
          </span>
          <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
            1-bosqich / Prototip
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-stone-300 hidden sm:inline">Admin: Superadmin</span>
          <div className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-xs">
            A
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Admin Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-xl border border-stone-200/80 p-2 space-y-1 shadow-xs">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Notice Box */}
          <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200/60 text-xs text-amber-900 space-y-2">
            <span className="font-bold block">Arxitektura ma'lumoti:</span>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Bu admin paneli keyingi bosqichda PostgreSQL, real inventar boshqaruvi va do'kon kassa (POS) tizimiga ulanish uchun maxsus modullashtirilgan.
            </p>
          </div>
        </div>

        {/* Admin Content Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-medium">Jami tushum</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-xl font-bold text-stone-900 tabular-nums">
                    {formatPrice(totalRevenue)}
                  </span>
                  <span className="text-[11px] text-emerald-600 block mt-1">+14% bu oyda</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-medium">Kitoblar soni</span>
                    <BookOpen className="w-4 h-4 text-stone-600" />
                  </div>
                  <span className="text-xl font-bold text-stone-900 tabular-nums">
                    {totalBooksCount} ta
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-1">8 xil kategoriyada</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-medium">Buyurtmalar</span>
                    <PackageCheck className="w-4 h-4 text-sky-600" />
                  </div>
                  <span className="text-xl font-bold text-stone-900 tabular-nums">
                    {orders.length} ta
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-1">Barchasi faol</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-medium">Kam qolgan kitoblar</span>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-xl font-bold text-stone-900 tabular-nums">
                    {lowStockBooks.length} ta
                  </span>
                  <span className="text-[11px] text-amber-700 block mt-1">Qayta to'ldirish kerak</span>
                </div>
              </div>

              {/* Recent Orders in Dashboard */}
              <div className="bg-white rounded-xl border border-stone-200/80 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-stone-900 text-sm">
                    So'nggi buyurtmalar
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-medium text-amber-800 hover:underline"
                  >
                    Barchasini ko'rish
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-400 uppercase text-[10px]">
                        <th className="pb-2">Raqam</th>
                        <th className="pb-2">Sana</th>
                        <th className="pb-2">Kitoblar soni</th>
                        <th className="pb-2">To'lov usuli</th>
                        <th className="pb-2">Summa</th>
                        <th className="pb-2">Holat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50/60">
                          <td className="py-2.5 font-mono font-medium text-stone-900">
                            {ord.orderNumber}
                          </td>
                          <td className="py-2.5 text-stone-500">{ord.date}</td>
                          <td className="py-2.5 text-stone-700">{ord.items.length} dona</td>
                          <td className="py-2.5 text-stone-600">{ord.paymentMethod}</td>
                          <td className="py-2.5 font-bold text-stone-900 tabular-nums">
                            {formatPrice(ord.total)}
                          </td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[11px] font-medium border border-emerald-200">
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. BOOKS TABLE */}
          {activeTab === 'books' && (
            <div className="bg-white rounded-xl border border-stone-200/80 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm">
                    Kitoblar ro'yxati ({books.length})
                  </h3>
                  <p className="text-xs text-stone-400">Do'kondagi barcha mavjud adabiyotlar</p>
                </div>
                <button
                  onClick={() => setNewBookModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yangi kitob qo'shish</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px]">
                      <th className="pb-2.5">Asar</th>
                      <th className="pb-2.5">Muallif</th>
                      <th className="pb-2.5">Kategoriya</th>
                      <th className="pb-2.5">Narxi</th>
                      <th className="pb-2.5">Zaxira</th>
                      <th className="pb-2.5">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {books.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/60">
                        <td className="py-3 font-semibold text-stone-900">
                          {b.title}
                        </td>
                        <td className="py-3 text-stone-600">{b.author}</td>
                        <td className="py-3 capitalize text-stone-500">{b.category}</td>
                        <td className="py-3 font-bold text-stone-900 tabular-nums">
                          {formatPrice(b.price)}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium tabular-nums ${
                              b.stock <= 10
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {b.stock} dona
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => navigateTo('book-details', b.id)}
                            className="text-amber-800 hover:underline font-medium"
                          >
                            Ko'rish
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-xl border border-stone-200/80 p-5 space-y-4">
              <h3 className="font-semibold text-stone-900 text-sm">
                Kategoriyalar boshqaruvi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORIES.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 border border-stone-200 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-semibold text-stone-900 text-xs">{c.name}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">{c.description}</p>
                    </div>
                    <span className="text-xs font-bold text-stone-400 tabular-nums shrink-0 ml-2">
                      {books.filter((b) => b.category === c.id).length} ta
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl border border-stone-200/80 p-5 space-y-4">
              <h3 className="font-semibold text-stone-900 text-sm">
                Buyurtmalar ro'yxati
              </h3>
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 border border-stone-200 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-stone-900">{ord.orderNumber}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-stone-500">Manzil: {ord.deliveryAddress}</p>
                    <div className="flex justify-between pt-2 border-t border-stone-100 font-bold text-stone-900">
                      <span>Jami summa:</span>
                      <span className="tabular-nums">{formatPrice(ord.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-xl border border-stone-200/80 p-5 space-y-4">
              <h3 className="font-semibold text-stone-900 text-sm">Mijozlar bazasi</h3>
              <div className="p-4 border border-stone-200 rounded-xl space-y-1 text-xs">
                <span className="font-bold text-stone-900 block text-sm">Ozodbek Qodirov</span>
                <p className="text-stone-600">ozodbek@example.uz · +998 (90) 123-45-67</p>
                <p className="text-stone-400 text-[11px]">Ro'yxatdan o'tgan: Yanvar 2026</p>
              </div>
            </div>
          )}

          {/* 6. INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="bg-white rounded-xl border border-stone-200/80 p-5 space-y-4">
              <h3 className="font-semibold text-stone-900 text-sm">Ombor va qoldiqlar nazorati</h3>
              <div className="space-y-2 text-xs">
                {books.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50">
                    <span className="font-medium text-stone-900">{b.title}</span>
                    <span className="font-bold text-stone-700 tabular-nums">
                      {b.stock} dona mavjud
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. REPORTS */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-xl border border-stone-200/80 p-5 space-y-4">
              <h3 className="font-semibold text-stone-900 text-sm">Savdo hisoboti</h3>
              <p className="text-xs text-stone-500">
                Ushbu bo'lim kelgusida savdo dinamikasi, eng xaridorgir janrlar va moliyaviy oylik ko'rsatkichlarni grafiklar ko'rinishida taqdim etadi.
              </p>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span>Hozirgi umumiy aylanma:</span>
                  <strong className="font-bold text-stone-900 tabular-nums">
                    {formatPrice(totalRevenue)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>O'rtacha chek qiymati:</span>
                  <strong className="font-bold text-stone-900 tabular-nums">
                    {formatPrice(orders.length ? Math.round(totalRevenue / orders.length) : 0)}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Book Modal */}
      <Modal
        isOpen={newBookModalOpen}
        onClose={() => setNewBookModalOpen(false)}
        title="Yangi kitob qo'shish (Admin)"
        maxWidth="md"
      >
        <form onSubmit={handleCreateBook} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-stone-800 mb-1">Kitob nomi</label>
            <input
              type="text"
              required
              placeholder="Masalan: Raqamli qal'a"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-stone-800 mb-1">Muallif</label>
            <input
              type="text"
              required
              placeholder="Dan Brown"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">Narxi (so'm)</label>
              <input
                type="number"
                required
                placeholder="75000"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-800 mb-1">Dona soni (Ombor)</label>
              <input
                type="number"
                required
                placeholder="20"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none"
              />
            </div>
          </div>
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setNewBookModalOpen(false)}
              className="w-1/2 py-2 bg-stone-100 rounded-lg font-semibold"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="w-1/2 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-amber-900"
            >
              Saqlash
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
