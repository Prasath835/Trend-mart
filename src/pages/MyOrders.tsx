import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, X, Clock, CheckCircle2, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import { Order } from '../types/index.ts';
import { orderAPI } from '../services/api.ts';
import { LoadingState } from '../components/common/LoadingState.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';
import { Button } from '../components/common/Button.tsx';

export const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const res = await orderAPI.getMyOrders();
        setOrders(res.orders);
      } catch (err: any) {
        setError(err.message || 'Failed to retrieve orders.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />;
      case 'Shipped':
        return <Truck className="w-3.5 h-3.5 text-blue-700" />;
      case 'Processing':
        return <Clock className="w-3.5 h-3.5 text-amber-700" />;
      case 'Cancelled':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-700" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-neutral-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="pb-6 mb-8 border-b border-neutral-200">
        <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-neutral-950">
          My Order History
        </h1>
        <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
          Review placed orders, status updates, and delivery information
        </p>
      </div>

      {loading ? (
        <LoadingState message="Loading your purchase records..." />
      ) : error ? (
        <EmptyState
          icon={Package}
          title="Could Not Load Orders"
          description={error}
          actionText="Retry"
          onAction={() => window.location.reload()}
        />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No Orders Found"
          description="You have not placed any orders with Trend Mart yet. Browse our products and place your first order with Cash on Delivery."
          actionText="Shop Collection"
          onAction={() => (window.location.href = '/products')}
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200/90 rounded-xs divide-y divide-neutral-100">
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={order._id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#fafaf7] transition-colors"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-sm text-neutral-950">
                        {order._id}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700">
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>Placed on {formattedDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                      <span aria-hidden="true">·</span>
                      <span>{order.paymentMethod}</span>
                    </div>

                    {/* Preview item titles */}
                    <p className="text-xs text-neutral-600 line-clamp-1 pt-0.5">
                      {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                        Order Total
                      </span>
                      <span className="text-base font-semibold text-neutral-950 tabular-nums">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="bg-white"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-neutral-200 shadow-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-500">Order Information</span>
                <h2 className="text-lg font-bold font-serif-display text-neutral-900 mt-0.5">
                  {selectedOrder._id}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Status */}
            <div className="p-3 bg-[#faf9f6] border border-neutral-200/80 rounded-xs flex items-center justify-between">
              <span className="text-xs text-neutral-600 font-medium">Fulfillment Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900">
                {getStatusIcon(selectedOrder.status)}
                <span>{selectedOrder.status}</span>
              </span>
            </div>

            {/* Ordered Items List */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                Items In This Order
              </h3>
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xs">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-xs border border-neutral-200"
                      />
                      <div>
                        <p className="font-semibold text-neutral-900">{item.name}</p>
                        <p className="text-neutral-500">Unit Price: ₹{item.price.toLocaleString('en-IN')} · Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-neutral-950 tabular-nums">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address & Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white border border-neutral-200 rounded-xs space-y-1">
                <span className="font-semibold uppercase tracking-wider text-neutral-500 block mb-1 text-[11px]">
                  Delivery Address
                </span>
                <p className="font-semibold text-neutral-900">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-neutral-600">{selectedOrder.shippingAddress.phone}</p>
                <p className="text-neutral-600">{selectedOrder.shippingAddress.address}</p>
                <p className="text-neutral-600">{selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.pincode}</p>
              </div>

              <div className="p-4 bg-white border border-neutral-200 rounded-xs space-y-2">
                <span className="font-semibold uppercase tracking-wider text-neutral-500 block mb-1 text-[11px]">
                  Payment & Invoice
                </span>
                <div className="flex justify-between text-neutral-600">
                  <span>Method</span>
                  <span className="font-medium text-neutral-900">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Total Amount</span>
                  <span className="font-bold text-neutral-950 tabular-nums text-sm">
                    ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end">
              <Button variant="secondary" size="md" onClick={() => setSelectedOrder(null)}>
                Close Window
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
