import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Package, LogOut, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { Button } from '../components/common/Button.tsx';

export const Account: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="pb-6 mb-8 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-neutral-950">
            Account Profile
          </h1>
          <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
            Manage your personal profile and shopping preferences
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleLogout} className="self-start sm:self-auto bg-white">
          <LogOut className="w-3.5 h-3.5 mr-1.5" />
          <span>Sign Out</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-2 bg-white border border-neutral-200/90 rounded-xs p-6 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-neutral-100">
            <div className="w-14 h-14 bg-neutral-900 text-white rounded-full flex items-center justify-center font-serif-display text-xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900">{user?.name}</h2>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                <span className="capitalize">{user?.role} Account</span>
                <span aria-hidden="true">·</span>
                <span>Active Member</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Email Address</span>
                <span className="text-sm font-medium text-neutral-900">{user?.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Phone Number</span>
                <span className="text-sm font-medium text-neutral-900">{user?.phone || 'Not provided'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Default Delivery Address</span>
                <span className="text-sm font-medium text-neutral-900">
                  {user?.address || 'No default address saved. You can enter an address during checkout.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200/90 rounded-xs p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
              Quick Shortcuts
            </h3>
            <div className="space-y-2">
              <Link
                to="/orders"
                className="flex items-center justify-between p-2.5 rounded-xs border border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50 text-xs font-medium text-neutral-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-neutral-600" />
                  <span>My Orders</span>
                </div>
                <span>→</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center justify-between p-2.5 rounded-xs border border-neutral-900 bg-neutral-900 text-white text-xs font-medium transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </div>
                  <span>→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
