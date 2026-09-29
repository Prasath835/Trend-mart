import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { ExternalLink, LogOut, LayoutDashboard, Package, Users, ShoppingCart } from 'lucide-react';

export const AdminNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-neutral-950 text-white border-b border-neutral-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center space-x-6">
          <Link to="/admin/dashboard" className="flex items-center gap-2 group">
            <span className="font-serif-display text-lg font-bold tracking-tight text-white group-hover:text-neutral-300 transition-colors">
              Trend Mart
            </span>
            <span className="text-[11px] font-sans uppercase tracking-widest text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-xs">
              Admin
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-neutral-800">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xs transition-colors ${
                    active
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User / Actions */}
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors hidden sm:inline-flex"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <div className="h-4 w-[1px] bg-neutral-800 hidden sm:block" />

          <div className="text-right hidden sm:block">
            <p className="text-xs text-neutral-200 font-medium">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-neutral-500 font-mono">admin-session</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-white px-2.5 py-1.5 rounded-xs hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-neutral-900 bg-neutral-900/60 overflow-x-auto">
        {links.map((link) => {
          const active = isActive(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`px-3 py-1 text-xs font-medium whitespace-nowrap ${
                active ? 'text-white border-b-2 border-white' : 'text-neutral-400'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </header>
  );
};
