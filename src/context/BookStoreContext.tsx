import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Book,
  CartItem,
  Order,
  PageRoute,
  CatalogFilter,
  CategoryId,
  UserProfile,
  SavedAddress,
  ProfileTab
} from '../types';
import { BOOKS, INITIAL_ORDERS, SAMPLE_USER, DEMO_CREDENTIALS } from '../data/books';

interface ToastState {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface RegisterData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
}

interface BookStoreContextType {
  // Navigation
  currentRoute: PageRoute;
  selectedBookId: string | null;
  activeProfileTab: ProfileTab;
  setActiveProfileTab: (tab: ProfileTab) => void;
  redirectAfterLogin: PageRoute | null;
  setRedirectAfterLogin: (route: PageRoute | null) => void;
  navigateTo: (route: PageRoute, bookId?: string, categoryId?: CategoryId | 'all', profileTab?: ProfileTab) => void;
  
  // Books Data
  books: Book[];
  selectedBook: Book | null;
  
  // Catalog Filters
  filter: CatalogFilter;
  setFilter: React.Dispatch<React.SetStateAction<CatalogFilter>>;
  resetFilter: () => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: CategoryId | 'all') => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;
  addToCart: (book: Book, quantity?: number, silent?: boolean) => void;
  updateQuantity: (bookId: string, delta: number) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  checkout: (details: {
    fullName: string;
    phone: string;
    address: string;
    deliveryMethod: 'Yetkazib berish' | "Do'kondan olib ketish";
    paymentMethod: 'Payme' | 'Click' | 'Naqd pul (qabul qilganda)';
  }) => Promise<Order>;

  // Favorites
  favorites: string[];
  toggleFavorite: (bookId: string) => void;
  isFavorite: (bookId: string) => boolean;

  // User & Authentication
  user: UserProfile | null;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  register: (data: RegisterData) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;

  // Addresses
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  updateAddress: (id: string, updated: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Orders
  orders: Order[];

  // Feedback Toasts
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: number) => void;
}

const defaultFilter: CatalogFilter = {
  searchQuery: '',
  selectedCategory: 'all',
  selectedAuthor: 'all',
  minPrice: 0,
  maxPrice: 200000,
  minRating: 0,
  inStockOnly: false,
  sortBy: 'popular',
};

const BookStoreContext = createContext<BookStoreContextType | undefined>(undefined);

