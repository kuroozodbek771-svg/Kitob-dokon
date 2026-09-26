/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookStoreProvider, useBookStore } from './context/BookStoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { currentRoute } = useBookStore();

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />;
      case 'catalog':
        return <CatalogPage />;
      case 'book-details':
        return <BookDetailsPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'login':
        return <AuthPage initialMode="login" />;
      case 'register':
        return <AuthPage initialMode="register" />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  const isAdmin = currentRoute === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Show store header if not in admin mode */}
      {!isAdmin && <Header />}

      {/* Main page content container */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Show store footer if not in admin mode */}
      {!isAdmin && <Footer />}

      {/* Global Interactive Notification Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <BookStoreProvider>
      <AppContent />
    </BookStoreProvider>
  );
}
