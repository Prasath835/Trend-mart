import React, { useEffect, useState } from 'react';
import { ShoppingCart, Search, Eye, X, Check, Clock, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../../types/index.ts';
import { orderAPI } from '../../services/api.ts';
import { LoadingState } from '../../components/common/LoadingState.tsx';
import { EmptyState } from '../../components/common/EmptyState.tsx';
import { Button } from '../../components/common/Button.tsx';

const STATUS_OPTIONS: OrderStatus[] = [
  'Order Placed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderAPI.getAdminOrders();
      setOrders(res.orders);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customer orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await orderAPI.updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => (o._id === orderId ? res.order : o))
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(res.order);
      }
      setUpdateMsg(`Order ${orderId} updated to "${newStatus}"`);
      setTimeout(() => setUpdateMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesSearch =
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.phone.includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-200">
        <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-neutral-950">
          Order Management & Fulfillment
        </h1>
        <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
          Review customer purchase transactions, delivery manifests, and fulfillment stages
        </p>
      </div>

      {updateMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{updateMsg}</span>
        </div>
      )}

      {/* Search and Status Filters */}
      <div className="bg-white border border-neutral-200 rounded-xs p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Order ID, name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
          <label className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
            Filter Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-neutral-300 rounded-xs px-3 py-1.5 text-neutral-900 focus:outline-none focus:border-neutral-900"
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <LoadingState message="Loading customer order manifests..." />
      ) : error ? (
        <EmptyState
          icon={ShoppingCart}
          title="Error Loading Orders"
          description={error}
          actionText="Retry"
          onAction={fetchOrders}
        />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No Orders Found"
          description="No orders currently match your search and filter criteria."
          actionText="Reset Filters"
          onAction={() => {
            setSearch('');
            setStatusFilter('All');
          }}
        />
      ) : (
        <div className="bg-white border border-neutral-200/90 rounded-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf9f6] border-b border-neutral-200 text-neutral-600 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Order ID</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Total Amount</th>
                  <th className="px-5 py-3 font-semibold">Payment</th>
                  <th className="px-5 py-3 font-semibold">Status Action</th>
                  <th className="px-5 py-3 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={order._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-semibold text-neutral-950">
                        {order._id}
                      </td>

                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-neutral-900">{order.customerName}</p>
                        <p className="text-neutral-500 text-[11px]">{order.shippingAddress.phone}</p>
                      </td>

                      <td className="px-5 py-3.5 text-neutral-600">
                        {dateStr}
                      </td>

                      <td className="px-5 py-3.5 font-semibold text-neutral-950 tabular-nums">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>

                      <td className="px-5 py-3.5 text-neutral-700">
                        {order.paymentMethod}
                      </td>

                      <td className="px-5 py-3.5">
                        <select
                          value={order.status}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                          className="text-xs bg-white border border-neutral-300 rounded-xs px-2.5 py-1 text-neutral-900 focus:outline-none focus:border-neutral-900 font-medium"
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 text-xs text-neutral-700 hover:text-neutral-950 font-semibold cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-neutral-200 shadow-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-500">Order Management</span>
                <h2 className="text-lg font-bold font-serif-display text-neutral-900 mt-0.5">
                  Order #{selectedOrder._id}
                </h2>
                <p className="text-xs text-neutral-500">
                  Received on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Updater */}
            <div className="p-4 bg-[#faf9f6] border border-neutral-200/80 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-neutral-900">Current Fulfillment Stage:</span>
              <div className="flex items-center gap-2">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value as OrderStatus)}
                  className="bg-white border border-neutral-300 rounded-xs px-3 py-1.5 text-xs text-neutral-900 font-semibold focus:outline-none focus:border-neutral-900"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white border border-neutral-200 rounded-xs space-y-1">
                <span className="font-semibold uppercase tracking-wider text-neutral-500 block mb-1 text-[11px]">
                  Customer Contact
                </span>
                <p className="font-semibold text-neutral-900">{selectedOrder.customerName}</p>
                <p className="text-neutral-600">{selectedOrder.customerEmail}</p>
                <p className="text-neutral-600">{selectedOrder.customerPhone || selectedOrder.shippingAddress.phone}</p>
              </div>

              <div className="p-4 bg-white border border-neutral-200 rounded-xs space-y-1">
                <span className="font-semibold uppercase tracking-wider text-neutral-500 block mb-1 text-[11px]">
                  Dispatch Delivery Address
                </span>
                <p className="font-semibold text-neutral-900">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-neutral-600">{selectedOrder.shippingAddress.address}</p>
                <p className="text-neutral-600">
                  {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.pincode}
                </p>
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                Ordered Merchandise ({selectedOrder.items.length} items)
              </h3>
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xs">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded-xs border border-neutral-200"
                      />
                      <div>
                        <p className="font-semibold text-neutral-900">{item.name}</p>
                        <p className="text-neutral-500">
                          Price: ₹{item.price.toLocaleString('en-IN')} × {item.quantity} units
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-neutral-950 tabular-nums">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Total */}
            <div className="flex justify-between items-center pt-2 border-t border-neutral-200 text-sm font-bold text-neutral-950">
              <span>Total Payment Due (Cash on Delivery):</span>
              <span className="text-base tabular-nums">
                ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Close Button */}
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
