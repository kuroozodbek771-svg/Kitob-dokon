export interface Book {
  id: string;
  title: string;
  author: string;
  category: CategoryId;
  price: number; // in UZS (so'm)
  originalPrice?: number;
  image: string;
  description: string;
  rating: number; // 0.0 - 5.0
  reviewCount: number;
  stock: number;
  pages: number;
  year: number;
  publisher: string;
  isbn: string;
  language: string;
  coverType: 'Qattiq' | 'Yumshoq';
  isFeatured?: boolean;
  isPopular?: boolean;
  isNewArrival?: boolean;
  accentColor?: string; // For elegant cover fallbacks
}

export type CategoryId =
  | 'badiiy'
  | 'ilmiy'
  | 'biznes'
  | 'psixologiya'
  | 'tarix'
  | 'dasturlash'
  | 'bolalar'
  | 'chet-tillari';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
  bookCount: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderItem {
  bookId: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus =
  | 'Yangi'
  | 'Tasdiqlangan'
  | 'Tayyorlanmoqda'
  | 'Yetkazilmoqda'
  | 'Yetkazildi'
  | 'Bekor qilindi'
  | 'Kutilmoqda'
  | 'Yetkazib berildi';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'Payme' | 'Click' | 'Naqd pul (qabul qilganda)';
  deliveryMethod?: 'Yetkazib berish' | "Do'kondan olib ketish";
  deliveryAddress: string;
}

export interface SavedAddress {
  id: string;
  title: string;
  recipientName: string;
  phone: string;
  city: string;
  address: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  addresses: SavedAddress[];
  city: string;
  avatarUrl?: string;
  joinedDate: string;
}

export type ProfileTab = 'info' | 'orders' | 'favorites' | 'addresses' | 'settings';

export type PageRoute =
  | 'home'
  | 'catalog'
  | 'book-details'
  | 'cart'
  | 'checkout'
  | 'favorites'
  | 'login'
  | 'register'
  | 'profile'
  | 'admin';

export interface CatalogFilter {
  searchQuery: string;
  selectedCategory: CategoryId | 'all';
  selectedAuthor: string | 'all';
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
}
