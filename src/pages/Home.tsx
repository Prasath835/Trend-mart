import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Clock, Headphones, RefreshCw, CheckCircle2, Sparkles, Star } from 'lucide-react';
import { Product } from '../types/index.ts';
import { productAPI } from '../services/api.ts';
import { ProductGrid } from '../components/products/ProductGrid.tsx';
import { LoadingState } from '../components/common/LoadingState.tsx';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await productAPI.getProducts({ sort: 'featured' });
        setFeaturedProducts(res.products.slice(0, 8));
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const categories = [
    {
      name: 'Electronics',
      count: '5+ Curated Devices',
      tag: 'ANC, Titanium & MagSafe',
      path: '/products?category=Electronics',
      color: 'hover:border-emerald-700 hover:bg-emerald-50/30',
    },
    {
      name: 'Fashion',
      count: '5+ Organic Fabrics',
      tag: 'French Linen & Merino',
      path: '/products?category=Fashion',
      color: 'hover:border-amber-700 hover:bg-amber-50/30',
    },
    {
      name: 'Accessories',
      count: '5+ Everyday Carry',
      tag: 'Full-Grain & Ballistic Twill',
      path: '/products?category=Accessories',
      color: 'hover:border-teal-700 hover:bg-teal-50/30',
    },
    {
      name: 'Home & Living',
      count: '5+ Natural Spaces',
      tag: 'Solid Walnut & Stoneware',
      path: '/products?category=Home%20%26%20Living',
      color: 'hover:border-amber-800 hover:bg-amber-50/30',
    },
    {
      name: 'Footwear',
      count: '5+ Enduring Pairs',
      tag: 'Goodyear Welt & Aero-Mesh',
      path: '/products?category=Footwear',
      color: 'hover:border-emerald-800 hover:bg-emerald-50/30',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-16">
      {/* Editorial Hero Section with Warm Amber & Forest Emerald Accents */}
      <section className="relative border-b border-stone-200/90 bg-gradient-to-b from-amber-100/40 via-white/50 to-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Editorial Copy, Trust Tags & CTAs */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-xs font-semibold uppercase tracking-wider text-emerald-900">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>24/7 Doorstep Fulfillment · 2026 Collection</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-slate-950 tracking-tight leading-[1.12] text-balance">
                Everything You Need. <br className="hidden sm:inline" />
                <span className="text-emerald-800 italic">All in One Place.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed max-w-xl text-balance">
                Discover thoughtfully selected products for everyday living, work, and personal style. Designed for enduring utility, tactile satisfaction, and transparent Cash on Delivery service.
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <Link
                  to="/products"
                  className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold tracking-wide transition-all rounded-xs shadow-sm hover:shadow-md inline-flex items-center gap-2 active:bg-emerald-950"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/products"
                  className="px-6 py-3.5 border border-stone-300 bg-white hover:bg-stone-50 text-slate-900 text-sm font-semibold tracking-wide transition-colors rounded-xs inline-flex items-center shadow-2xs"
                >
                  Explore 25+ Products
                </Link>
              </div>

              {/* 24/7 & Value Proposition Highlights */}
              <div className="pt-4 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <Headphones className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">24/7 Support</p>
                    <p className="text-[11px] text-slate-500">Live agent assistance</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Cash on Delivery</p>
                    <p className="text-[11px] text-slate-500">Pay on parcel arrival</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 col-span-2 sm:col-span-1">
                  <Truck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Free Shipping</p>
                    <p className="text-[11px] text-slate-500">On all orders above ₹999</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-6">
              <div className="relative aspect-16/10 sm:aspect-4/3 rounded-xs overflow-hidden border border-stone-200 bg-stone-100 shadow-md">
                <img
                  src="/src/assets/images/hero_lifestyle_vibrant_1790607646067.jpg"
                  alt="Curated premium lifestyle products composition"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xs border border-white/10 text-[11px] text-white tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>25 Unique Products Across 5 Departments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 24/7 Service Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 sm:p-6 bg-white border border-stone-200 rounded-xs shadow-2xs">
          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">24/7 Dedicated Care</h3>
              <p className="text-xs text-slate-500 mt-0.5">Round-the-clock help & order queries</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Doorstep Verification</h3>
              <p className="text-xs text-slate-500 mt-0.5">Inspect parcel seal before paying cash</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">7-Day Easy Exchange</h3>
              <p className="text-xs text-slate-500 mt-0.5">Hassle-free size and product swap</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Express Dispatch</h3>
              <p className="text-xs text-slate-500 mt-0.5">Dispatched within 24 hours of placement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by Department (Minimum 5 products per department) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-6 pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif-display font-bold text-slate-950">
              Explore by Department
            </h2>
            <p className="text-xs uppercase tracking-wider text-emerald-800 font-semibold mt-1">
              Minimum 5 Curated Products in Every Department
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:underline inline-flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>View All 25 Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className={`p-5 bg-white border border-stone-200/90 transition-all rounded-xs group flex flex-col justify-between min-h-[120px] shadow-2xs ${cat.color}`}
            >
              <div>
                <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-900">
                  {cat.name}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  {cat.tag}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 self-start px-2 py-0.5 rounded-xs mt-3">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Collection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-6 pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif-display font-bold text-slate-950">
              Featured Highlights
            </h2>
            <p className="text-xs uppercase tracking-wider text-slate-500 mt-1">
              Bestsellers and editorial favorites across technology, apparel, and interiors
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-emerald-800 hover:underline inline-flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Loading catalog inventory..." />
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
      </section>

      {/* Editorial Standards Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 text-white p-8 sm:p-12 lg:p-14 rounded-xs border-l-4 border-emerald-500 shadow-md">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              The Trend Mart Standard · 24/7 Reliability
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-display font-bold tracking-tight text-white">
              Everyday Products. Uncompromising Standards.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Every item in our collection is backed by physical inspection upon delivery and 24/7 customer care. Whether you are ordering wireless studio earbuds or French flax linen shirts, our team ensures honest pricing and dependable doorstep service.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Shop the complete 25-item catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
