import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Package, Sparkles } from 'lucide-react';
import { Product } from '../types/index.ts';
import { productAPI } from '../services/api.ts';
import { ProductGrid } from '../components/products/ProductGrid.tsx';
import { LoadingState } from '../components/common/LoadingState.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';

const CATEGORIES = [
  'All',
  'Electronics',
  'Fashion',
  'Accessories',
  'Home & Living',
  'Footwear',
];

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const sortOption = searchParams.get('sort') || 'featured';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await productAPI.getProducts({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery || undefined,
          sort: sortOption,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
        });
        setProducts(res.products);
      } catch (err: any) {
        setError(err.message || 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, searchQuery, sortOption, minPrice, maxPrice]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'All') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    selectedCategory !== 'All' || searchQuery !== '' || sortOption !== 'featured' || minPrice !== '' || maxPrice !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Editorial Header */}
      <div className="pb-6 mb-8 border-b border-stone-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full 25-Product Inventory · Min 5 Per Category</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-slate-950">
              The Product Collection
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Curated everyday essentials across technology, organic apparel, leathercraft, and home interiors.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs bg-emerald-50/80 border border-emerald-200/90 px-3.5 py-2 rounded-xs self-start md:self-auto text-emerald-900 font-medium">
            <span>24/7 Support Guaranteed</span>
            <span className="text-emerald-400">·</span>
            <span>All Eligible for COD</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Categories, Search, Sort & Clear */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Interactive Category Segmented Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => updateParam('category', cat)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xs whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-slate-700 hover:border-emerald-700 hover:text-emerald-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative min-w-[220px] sm:min-w-[260px] flex-1 sm:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search 25+ products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-stone-300 rounded-xs text-slate-900 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    updateParam('search', '');
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs uppercase tracking-wider text-slate-500 hidden sm:inline">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="text-xs bg-white border border-stone-300 rounded-xs px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-800 font-medium"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Indicators & Reset */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-stone-100 flex-wrap">
            <span>Filtering active</span>
            {selectedCategory !== 'All' && <span>· Department: <strong className="text-slate-800">{selectedCategory}</strong></span>}
            {searchQuery && <span>· Query: &quot;<strong className="text-slate-800">{searchQuery}</strong>&quot;</span>}
            {sortOption !== 'featured' && <span>· Sorted</span>}
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-emerald-800 hover:underline ml-2 cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Product Content Area */}
      {loading ? (
        <LoadingState message="Loading catalog inventory..." />
      ) : error ? (
        <EmptyState
          icon={Package}
          title="Catalogue Unavailable"
          description={error}
          actionText="Try Again"
          onAction={() => window.location.reload()}
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Products Found"
          description="We couldn't find any products matching your current search or category criteria. Try resetting filters or searching for another term."
          actionText="Reset All Filters"
          onAction={clearAllFilters}
        />
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
            <span className="font-medium text-slate-700">Showing {products.length} products</span>
            <span>All prices in Indian Rupees (₹) · Cash on Delivery</span>
          </div>
          <ProductGrid products={products} />
        </div>
      )}
    </div>
  );
};
