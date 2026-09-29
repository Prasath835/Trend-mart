import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { Button } from '../components/common/Button.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';

export const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, subtotal, shippingFee, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty."
          description="You haven't added any products to your shopping cart yet. Browse our curated collection to find everyday essentials."
          actionText="Continue Shopping"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="pb-6 mb-8 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-neutral-950">
            Shopping Cart
          </h1>
          <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
            Review your selected products prior to order placement
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-neutral-500 hover:text-rose-700 underline self-start sm:self-auto cursor-pointer"
        >
          Clear entire cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-neutral-200/90 rounded-xs divide-y divide-neutral-100">
            {items.map((item) => (
              <div key={item.product._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                {/* Thumbnail */}
                <Link
                  to={`/products/${item.product._id}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 aspect-square bg-[#f5f5f2] rounded-xs overflow-hidden shrink-0 border border-neutral-200"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                    {item.product.category}
                  </span>
                  <h3 className="text-sm font-semibold text-neutral-900 mt-0.5">
                    <Link to={`/products/${item.product._id}`} className="hover:underline">
                      {item.product.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Unit Price: <span className="tabular-nums font-medium text-neutral-800">₹{item.product.price.toLocaleString('en-IN')}</span>
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="inline-flex items-center border border-neutral-300 rounded-xs bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold text-neutral-900 tabular-nums min-w-[32px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <div className="w-24 text-right">
                    <span className="text-sm font-semibold text-neutral-950 tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-neutral-200/90 rounded-xs p-6 sticky top-24 space-y-6">
            <h2 className="text-base font-semibold text-neutral-950 pb-3 border-b border-neutral-200">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-neutral-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Standard Delivery</span>
                <span className="tabular-nums font-medium text-neutral-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700">Complimentary</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              {shippingFee > 0 && (
                <p className="text-[11px] text-neutral-500 bg-neutral-50 p-2 rounded-xs">
                  Add ₹{(999 - subtotal).toLocaleString('en-IN')} more to unlock free delivery.
                </p>
              )}

              <div className="pt-3 border-t border-neutral-200 flex justify-between text-base font-semibold text-neutral-950">
                <span>Total Amount</span>
                <span className="tabular-nums">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-neutral-400">All prices inclusive of GST</p>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate('/checkout')}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-500 space-y-1">
              <p className="font-medium text-neutral-700">Payment on Delivery</p>
              <p>Cash on Delivery is verified during the checkout step.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