export const BookStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [selectedBookId, setSelectedBookId] = useState<string | null>('b-01');
  const [books] = useState<Book[]>(BOOKS);
  const [filter, setFilter] = useState<CatalogFilter>(defaultFilter);
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTab>('info');
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<PageRoute | null>(null);
  
  // Cart with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bookstore_cart');
      return saved ? JSON.parse(saved) : [
        { book: BOOKS[0], quantity: 1 },
        { book: BOOKS[1], quantity: 1 }
      ];
    } catch {
      return [{ book: BOOKS[0], quantity: 1 }];
    }
  });

  // Favorites with localStorage persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bookstore_favorites');
      return saved ? JSON.parse(saved) : ['b-01', 'b-03', 'b-08'];
    } catch {
      return ['b-01', 'b-03'];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('bookstore_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // User auth state with localStorage persistence
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('bookstore_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          return {
            ...SAMPLE_USER,
            ...parsed,
            addresses: parsed.addresses || SAMPLE_USER.addresses,
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  // Toast notifications
  const [toasts, setToasts] = useState<ToastState[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('bookstore_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('bookstore_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('bookstore_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('bookstore_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('bookstore_user');
      }
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [user]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (
    route: PageRoute,
    bookId?: string,
    categoryId?: CategoryId | 'all',
    profileTab?: ProfileTab
  ) => {
    // Protected pages: If navigating to profile and not logged in
    if (route === 'profile' && !user) {
      setRedirectAfterLogin('profile');
      showToast("Profilni ko'rish uchun avval tizimga kiring", 'warning');
      setCurrentRoute('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (profileTab) {
      setActiveProfileTab(profileTab);
    }

    setCurrentRoute(route);
    if (bookId) {
      setSelectedBookId(bookId);
    }
    if (categoryId !== undefined) {
      setFilter((prev) => ({
        ...prev,
        selectedCategory: categoryId,
      }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilter = () => {
    setFilter(defaultFilter);
  };

  const setSearchQuery = (query: string) => {
    setFilter((prev) => ({ ...prev, searchQuery: query }));
  };

  const setCategoryFilter = (category: CategoryId | 'all') => {
    setFilter((prev) => ({ ...prev, selectedCategory: category }));
  };

  const selectedBook = books.find((b) => b.id === selectedBookId) || books[0];

  // Cart operations
  const addToCart = (book: Book, quantity: number = 1, silent: boolean = false) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { book, quantity }];
    });
    if (!silent) {
      showToast(`"${book.title}" savatga qo'shildi!`, 'success');
    }
  };

  const updateQuantity = (bookId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.book.id === bookId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (bookId: string) => {
    const item = cart.find((i) => i.book.id === bookId);
    setCart((prev) => prev.filter((i) => i.book.id !== bookId));
    if (item) {
      showToast(`"${item.book.title}" savatdan o'chirildi`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.book.price * item.quantity, 0);
  const deliveryFee = cartSubtotal === 0 ? 0 : cartSubtotal >= 150000 ? 0 : 15000;
  const cartTotal = cartSubtotal + deliveryFee;

  const checkout = async (details: {
    fullName: string;
    phone: string;
    address: string;
    deliveryMethod: 'Yetkazib berish' | "Do'kondan olib ketish";
    paymentMethod: 'Payme' | 'Click' | 'Naqd pul (qabul qilganda)';
  }): Promise<Order> => {
    const finalDeliveryFee = details.deliveryMethod === "Do'kondan olib ketish" ? 0 : deliveryFee;
    const finalTotal = cartSubtotal + finalDeliveryFee;

    const newOrder: Order = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      orderNumber: `BS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      items: cart.map((item) => ({
        bookId: item.book.id,
        title: item.book.title,
        author: item.book.author,
        price: item.book.price,
        quantity: item.quantity,
        image: item.book.image,
      })),
      subtotal: cartSubtotal,
      deliveryFee: finalDeliveryFee,
      total: finalTotal,
      status: 'Yangi',
      paymentMethod: details.paymentMethod,
      deliveryMethod: details.deliveryMethod,
      deliveryAddress:
        details.deliveryMethod === "Do'kondan olib ketish"
          ? "Do'kondan olib ketish (Bosh do'kon: A. Navoiy shoh ko'chasi, 32-uy)"
          : `${details.address}, Tel: ${details.phone}`,
    };

    // Simulate short network processing for realistic loading state
    await new Promise((resolve) => setTimeout(resolve, 600));

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Buyurtma muvaffaqiyatli qabul qilindi! Raqam: ${newOrder.orderNumber}`, 'success');
    return newOrder;
  };

  // Favorites
  const toggleFavorite = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    setFavorites((prev) => {
      const exists = prev.includes(bookId);
      if (exists) {
        showToast(`"${book?.title || 'Kitob'}" sevimlilardan olib tashlandi`, 'info');
        return prev.filter((id) => id !== bookId);
      } else {
        showToast(`"${book?.title || 'Kitob'}" sevimlilarga qo'shildi`, 'success');
        return [...prev, bookId];
      }
    });
  };

  const isFavorite = (bookId: string) => favorites.includes(bookId);

  // Authentication logic
  const login = (email: string, password?: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = (password || '').trim();

    // Check demo user
    const isDemo =
      trimmedEmail === DEMO_CREDENTIALS.email.toLowerCase() &&
      (!trimmedPass || trimmedPass === DEMO_CREDENTIALS.password);

    if (isDemo) {
      setUser(SAMPLE_USER);
      showToast(`Xush kelibsiz, ${SAMPLE_USER.fullName}!`, 'success');
      const targetRoute = redirectAfterLogin || 'profile';
      setRedirectAfterLogin(null);
      setCurrentRoute(targetRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return { success: true };
    }

    // Check registered users from localStorage
    try {
      const storedUsersRaw = localStorage.getItem('bookstore_registered_users');
      const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      const found = storedUsers.find(
        (u: any) => u.email.toLowerCase() === trimmedEmail && (!trimmedPass || u.password === trimmedPass)
      );

      if (found) {
        const loggedUser: UserProfile = {
          id: found.id,
          firstName: found.firstName,
          lastName: found.lastName,
          fullName: `${found.firstName} ${found.lastName}`.trim(),
          email: found.email,
          phone: found.phone,
          addresses: found.addresses || [
            {
              id: 'addr-def',
              title: 'Asosiy manzil',
              recipientName: `${found.firstName} ${found.lastName}`.trim(),
              phone: found.phone,
              city: 'Toshkent',
              address: "Toshkent shahri",
              isDefault: true,
            }
          ],
          city: 'Toshkent',
          joinedDate: found.joinedDate || 'Mart 2026',
        };

        setUser(loggedUser);
        showToast(`Xush kelibsiz, ${loggedUser.fullName}!`, 'success');
        const targetRoute = redirectAfterLogin || 'profile';
        setRedirectAfterLogin(null);
        setCurrentRoute(targetRoute);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return { success: true };
      }
    } catch (e) {
      console.error(e);
    }

    // If password matches or is provided, but no user found
    return {
      success: false,
      error: "Elektron pochta yoki parol noto'g'ri kiritildi. Demo uchun: demo@bookstore.uz / BookStore123!",
    };
  };

  const register = (data: RegisterData): { success: boolean; error?: string } => {
    const trimmedEmail = data.email.trim().toLowerCase();

    // Check if email is demo email
    if (trimmedEmail === DEMO_CREDENTIALS.email.toLowerCase()) {
      return {
        success: false,
        error: "Ushbu elektron pochta manzilida allaqachon hisob mavjud. Iltimos, tizimga kiring.",
      };
    }

    // Check if already registered in local storage
    try {
      const storedUsersRaw = localStorage.getItem('bookstore_registered_users');
      const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      const exists = storedUsers.some((u: any) => u.email.toLowerCase() === trimmedEmail);

      if (exists) {
        return {
          success: false,
          error: "Ushbu elektron pochta manzilida allaqachon hisob mavjud.",
        };
      }

      const newUserRecord = {
        id: 'usr-' + Date.now(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: trimmedEmail,
        phone: data.phone.trim(),
        password: data.password || 'BookStore123!',
        joinedDate: 'Mart 2026',
        addresses: [
          {
            id: 'addr-' + Date.now(),
            title: 'Asosiy manzil',
            recipientName: `${data.firstName.trim()} ${data.lastName.trim()}`,
            phone: data.phone.trim(),
            city: 'Toshkent',
            address: "Toshkent shahri",
            isDefault: true,
          }
        ],
      };

      storedUsers.push(newUserRecord);
      localStorage.setItem('bookstore_registered_users', JSON.stringify(storedUsers));

      const loggedUser: UserProfile = {
        id: newUserRecord.id,
        firstName: newUserRecord.firstName,
        lastName: newUserRecord.lastName,
        fullName: `${newUserRecord.firstName} ${newUserRecord.lastName}`,
        email: newUserRecord.email,
        phone: newUserRecord.phone,
        addresses: newUserRecord.addresses,
        city: 'Toshkent',
        joinedDate: newUserRecord.joinedDate,
      };

      setUser(loggedUser);
      showToast(`Ro'yxatdan o'tish muvaffaqiyatli yakunlandi! Xush kelibsiz, ${loggedUser.firstName}!`, 'success');
      const targetRoute = redirectAfterLogin || 'profile';
      setRedirectAfterLogin(null);
      setCurrentRoute(targetRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: "Ro'yxatdan o'tishda xatolik yuz berdi." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookstore_user');
    showToast('Tizimdan chiqdingiz', 'info');
    setCurrentRoute('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const newProfile: UserProfile = {
      ...user,
      ...updated,
      fullName:
        updated.firstName || updated.lastName
          ? `${updated.firstName || user.firstName} ${updated.lastName || user.lastName}`.trim()
          : updated.fullName || user.fullName,
    };
    setUser(newProfile);
    showToast("Profil ma'lumotlari yangilandi", 'success');
  };

  // Address helpers
  const addAddress = (newAddr: Omit<SavedAddress, 'id'>) => {
    if (!user) return;
    const addressItem: SavedAddress = {
      ...newAddr,
      id: 'addr-' + Date.now(),
      isDefault: Boolean(newAddr.isDefault),
    };
    const updatedAddresses: SavedAddress[] = newAddr.isDefault
      ? [...user.addresses.map((a) => ({ ...a, isDefault: false })), addressItem]
      : [...user.addresses, addressItem];

    updateProfile({ addresses: updatedAddresses });
    showToast("Yangi manzil saqlandi", 'success');
  };

  const updateAddress = (id: string, updated: Partial<SavedAddress>) => {
    if (!user) return;
    let list = user.addresses.map((a) => (a.id === id ? { ...a, ...updated } : a));
    if (updated.isDefault) {
      list = list.map((a) => ({ ...a, isDefault: a.id === id }));
    }
    updateProfile({ addresses: list });
    showToast("Manzil ma'lumotlari yangilandi", 'success');
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const list = user.addresses.filter((a) => a.id !== id);
    updateProfile({ addresses: list });
    showToast("Manzil o'chirildi", 'info');
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const list = user.addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    updateProfile({ addresses: list });
    showToast("Asosiy manzil belgilandi", 'success');
  };

  return (
    <BookStoreContext.Provider
      value={{
        currentRoute,
        selectedBookId,
        activeProfileTab,
        setActiveProfileTab,
        redirectAfterLogin,
        setRedirectAfterLogin,
        navigateTo,
        books,
        selectedBook,
        filter,
        setFilter,
        resetFilter,
        setSearchQuery,
        setCategoryFilter,
        cart,
        cartCount,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        checkout,
        favorites,
        toggleFavorite,
        isFavorite,
        user,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </BookStoreContext.Provider>
  );
};

export const useBookStore = () => {
  const context = useContext(BookStoreContext);
  if (!context) {
    throw new Error('useBookStore must be used within a BookStoreProvider');
  }
  return context;
};
