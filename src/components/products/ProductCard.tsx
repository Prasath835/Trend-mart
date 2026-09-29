import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { useCart } from '../../context/CartContext.tsx';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    setIsAdding(true);
    addItem(product, 1);
    setTimeout(() => setIsAdding(false), 500);
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col bg-white border border-stone-200/90 rounded-xs overflow-hidden transition-all duration-200 hover:border-emerald-600 hover:shadow-md">
      {/* Product Image Stage */}
      <Link to={`/products/${product._id}`} className="relative aspect-4/3 overflow-hidden bg-[#f4f4f0] block">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-104"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-100">
            <span className="text-xs uppercase tracking-widest text-stone-400 font-medium">Trend Mart</span>
            <span className="text-sm font-semibold text-slate-700 mt-1">{product.name}</span>
          </div>
        )}

        {/* Highlight badge if available */}
        {product.highlightBadge && (
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-semibold tracking-wide uppercase bg-emerald-800 text-white shadow-xs">
              {product.highlightBadge}
            </span>
          </div>
        )}

        {/* COD Badge Top Right */}
        <div className="absolute top-2.5 right-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-medium tracking-wide bg-amber-50/95 border border-amber-300 text-amber-900 backdrop-blur-xs">
            COD
          </span>
        </div>

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-0 bg-slate-950/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 text-slate-900 text-xs font-semibold shadow-sm rounded-xs border border-stone-200">
            <Eye className="w-3.5 h-3.5 text-emerald-700" />
            <span>View Product</span>
          </span>
        </div>
      </Link>

      {/* Product Details Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Availability */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
          <span className="uppercase tracking-wider font-semibold text-[11px] text-emerald-700">
            {product.category}
          </span>
          <span className="text-[11px]">
            {isOutOfStock ? (
              <span className="text-rose-600 font-medium">Out of stock</span>
            ) : isLowStock ? (
              <span className="text-amber-700 font-medium">Only {product.stock} left</span>
            ) : (
              <span className="text-emerald-700 font-medium">In Stock</span>
            )}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 mb-1 group-hover:text-emerald-900 transition-colors">
          <Link to={`/products/${product._id}`}>
            {product.name}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {product.description}
        </p>

        {/* Bottom Bar: Price and Actions */}
        <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Price</span>
            <span className="text-base font-bold text-slate-950 tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xs transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-emerald-800 text-white hover:bg-emerald-900 active:bg-emerald-950 shadow-xs'
              }`}
              title="Add to Shopping Cart"
            >
              {isAdding ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
