import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, ShieldCheck, Truck, Clock, Mail, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* 24/7 Service Banner in Footer */}
      <div className="border-b border-slate-800 bg-slate-900/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white uppercase tracking-wider">24/7 Support Hotline</p>
              <p className="text-slate-400">Available day and night for order help & queries</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white uppercase tracking-wider">Cash on Delivery</p>
              <p className="text-slate-400">Pay safely upon doorstep parcel inspection</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:col-span-2 md:col-span-1">
            <div className="w-9 h-9 rounded-full bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white uppercase tracking-wider">Complimentary Delivery</p>
              <p className="text-slate-400">Free domestic shipping on orders over ₹999</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Tagline */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xs bg-emerald-800 text-white flex items-center justify-center font-serif-display font-bold text-base">
                T
              </div>
              <h2 className="text-xl font-serif-display font-bold text-white tracking-tight">
                Trend Mart
              </h2>
            </div>
            <p className="text-sm text-emerald-400 font-medium">
              Everything You Need. All in One Place.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Curated everyday digital department store. 25+ unique premium products across electronics, organic fashion, accessories, and interior essentials.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">
              Departments
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/products?category=Electronics" className="hover:text-emerald-400 transition-colors">
                  Electronics (5 Items)
                </Link>
              </li>
              <li>
                <Link to="/products?category=Fashion" className="hover:text-emerald-400 transition-colors">
                  Fashion (5 Items)
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" className="hover:text-emerald-400 transition-colors">
                  Accessories (5 Items)
                </Link>
              </li>
              <li>
                <Link to="/products?category=Home%20%26%20Living" className="hover:text-emerald-400 transition-colors">
                  Home & Living (5 Items)
                </Link>
              </li>
              <li>
                <Link to="/products?category=Footwear" className="hover:text-emerald-400 transition-colors">
                  Footwear (5 Items)
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">
              Customer Account
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Login to Account
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  Create New Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-emerald-400 transition-colors">
                  Order Tracking & History
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-emerald-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li className="pt-1">
                <Link to="/admin/login" className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors">
                  Administrator Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* 24/7 Support */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">
              24/7 Customer Care
            </h3>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-300">support@trendmart.com</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-300">+91 (800) 123-4567 (Toll-Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-amber-300 font-medium">24 Hours / 7 Days Live</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Cash on Delivery with open parcel inspection eligible on all domestic deliveries.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Trend Mart. All Rights Reserved. Full-Stack Commerce Project.</p>
          <div className="flex items-center space-x-6">
            <span>24/7 Verified</span>
            <span aria-hidden="true">·</span>
            <span>Cash on Delivery</span>
            <span aria-hidden="true">·</span>
            <span>25 Products Populated</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
