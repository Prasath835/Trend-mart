import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { productAPI } from '../../services/api.ts';
import { Input } from '../../components/common/Input.tsx';
import { Button } from '../../components/common/Button.tsx';

const SAMPLE_IMAGE_PRESETS = [
  { label: 'Wireless Earbuds', url: '/src/assets/images/prod_earbuds_anc_1790607582633.jpg' },
  { label: 'Linen Shirt', url: '/src/assets/images/prod_linen_shirt_1790607594631.jpg' },
  { label: 'Leather Wallet', url: '/src/assets/images/prod_leather_wallet_1790607608773.jpg' },
  { label: 'Linen Cushion & Throw', url: '/src/assets/images/prod_linen_cushion_1790607622252.jpg' },
  { label: 'Heritage Leather Boots', url: '/src/assets/images/prod_leather_boots_1790607634763.jpg' },
  { label: 'Studio Headphones', url: '/src/assets/images/product_wireless_headphones_1790606677598.jpg' },
  { label: 'Titanium Smart Watch', url: '/src/assets/images/product_smart_watch_1790606690925.jpg' },
  { label: 'Laptop Backpack', url: '/src/assets/images/product_laptop_backpack_1790606707953.jpg' },
  { label: 'Aero Running Shoes', url: '/src/assets/images/product_running_shoes_1790606718588.jpg' },
  { label: 'Editorial Showcase', url: '/src/assets/images/hero_lifestyle_vibrant_1790607646067.jpg' },
];

export const AdminAddProduct: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stock: '15',
    description: '',
    image: SAMPLE_IMAGE_PRESETS[0].url,
    highlightBadge: 'New Arrival',
    featured: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Product name is required.';
    if (!formData.price.trim()) {
      errs.price = 'Price is required.';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errs.price = 'Please enter a valid positive price in INR.';
    }
    if (!formData.stock.trim()) {
      errs.stock = 'Stock inventory is required.';
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      errs.stock = 'Stock must be 0 or greater.';
    }
    if (!formData.description.trim()) {
      errs.description = 'A detailed product description is required.';
    }
    if (!formData.image.trim()) {
      errs.image = 'Product image path or URL is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMsg(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await productAPI.createProduct({
        name: formData.name.trim(),
        category: formData.category as any,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description.trim(),
        image: formData.image.trim(),
        highlightBadge: formData.highlightBadge.trim(),
        featured: formData.featured,
      });

      setSuccessMsg(`"${res.product.name}" has been successfully added to the catalogue!`);
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err: any) {
      setServerError(err.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="mb-2">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products Management</span>
        </Link>
      </div>

      <div className="pb-6 border-b border-stone-200">
        <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-slate-950">
          Add New Product
        </h1>
        <p className="text-xs uppercase tracking-wider text-slate-500 mt-1">
          Create and publish a new item into the Trend Mart inventory
        </p>
      </div>

      {serverError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-xs text-rose-800 rounded-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xs p-6 sm:p-8 space-y-6 shadow-2xs">
        <Input
          label="Product Title"
          required
          placeholder="e.g. Ergonomic Office Desk"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-600 mb-1.5 font-medium">
              Department Category <span className="text-slate-400">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xs text-slate-900 focus:outline-none focus:border-emerald-800 font-medium"
            >
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Accessories">Accessories</option>
              <option value="Home & Living">Home & Living</option>
              <option value="Footwear">Footwear</option>
            </select>
          </div>

          <div>
            <Input
              label="Price (INR ₹)"
              type="number"
              min="0"
              required
              placeholder="e.g. 2499"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={errors.price}
            />
          </div>

          <div>
            <Input
              label="Stock Inventory Units"
              type="number"
              min="0"
              required
              placeholder="e.g. 20"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              error={errors.stock}
            />
          </div>
        </div>

        <div>
          <Input
            label="Visual Highlight Badge (Optional)"
            placeholder="e.g. Bestseller, Editor Choice, Organic Cotton"
            value={formData.highlightBadge}
            onChange={(e) => setFormData({ ...formData, highlightBadge: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-600 mb-1.5 font-medium">
            Description <span className="text-slate-400">*</span>
          </label>
          <textarea
            rows={4}
            required
            placeholder="Detailed description of product materials, construction, design philosophy, and dimensions..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-3.5 py-2 text-sm bg-white border ${
              errors.description ? 'border-rose-400' : 'border-stone-300'
            } rounded-xs text-slate-900 focus:outline-none focus:border-emerald-800`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-rose-600">{errors.description}</p>
          )}
        </div>

        {/* Product Image Presets & Custom URL */}
        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wider text-slate-600 font-medium">
            Product Photography Presets <span className="text-slate-400">*</span>
          </label>

          {/* Quick preset selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {SAMPLE_IMAGE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setFormData({ ...formData, image: preset.url })}
                className={`p-2 border rounded-xs text-left transition-all cursor-pointer ${
                  formData.image === preset.url
                    ? 'border-emerald-800 bg-emerald-50/50 ring-1 ring-emerald-800'
                    : 'border-stone-200 hover:border-emerald-600'
                }`}
              >
                <div className="aspect-square bg-stone-100 rounded-xs overflow-hidden mb-1">
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] text-slate-700 block line-clamp-1 font-medium">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>

          <Input
            label="Or Custom Image URL / Path"
            placeholder="/src/assets/images/... or https://..."
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            error={errors.image}
          />
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 accent-emerald-800 cursor-pointer"
          />
          <label htmlFor="featured" className="text-xs font-semibold text-slate-800 cursor-pointer">
            Mark as Featured Essential on Homepage
          </label>
        </div>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
          <Link to="/admin/products">
            <Button type="button" variant="outline" size="md">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" size="md" isLoading={loading}>
            <span>Add Product to Store</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
