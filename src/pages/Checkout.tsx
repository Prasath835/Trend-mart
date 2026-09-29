import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, Headphones, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { orderAPI } from '../services/api.ts';
import { Input } from '../components/common/Input.tsx';
import { Button } from '../components/common/Button.tsx';

export const Checkout: React.FC = () => {
  const { items, subtotal, shippingFee, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    pincode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white border border-stone-200 text-center rounded-xs shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Cart is empty</h2>
        <p className="text-sm text-slate-500 mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 bg-emerald-800 text-white text-xs font-semibold rounded-xs hover:bg-emerald-900 transition-colors"
        >
          View Collection
        </Link>
      </div>
    );
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) nextErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 8) {
      nextErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.address.trim()) nextErrors.address = 'Street address is required';
    if (!formData.city.trim()) nextErrors.city = 'City / Town is required';
    if (!formData.pincode.trim()) {
      nextErrors.pincode = 'Pincode is required';
    } else if (formData.pincode.trim().length < 4) {
      nextErrors.pincode = 'Please enter a valid postal code';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    if (!isAuthenticated) {
      sessionStorage.setItem('pending_checkout_address', JSON.stringify(formData));
      navigate('/login?redirect=/checkout');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        items: items.map(i => ({
          productId: i.product._id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image,
          category: i.product.category,
        })),
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        },
        paymentMethod: 'Cash on Delivery' as const,
      };

      const res = await orderAPI.createOrder(orderPayload);
      clearCart();
      navigate(`/order-confirmation/${res.order._id}`, { state: { order: res.order } });
    } catch (err: any) {
      setServerError(err.message || 'Failed to place order. Please check availability and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="mb-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Cart</span>
        </Link>
      </div>

      <div className="pb-6 mb-8 border-b border-stone-200">
        <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-slate-950">
          Delivery & Payment
        </h1>
        <p className="text-xs uppercase tracking-wider text-slate-500 mt-1">
          Complete your delivery details to confirm your order · 24/7 Support Included
        </p>
      </div>

      {!isAuthenticated && (
        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>You are not signed in. You can enter details and will be prompted to sign in or create an account.</span>
          <Link to="/login?redirect=/checkout" className="font-bold underline whitespace-nowrap text-emerald-800">
            Sign In Now
          </Link>
        </div>
      )}

      {serverError && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-xs text-rose-800 rounded-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left Column: Delivery Details & Payment Choice */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          {/* Section 1: Delivery Address */}
          <div className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                1. Delivery Information
              </h2>
              <span className="text-[11px] text-emerald-800 font-semibold">Doorstep Dispatch</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Full Name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  error={errors.fullName}
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Phone Number"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={errors.phone}
                  helperText="Required for doorstep delivery coordinator verification and 24/7 SMS updates"
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Street Address / Building"
                  required
                  placeholder="Flat/House No., Building Name, Street"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  error={errors.address}
                />
              </div>

              <div>
                <Input
                  label="City"
                  required
                  placeholder="e.g. Bengaluru"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  error={errors.city}
                />
              </div>

              <div>
                <Input
                  label="Pincode"
                  required
                  placeholder="e.g. 560038"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  error={errors.pincode}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method (Cash on Delivery) */}
          <div className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                2. Payment Method
              </h2>
              <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-xs">
                Zero Advance Risk
              </span>
            </div>

            <div className="p-4 sm:p-5 border-2 border-emerald-800 rounded-xs bg-emerald-50/20">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    checked
                    readOnly
                    className="accent-emerald-800 w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="cod" className="block text-sm font-bold text-slate-950 cursor-pointer">
                    Cash on Delivery (COD) & Doorstep Inspection
                  </label>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Pay for your order when it arrives at your delivery address. Inspect the sealed parcel before paying cash or scanning UPI directly with the delivery executive.
                  </p>
                  <div className="pt-2 flex items-center gap-3 text-[11px] text-emerald-800 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Free Cancellation Anytime
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Headphones className="w-3.5 h-3.5" />
                      24/7 Helpline Support
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 sticky top-24 space-y-5 shadow-2xs">
            <h2 className="text-base font-bold text-slate-950 pb-3 border-b border-stone-200">
              Order Review ({items.length} item{items.length > 1 ? 's' : ''})
            </h2>

            {/* Itemized list in checkout */}
            <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1">
              {items.map((item) => (
                <div key={item.product._id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-xs border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0 truncate">
                      <p className="font-semibold text-slate-900 truncate">{item.product.name}</p>
                      <p className="text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-950 tabular-nums shrink-0">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-3 border-t border-stone-200 text-sm">
              <div className="flex justify-between text-slate-600 text-xs">
                <span>Items Subtotal</span>
                <span className="tabular-nums font-semibold text-slate-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 text-xs">
                <span>Doorstep Delivery</span>
                <span className="tabular-nums font-semibold text-slate-900">
                  {shippingFee === 0 ? <span className="text-emerald-700">Complimentary</span> : `₹${shippingFee}`}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-slate-950">
                <span>Total Amount Due</span>
                <span className="tabular-nums text-emerald-900">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* CTA */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-emerald-800 hover:bg-emerald-900"
              isLoading={submitting}
            >
              <span>Place Order (Cash on Delivery)</span>
            </Button>

            <div className="pt-2 text-[11px] text-slate-500 leading-normal space-y-1">
              <p>Need urgent assistance? Our support coordinators are reachable 24/7 at +91 (800) 123-4567.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
