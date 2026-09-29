import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Menu, X, ShieldCheck, Clock, Headphones, Sparkles, CheckCircle, Palette, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { useTheme, THEMES, ThemeId } from '../../context/ThemeContext.tsx';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems, feedbackMessage } = useCart();
  const { theme, setTheme, themeConfig } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'My Orders', path: '/orders' },
    { name: 'Cart', path: '/cart' },
    { name: 'Account', path: isAuthenticated ? '/account' : '/login' },
  ];

  return (
    <>
      {/* 24/7 & Value Assurance Top Header Bar (Rich Emerald & Warm Amber Accents) */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-3 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              24/7 Customer Support Available
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-300">Free Domestic Delivery Over ₹999</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-300">
            <span className="text-amber-300 font-medium inline-flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-amber-400" />
              100% Cash on Delivery
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Doorstep Inspection</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <header className={`sticky top-0 z-40 ${themeConfig.navbarBg} border-b border-stone-200/90 shadow-2xs transition-all`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Zone 1: Brand Title Wordmark with Emerald Touch */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-xs bg-slate-900 text-white flex items-center justify-center font-serif-display font-bold text-lg group-hover:bg-emerald-800 transition-colors">
                T
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-serif-display font-bold tracking-tight text-slate-950 group-hover:text-emerald-900 transition-colors leading-none">
                  Trend Mart
                </span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-700 font-semibold">
                  Curated Commerce
                </span>
              </div>
            </Link>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm tracking-wide transition-colors py-1 relative ${
                    active
                      ? 'text-emerald-800 font-semibold'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-700 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-4">
            {/* Background Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="p-2 text-slate-800 hover:text-emerald-800 transition-colors focus:outline-none flex items-center gap-1.5 rounded-xs"
                title={`Background: ${themeConfig.name}`}
                aria-label="Change Background Theme"
              >
                <Palette className="w-5 h-5 stroke-[1.8]" />
                <span
                  className="w-2.5 h-2.5 rounded-full border border-stone-400 shadow-2xs hidden lg:inline-block"
                  style={{ backgroundColor: themeConfig.previewColor }}
                />
              </button>

              {themeDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setThemeDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-stone-200 shadow-xl rounded-xs py-2 px-2.5 z-50">
                    <div className="pb-2 mb-2 border-b border-stone-100 flex items-center justify-between">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                        Attractive Themes
                      </p>
                      <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded-xs">
                        {themeConfig.name}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {Object.values(THEMES).map((t) => {
                        const isCurrent = t.id === theme;
                        return (
                          <button
                            key={t.id}
                            onClick={() => {
                              setTheme(t.id as ThemeId);
                              setThemeDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xs text-xs transition-all text-left cursor-pointer ${
                              isCurrent
                                ? 'bg-stone-100 font-semibold text-slate-950 border border-stone-300'
                                : 'hover:bg-stone-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-4 h-4 rounded-full border border-stone-300 shrink-0 shadow-2xs"
                                style={{ backgroundColor: t.previewColor }}
                              />
                              <div>
                                <p className="leading-tight text-xs">{t.name}</p>
                                <p className="text-[10px] text-slate-400">{t.badge}</p>
                              </div>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Admin Switch */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-emerald-800 px-2.5 py-1.5 border border-slate-300 rounded-xs hover:border-emerald-700 bg-white transition-colors"
                title="Switch to Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Admin Suite</span>
              </Link>
            )}

            {/* Shopping Bag Button */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-800 hover:text-emerald-800 transition-colors flex items-center"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[19px] h-[19px] px-1 bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center rounded-full tabular-nums shadow-xs">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="p-2 text-slate-800 hover:text-emerald-800 transition-colors focus:outline-none flex items-center gap-1"
                aria-label="User Account"
              >
                <UserIcon className="w-5 h-5 stroke-[1.8]" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-stone-200 shadow-lg rounded-xs py-2 z-50">
                    {isAuthenticated ? (
                      <div>
                        <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/70">
                          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Signed in</p>
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>

                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                          >
                            Admin Dashboard
                          </Link>
                        )}

                        <Link
                          to="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-slate-700 hover:bg-stone-50"
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-slate-700 hover:bg-stone-50"
                        >
                          Account Profile
                        </Link>

                        <div className="border-t border-stone-100 mt-1 pt-1">
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              logout();
                              navigate('/');
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-stone-50 font-medium"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="px-4 py-2 border-b border-stone-100">
                          <p className="text-xs font-medium text-slate-600">Welcome to Trend Mart</p>
                        </div>
                        <Link
                          to="/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          Customer Sign In
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-slate-700 hover:bg-stone-50"
                        >
                          Create Account
                        </Link>
                        <div className="border-t border-stone-100 mt-1 pt-1">
                          <Link
                            to="/admin/login"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block px-4 py-2 text-xs text-slate-500 hover:bg-stone-50 hover:text-slate-900"
                          >
                            Administrator Portal
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-800 hover:text-slate-950 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Global Cart Toast Feedback Notification */}
        {feedbackMessage && (
          <div className="bg-emerald-800 text-white text-xs py-2 px-4 text-center font-medium shadow-sm transition-all flex items-center justify-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t border-stone-200 ${themeConfig.cardBg} px-4 pt-3 pb-6 space-y-3 shadow-lg`}>
            {/* Theme Selector for Mobile */}
            <div className="pb-2 border-b border-stone-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Attractive Background Theme
              </span>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(THEMES).map((t) => {
                  const isCurrent = t.id === theme;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id as ThemeId)}
                      className={`flex items-center gap-2 p-2 rounded-xs border text-left text-xs ${
                        isCurrent
                          ? 'border-emerald-700 bg-emerald-50/50 font-semibold text-emerald-950'
                          : 'border-stone-200 bg-white text-slate-700'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0"
                        style={{ backgroundColor: t.previewColor }}
                      />
                      <span className="truncate">{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 text-sm font-medium rounded-xs ${
                  isActive(link.path)
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'text-slate-700 hover:bg-stone-100'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 text-sm font-semibold text-emerald-800 bg-emerald-50 rounded-xs"
              >
                Admin Management Suite
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/');
                }}
                className="w-full text-left px-3.5 py-2.5 text-sm font-medium text-rose-700 hover:bg-stone-100 rounded-xs"
              >
                Sign Out
              </button>
            ) : (
              <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 px-3 text-xs font-semibold bg-emerald-800 text-white rounded-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 px-3 text-xs font-semibold border border-stone-300 text-slate-800 rounded-xs bg-white"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};
