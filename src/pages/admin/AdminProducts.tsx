import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit3, Trash2, Package, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { productAPI } from '../../services/api.ts';
import { LoadingState } from '../../components/common/LoadingState.tsx';
import { Button } from '../../components/common/Button.tsx';
import { EmptyState } from '../../components/common/EmptyState.tsx';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Quick edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: 'Electronics',
    price: 0,
    stock: 0,
    description: '',
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productAPI.getProducts();
      setProducts(res.products);
    } catch (err: any) {
      setError(err.message || 'Failed to load products catalogue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the catalogue?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await productAPI.deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      setActionSuccess(`Product "${name}" was successfully removed.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await productAPI.updateProduct(editingProduct._id, {
        name: editForm.name,
        category: editForm.category as any,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
        description: editForm.description,
      });

      setProducts(prev =>
        prev.map(p => (p._id === editingProduct._id ? res.product : p))
      );
      setEditingProduct(null);
      setActionSuccess(`Updated "${res.product.name}" successfully.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update product details.');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-neutral-950">
            Product Inventory Management
          </h1>
          <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
            Maintain product catalog, pricing, inventory stock, and availability
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products/add">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Add New Product</span>
            </Button>
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200 rounded-xs p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
          <label className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
            Category:
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-white border border-neutral-300 rounded-xs px-3 py-1.5 text-neutral-900 focus:outline-none focus:border-neutral-900"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Accessories">Accessories</option>
            <option value="Home & Living">Home & Living</option>
            <option value="Footwear">Footwear</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      {loading ? (
        <LoadingState message="Loading catalog..." />
      ) : error ? (
        <EmptyState
          icon={Package}
          title="Error Loading Products"
          description={error}
          actionText="Retry"
          onAction={fetchProducts}
        />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Products Found"
          description="No products match your current search or category filter."
          actionText="Clear Filters"
          onAction={() => {
            setSearch('');
            setCategoryFilter('All');
          }}
        />
      ) : (
        <div className="bg-white border border-neutral-200/90 rounded-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf9f6] border-b border-neutral-200 text-neutral-600 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Stock</th>
                  <th className="px-5 py-3 font-semibold">Availability</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((product) => {
                  const isOutOfStock = product.stock <= 0;
                  const isLowStock = product.stock > 0 && product.stock <= 5;

                  return (
                    <tr key={product._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded-xs border border-neutral-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-neutral-900 line-clamp-1">{product.name}</p>
                            <p className="text-[11px] text-neutral-500 font-mono">SKU: {product._id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-neutral-600 font-medium">
                        {product.category}
                      </td>

                      <td className="px-5 py-3.5 font-semibold text-neutral-950 tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>

                      <td className="px-5 py-3.5 font-medium tabular-nums text-neutral-900">
                        {product.stock} units
                      </td>

                      <td className="px-5 py-3.5">
                        {isOutOfStock ? (
                          <span className="text-rose-700 font-medium">Out of Stock</span>
                        ) : isLowStock ? (
                          <span className="text-amber-800 font-medium">Low Stock</span>
                        ) : (
                          <span className="text-emerald-700 font-medium">In Stock</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleStartEdit(product)}
                          className="p-1.5 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
                          title="Quick Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          disabled={deletingId === product._id}
                          className="p-1.5 text-neutral-400 hover:text-rose-700 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-neutral-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <h2 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Edit Product: {editingProduct.name}
            </h2>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-600 uppercase tracking-wider mb-1 font-medium">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 uppercase tracking-wider mb-1 font-medium">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 uppercase tracking-wider mb-1 font-medium">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 uppercase tracking-wider mb-1 font-medium">
                  Stock Units
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editForm.stock}
                  onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-600 uppercase tracking-wider mb-1 font-medium">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
