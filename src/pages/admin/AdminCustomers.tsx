import React, { useEffect, useState } from 'react';
import { Users, Search, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { User } from '../../types/index.ts';
import { adminAPI } from '../../services/api.ts';
import { LoadingState } from '../../components/common/LoadingState.tsx';
import { EmptyState } from '../../components/common/EmptyState.tsx';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Array<User & { ordersCount?: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getCustomers();
      setCustomers(res.customers);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve registered customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-200">
        <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-neutral-950">
          Registered Customers Directory
        </h1>
        <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
          Review customer profiles, delivery addresses, and cumulative order counts
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-neutral-200 rounded-xs p-4 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search customer by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
          />
        </div>
        <span className="text-xs text-neutral-500 hidden sm:inline">
          {filteredCustomers.length} registered customer{filteredCustomers.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState message="Loading registered customers..." />
      ) : error ? (
        <EmptyState
          icon={Users}
          title="Error Loading Customers"
          description={error}
          actionText="Retry"
          onAction={fetchCustomers}
        />
      ) : filteredCustomers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Customers Match Search"
          description="Try adjusting your query term."
          actionText="Clear Search"
          onAction={() => setSearch('')}
        />
      ) : (
        <div className="bg-white border border-neutral-200/90 rounded-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf9f6] border-b border-neutral-200 text-neutral-600 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Customer ID</th>
                  <th className="px-5 py-3 font-semibold">Name & Contact</th>
                  <th className="px-5 py-3 font-semibold">Default Address</th>
                  <th className="px-5 py-3 font-semibold">Registration Date</th>
                  <th className="px-5 py-3 font-semibold text-right">Orders Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredCustomers.map((customer) => {
                  const regDate = new Date(customer.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={customer._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-[11px] text-neutral-600">
                        {customer._id}
                      </td>

                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-neutral-900">{customer.name}</p>
                        <div className="flex items-center gap-2 text-neutral-500 text-[11px] mt-0.5">
                          <span>{customer.email}</span>
                          <span aria-hidden="true">·</span>
                          <span>{customer.phone}</span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-neutral-600 max-w-xs truncate">
                        {customer.address || <span className="text-neutral-400 italic">None saved</span>}
                      </td>

                      <td className="px-5 py-3.5 text-neutral-600">
                        {regDate}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <span className="inline-flex items-center gap-1 font-semibold text-neutral-900 tabular-nums">
                          <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{customer.ordersCount ?? 0}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
