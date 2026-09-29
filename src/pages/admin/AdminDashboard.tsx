import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingCart, IndianRupee, Plus, ArrowRight, ExternalLink, Database } from 'lucide-react';
import { AdminStats } from '../../types/index.ts';
import { adminAPI } from '../../services/api.ts';
import { LoadingState } from '../../components/common/LoadingState.tsx';
import { Button } from '../../components/common/Button.tsx';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<(AdminStats & { isMongoConnected: boolean }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const data = await adminAPI.getStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch management metrics.');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <LoadingState message="Loading management dashboard..." />;
  }

  if (error || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-xs text-sm">
          Failed to load dashboard metrics: {error}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      path: '/admin/products',
      subtitle: 'Active catalog items',
    },
    {
      title: 'Registered Customers',
      value: stats.totalCustomers,
      icon: Users,
      path: '/admin/customers',
      subtitle: 'Verified accounts',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      path: '/admin/orders',
      subtitle: 'All-time orders placed',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      path: '/admin/orders',
      subtitle: 'Confirmed order volume',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Quick Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-neutral-950">
            Administrative Dashboard
          </h1>
          <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
            Store operations overview, catalog inventory, and fulfillment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products/add">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Add Product</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Database Connection Status Bar */}
      <div className="p-3.5 bg-white border border-neutral-200 rounded-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-neutral-700" />
          <span className="font-semibold text-neutral-900">Database Engine:</span>
          <span className="text-neutral-600">
            {stats.isMongoConnected ? 'MongoDB Atlas Cluster (Live Connected)' : 'MongoDB / Mongoose Schema Engine (Local Store Active)'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-neutral-400">REST API v1.0</span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.path}
              className="p-5 bg-white border border-neutral-200/90 rounded-xs hover:border-neutral-900 transition-colors group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
                  {card.title}
                </span>
                <Icon className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
              </div>
              <div className="my-3">
                <span className="text-2xl font-semibold text-neutral-950 tabular-nums">
                  {card.value}
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">{card.subtitle}</span>
            </Link>
          );
        })}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/products"
          className="p-5 bg-white border border-neutral-200 rounded-xs hover:border-neutral-400 transition-colors flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-neutral-900">Manage Catalog</p>
            <p className="text-xs text-neutral-500 mt-0.5">Edit inventory, prices, and stock counts</p>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-400" />
        </Link>

        <Link
          to="/admin/orders"
          className="p-5 bg-white border border-neutral-200 rounded-xs hover:border-neutral-400 transition-colors flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-neutral-900">Process Orders</p>
            <p className="text-xs text-neutral-500 mt-0.5">Update shipping & fulfillment statuses</p>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-400" />
        </Link>

        <Link
          to="/admin/customers"
          className="p-5 bg-white border border-neutral-200 rounded-xs hover:border-neutral-400 transition-colors flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-neutral-900">Customer Directory</p>
            <p className="text-xs text-neutral-500 mt-0.5">View registered customer accounts</p>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-400" />
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-neutral-200/90 rounded-xs overflow-hidden">
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-neutral-950">Recent Orders</h2>
            <p className="text-xs text-neutral-500">Most recent customer purchase transactions</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-neutral-900 hover:underline inline-flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            No orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf9f6] border-b border-neutral-200 text-neutral-600 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Order ID</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Items</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-semibold text-neutral-950">
                      {order._id}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-neutral-900">{order.customerName}</p>
                      <p className="text-neutral-500 text-[11px]">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-neutral-950 tabular-nums">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-neutral-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-neutral-900 hover:underline font-semibold"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
