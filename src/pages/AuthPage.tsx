import React, { useState } from 'react';
import { useBookStore } from '../context/BookStoreContext';
import { DEMO_CREDENTIALS } from '../data/books';
import {
  BookOpen,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const { login, register, navigateTo, showToast } = useBookStore();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  // Register form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+998 ');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regErrors, setRegErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Validation helpers
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const isValidUzbekPhone = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 9 || (digitsOnly.length === 12 && digitsOnly.startsWith('998'));
  };

  // Format phone number as typing
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRegPhone(val);
    if (regErrors.phone) {
      setRegErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  // Fast Fill Demo Account
  const handleFillDemo = () => {
    setLoginEmail(DEMO_CREDENTIALS.email);
    setLoginPassword(DEMO_CREDENTIALS.password);
    setLoginErrors({});
  };

  // Quick 1-click Demo Login
  const handleDirectDemoLogin = () => {
    const result = login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    if (!result.success && result.error) {
      setLoginErrors({ general: result.error });
    }
  };

  // Handle Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof loginErrors = {};

    if (!loginEmail.trim()) {
      errors.email = "Iltimos, elektron pochta manzilini kiriting";
    } else if (!isValidEmail(loginEmail)) {
      errors.email = "Elektron pochta formati noto'g'ri (masalan: misol@bookstore.uz)";
    }

    if (!loginPassword) {
      errors.password = "Iltimos, parolingizni kiriting";
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoginErrors({});
    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setLoginErrors({
        general: res.error || "Elektron pochta yoki parol noto'g'ri kiritildi",
      });
    }
  };

  // Handle Register Submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof regErrors = {};

    if (!regFirstName.trim() || regFirstName.trim().length < 2) {
      errors.firstName = "Iltimos, ismingizni kiriting (kamida 2 ta harf)";
    }

    if (!regLastName.trim() || regLastName.trim().length < 2) {
      errors.lastName = "Iltimos, familiyangizni kiriting (kamida 2 ta harf)";
    }

    if (!regPhone.trim()) {
      errors.phone = "Telefon raqamini kiritish majburiy";
    } else if (!isValidUzbekPhone(regPhone)) {
      errors.phone = "O'zbekiston telefon raqami formati noto'g'ri (masalan: +998 90 123-45-67)";
    }

    if (!regEmail.trim()) {
      errors.email = "Elektron pochta manzilini kiritish majburiy";
    } else if (!isValidEmail(regEmail)) {
      errors.email = "Elektron pochta manzili noto'g'ri (masalan: nom@bookstore.uz)";
    }

    if (!regPassword) {
      errors.password = "Parol kiritish majburiy";
    } else if (regPassword.length < 8) {
      errors.password = "Parol kamida 8 ta belgidan iborat bo'lishi kerak";
    }

    if (!regConfirmPassword) {
      errors.confirmPassword = "Parolni tasdiqlash majburiy";
    } else if (regPassword !== regConfirmPassword) {
      errors.confirmPassword = "Parollar bir-biriga mos kelmadi";
    }

    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      return;
    }

    setRegErrors({});
    const res = register({
      firstName: regFirstName.trim(),
      lastName: regLastName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      password: regPassword,
    });

    if (!res.success && res.error) {
      setRegErrors({ general: res.error });
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !isValidEmail(forgotEmail)) {
      showToast("Iltimos, to'g'ri elektron pochta manzilini kiriting", 'warning');
      return;
    }
    setForgotSubmitted(true);
    showToast("Parolni tiklash ko'rsatmalari pochtangizga yuborildi!", 'success');
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-9 shadow-sm">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-stone-900 text-amber-400 mx-auto flex items-center justify-center font-bold mb-3 shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900">
            BookStore
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {mode === 'login'
              ? 'Tizimga kiring va xaridlaringizni davom ettiring'
              : 'Yangi hisob yarating va minglab kitoblardan bahramand bo\'ling'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setLoginErrors({});
            }}
            className={`py-2.5 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Kirish
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setRegErrors({});
            }}
            className={`py-2.5 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        {/* 1. LOGIN FORM */}
        {mode === 'login' && (
          <div>
            {/* Quick Demo Credentials Box */}
            <div className="mb-6 p-3.5 bg-amber-50/80 border border-amber-200/70 rounded-xl">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">
                      Tezkor sinov uchun Demo hisob:
                    </span>
                    <div className="text-[11px] text-amber-900 mt-0.5 font-mono space-y-0.5">
                      <p>Email: <strong className="font-semibold">{DEMO_CREDENTIALS.email}</strong></p>
                      <p>Parol: <strong className="font-semibold">{DEMO_CREDENTIALS.password}</strong></p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleDirectDemoLogin}
                    className="px-2.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-[11px] font-bold transition-colors shadow-2xs text-center"
                  >
                    Tezkor kirish
                  </button>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="text-[10px] text-amber-900 underline hover:text-amber-950 text-center"
                  >
                    Formaga qo'yish
                  </button>
                </div>
              </div>
            </div>

            {/* General Login Error Alert */}
            {loginErrors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{loginErrors.general}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email field */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Elektron pochta manzili <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginErrors.email) setLoginErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="demo@bookstore.uz"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs text-stone-900 focus:outline-none transition-colors ${
                      loginErrors.email
                        ? 'border-red-400 bg-red-50/30 focus:ring-1 focus:ring-red-400'
                        : 'border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30'
                    }`}
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{loginErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Password field with show/hide toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-800">
                    Parol <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(loginEmail);
                      setForgotSubmitted(false);
                      setForgotModalOpen(true);
                    }}
                    className="text-[11px] text-amber-800 hover:text-amber-950 hover:underline font-medium"
                  >
                    Parolni unutdingizmi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginErrors.password) setLoginErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs text-stone-900 focus:outline-none transition-colors ${
                      loginErrors.password
                        ? 'border-red-400 bg-red-50/30 focus:ring-1 focus:ring-red-400'
                        : 'border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                    title={showLoginPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{loginErrors.password}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                <span>Tizimga kirish</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Switch to Register link */}
              <div className="text-center pt-3 border-t border-stone-100 text-xs text-stone-500">
                Hisobingiz yo'qmi?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setRegErrors({});
                  }}
                  className="font-bold text-amber-900 hover:underline"
                >
                  Ro'yxatdan o'tish
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 2. REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            {regErrors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{regErrors.general}</span>
              </div>
            )}

            {/* Ism va Familiya */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Ism <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regFirstName}
                    onChange={(e) => {
                      setRegFirstName(e.target.value);
                      if (regErrors.firstName) setRegErrors((prev) => ({ ...prev, firstName: undefined }));
                    }}
                    placeholder="Masalan: Ozodbek"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs text-stone-900 focus:outline-none transition-colors ${
                      regErrors.firstName
                        ? 'border-red-400 bg-red-50/30'
                        : 'border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30'
                    }`}
                  />
                </div>
                {regErrors.firstName && (
                  <p className="text-[11px] text-red-600 mt-1">{regErrors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Familiya <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regLastName}
                    onChange={(e) => {
                      setRegLastName(e.target.value);
                      if (regErrors.lastName) setRegErrors((prev) => ({ ...prev, lastName: undefined }));
                    }}
                    placeholder="Masalan: Qodirov"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs text-stone-900 focus:outline-none transition-colors ${
                      regErrors.lastName
                        ? 'border-red-400 bg-red-50/30'
                        : 'border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30'
                    }`}
                  />
                </div>
                {regErrors.lastName && (
                  <p className="text-[11px] text-red-600 mt-1">{regErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Telefon raqami */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Telefon raqami (O'zbekiston) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={regPhone}
                  onChange={handlePhoneInputChange}
                  placeholder="+998 (90) 123-45-67"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs text-stone-900 font-mono focus:outline-none transition-colors ${
                    regErrors.phone
                      ? 'border-red-400 bg-red-50/30'
                      : 'border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30'
                  }`}
                />
              </div>
              {regErrors.phone && (
                <p className="text-[11px] text-red-600 mt-1">{regErrors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Elektron pochta manzili <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (regErrors.email) setRegErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="nom@kitobxon.uz"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs text-stone-900 focus:outline-none transition-colors ${
                    regErrors.email
                      ? 'border-red-400 bg-red-50/30'
                      : 'border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30'
                  }`}
                />
              </div>
              {regErrors.email && (
                <p className="text-[11px] text-red-600 mt-1">{regErrors.email}</p>
              )}
            </div>

            {/* Parol va Parolni tasdiqlash */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Parol (kamida 8 ta belgi) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      if (regErrors.password) setRegErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="Kamida 8 belgi"
                    className={`w-full pl-10 pr-9 py-2.5 rounded-xl border text-xs text-stone-900 focus:outline-none transition-colors ${
                      regErrors.password
                        ? 'border-red-400 bg-red-50/30'
                        : 'border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {regErrors.password && (
                  <p className="text-[11px] text-red-600 mt-1">{regErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Parolni tasdiqlash <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => {
                      setRegConfirmPassword(e.target.value);
                      if (regErrors.confirmPassword) setRegErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    placeholder="Qayta kiriting"
                    className={`w-full pl-10 pr-9 py-2.5 rounded-xl border text-xs text-stone-900 focus:outline-none transition-colors ${
                      regErrors.confirmPassword
                        ? 'border-red-400 bg-red-50/30'
                        : 'border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                  >
                    {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {regErrors.confirmPassword && (
                  <p className="text-[11px] text-red-600 mt-1">{regErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 mt-4"
            >
              <span>Ro'yxatdan o'tish</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Switch to Login link */}
            <div className="text-center pt-3 border-t border-stone-100 text-xs text-stone-500">
              Profilingiz bormi?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setLoginErrors({});
                }}
                className="font-bold text-amber-900 hover:underline"
              >
                Tizimga kiring
              </button>
            </div>
          </form>
        )}

        {/* Back to Home CTA */}
        <div className="text-center mt-6 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
          >
            ← Bosh sahifaga qaytish
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="font-serif-title text-xl font-bold text-stone-900 mb-1">
              Parolni tiklash
            </h3>
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              Ro'yxatdan o'tgan elektron pochta manzilingizni kiriting. Sizga parolni tiklash bo'yicha yo'riqnoma yuboriladi.
            </p>

            {/* Demo reminder note */}
            <div className="mb-4 p-3 bg-stone-50 border border-stone-200/80 rounded-xl text-xs text-stone-600">
              <p className="font-semibold text-stone-800">Eslatma:</p>
              <p className="text-[11px] mt-0.5">
                Demo hisob paroli doimo o'zgarmas: <strong className="font-mono text-stone-900">BookStore123!</strong> (Email: demo@bookstore.uz)
              </p>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-semibold text-emerald-900">
                  Yo'riqnoma {forgotEmail} manziliga yuborildi!
                </p>
                <button
                  onClick={() => setForgotModalOpen(false)}
                  className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800"
                >
                  Tushunarli
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Elektron pochta manzili
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="demo@bookstore.uz"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 py-2.5 border border-stone-300 text-stone-700 rounded-xl text-xs font-medium hover:bg-stone-50"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Havola yuborish
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
