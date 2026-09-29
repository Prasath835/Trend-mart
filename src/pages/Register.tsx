import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { Input } from '../components/common/Input.tsx';
import { Button } from '../components/common/Button.tsx';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format.';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Contact phone number is required.';
    } else if (formData.phone.replace(/[^0-9+]/g, '').length < 8) {
      errs.phone = 'Please enter a valid phone number.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        address: formData.address.trim(),
      });

      // Check if user had a pending checkout address
      const pending = sessionStorage.getItem('pending_checkout_address');
      if (pending) {
        navigate('/checkout');
      } else {
        navigate('/products');
      }
    } catch (err: any) {
      setServerError(err.message || 'Registration failed. Please check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white border border-neutral-200/90 rounded-xs p-8 sm:p-10 shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
            New Account
          </span>
          <h1 className="text-2xl font-serif-display font-bold text-neutral-950">
            Create Your Trend Mart Account
          </h1>
          <p className="text-xs text-neutral-500">
            Enjoy seamless checkout, order tracking, and Cash on Delivery eligibility.
          </p>
        </div>

        {serverError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-800 rounded-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            placeholder="e.g. Priya Iyer"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              required
              autoComplete="email"
              placeholder="priya@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />

            <Input
              label="Phone Number"
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />
          </div>

          <Input
            label="Default Delivery Address (Optional)"
            placeholder="Flat/House, Street Name, Locality, City, Pincode"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            helperText="Can be edited anytime or during checkout"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full mt-4"
          >
            <span>Create Account</span>
          </Button>
        </form>

        {/* Switch to Login */}
        <div className="text-center pt-2 text-xs text-neutral-500 border-t border-neutral-100">
          <span>Already have an account? </span>
          <Link to="/login" className="font-semibold text-neutral-900 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
