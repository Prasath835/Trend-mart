import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, ShoppingBag } from 'lucide-react';
import { Order } from '../types/index.ts';
import { orderAPI } from '../services/api.ts';
import { LoadingState } from '../components/common/LoadingState.tsx';
import { Button } from '../components/common/Button.tsx';

export const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const stateOrder = location.state?.order as Order | undefined;

  const [order, setOrder] = useState<Order | null>(stateOrder || null);
  const [loading, setLoading] = useState(!stateOrder);

  useEffect(() => {
    async function loadOrder() {
      if (stateOrder || !id) return;
      try {
        const res = await orderAPI.getOrderById(id);
        setOrder(res.order);
      } catch (err) {
        console.error('Failed to load order confirmation details', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id, stateOrder]);

  if (loading) {
    return <LoadingState message="Finalizing order receipt..." />;
  }

  const orderId = order?._id || id;
  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="bg-white border border-neutral-200/90 rounded-xs p-8 sm:p-12 text-center">
        {/* Professional Human Checkmark Icon (no emoji) */}
        <div className="w-14 h-14 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-7 h-7 stroke-[1.8]" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-neutral-950 mb-3">
          Order Placed Successfully
        </h1>

        {/* Supporting Copy */}
        <p className="text-sm sm:text-base text-neutral-600 max-w-lg mx-auto mb-8 font-light leading-relaxed">
          Thank you for shopping with Trend Mart. Your order has been received and is now being processed.
        </p>

        {/* Order Details Summary Box */}
        <div className="bg-white border border-neutral-200/80 shadow-xs rounded-xs p-6 text-left max-w-xl mx-auto mb-8 space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between items-center pb-2.5 border-b border-neutral-200">
            <span className="text-neutral-500 font-medium">Order ID</span>
            <span className="font-mono font-semibold text-neutral-900">{orderId}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-neutral-200">
            <span className="text-neutral-500 font-medium">Order Date</span>
            <span className="text-neutral-900 font-medium">{orderDate}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-neutral-200">
            <span className="text-neutral-500 font-medium">Payment Method</span>
            <span className="text-neutral-900 font-semibold">{order?.paymentMethod || 'Cash on Delivery'}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-neutral-200">
            <span className="text-neutral-500 font-medium">Order Status</span>
            <span className="font-medium text-neutral-900">
              {order?.status || 'Order Placed'}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1 text-sm sm:text-base font-bold text-neutral-950">
            <span>Total Amount</span>
            <span className="tabular-nums">
              ₹{order ? order.totalAmount.toLocaleString('en-IN') : '—'}
            </span>
          </div>
        </div>

        {/* Customer Shipping Address if available */}
        {order?.shippingAddress && (
          <div className="max-w-xl mx-auto text-left p-4 bg-white border border-neutral-200 rounded-xs mb-8 text-xs text-neutral-600">
            <p className="font-semibold text-neutral-900 mb-1">Delivering to:</p>
            <p className="font-medium text-neutral-800">{order.shippingAddress.fullName} · {order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/orders')}
            className="w-full sm:w-auto"
          >
            <Package className="w-4 h-4 mr-2" />
            <span>View My Orders</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/products')}
            className="w-full sm:w-auto bg-white"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            <span>Continue Shopping</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
