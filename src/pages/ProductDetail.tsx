import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Check, AlertCircle, Headphones, Clock, RefreshCw } from 'lucide-react';
import { Product } from '../types/index.ts';
import { productAPI } from '../services/api.ts';
import { useCart } from '../context/CartContext.tsx';
import { Button } from '../components/common/Button.tsx';
import { LoadingState } from '../components/common/LoadingState.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await productAPI.getProductById(id);
        setProduct(res.product);
      } catch (err: any) {
        setError(err.message || 'Product not found.');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addItem(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) return;
    addItem(product, quantity);
    navigate('/checkout');
  };

  if (loading) {
    return <LoadingState message="Loading product specifications..." />;
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="Product Unavailable"
          description={error || 'The requested product could not be located in our catalog.'}
          actionText="Back to Collection"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb / Back Navigation */}
      <div className="mb-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Products</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left Column: Product Photography with Highlight Badge */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 aspect-4/3 sm:aspect-1/1 bg-[#f5f5f2] rounded-xs border border-stone-200 overflow-hidden relative shadow-sm">
            {!imgError ? (
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-stone-100">
                <span className="text-xs uppercase tracking-widest text-stone-400 font-medium">Trend Mart</span>
                <span className="text-lg font-semibold text-slate-800 mt-2">{product.name}</span>
              </div>
            )}

            {product.highlightBadge && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-xs text-xs font-bold uppercase tracking-wider bg-emerald-800 text-white shadow-xs">
                  {product.highlightBadge}
                </span>
              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-xs border border-stone-200 text-xs font-medium text-slate-700">
              Cash on Delivery Eligible
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 flex flex-col space-y-5">
          {/* Metadata line */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="uppercase tracking-widest font-bold text-emerald-800">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>SKU: {product._id.slice(-6).toUpperCase()}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-800 font-medium">Doorstep Inspection</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-slate-950 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="pt-1 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-950 tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-500">Inclusive of all taxes & free shipping over ₹999</span>
          </div>

          {/* Description */}
          <div className="pt-2 border-t border-stone-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Product Overview & Materials
            </h2>
            <p className="text-sm text-slate-600 font-light leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Availability Status */}
          <div className="text-xs pt-1">
            {isOutOfStock ? (
              <span className="text-rose-600 font-medium inline-flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Currently out of stock</span>
              </span>
            ) : isLowStock ? (
              <span className="text-amber-800 font-medium inline-flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Limited availability — only {product.stock} units remaining</span>
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>In Stock ({product.stock} units available for express dispatch)</span>
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="pt-1">
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-600 mb-1.5">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-stone-300 rounded-xs bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-sm text-slate-600 hover:text-slate-950 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-slate-900 tabular-nums min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 text-sm text-slate-600 hover:text-slate-950 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  Subtotal: <strong className="text-slate-900 font-bold tabular-nums">₹{(product.price * quantity).toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Purchase Actions */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full bg-emerald-800 hover:bg-emerald-900"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                <span>{addedToast ? 'Added to Cart' : 'Add to Cart'}</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full bg-white hover:bg-stone-50 border-stone-300"
              >
                <span>Buy Now with COD</span>
              </Button>
            </div>

            {addedToast && (
              <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xs text-center font-semibold">
                Added {quantity} unit(s) of &quot;{product.name}&quot; to your bag.
              </p>
            )}
          </div>

          {/* 24/7 & Delivery Assurance Module */}
          <div className="pt-5 border-t border-stone-200 space-y-3 text-xs text-slate-600 bg-stone-50/60 p-4 rounded-xs border border-stone-200/60">
            <div className="flex items-start gap-3">
              <Headphones className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">24/7 Customer Support</p>
                <p className="text-slate-500">Contact our dedicated support desk anytime via phone or email for real-time tracking.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Cash on Delivery & Open Inspection</p>
                <p className="text-slate-500">Pay directly to the delivery partner in cash or UPI after inspecting your package.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Express Delivery</p>
                <p className="text-slate-500">Fast doorstep courier dispatch. Complimentary shipping on orders exceeding ₹999.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
