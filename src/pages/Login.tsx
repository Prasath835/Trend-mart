import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { Input } from '../components/common/Input.tsx';
import { Button } from '../components/common/Button.tsx';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if we came from a redirect query
  const queryParams = new URLSearchParams(location.search);
  const redirectTarget = queryParams.get('redirect') || (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirectTarget === '/login' ? '/products' : redirectTarget);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role: 'customer' | 'admin') => {
    if (role === 'customer') {
      setEmail('customer@trendmart.com');
      setPassword('Customer@123');
    } else {
      setEmail('admin@trendmart.com');
      setPassword('Admin@123');
    }
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20">
      <div className="bg-white border border-neutral-200/90 rounded-xs p-8 sm:p-10 shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
            Customer Portal
          </span>
          <h1 className="text-2xl font-serif-display font-bold text-neutral-950">
            Sign In to Trend Mart
          </h1>
          <p className="text-xs text-neutral-500">
            Access your orders, saved addresses, and active shopping bag.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-800 rounded-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            autoComplete="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full mt-2"
          >
            <span>Sign In</span>
          </Button>
        </form>

        {/* Demo Credentials Fast-Access for reviewers */}
        <div className="pt-4 border-t border-neutral-100">
          <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium text-center mb-2.5">
            Quick Fill Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('customer')}
              className="px-2.5 py-1.5 text-xs border border-neutral-200 hover:border-neutral-900 rounded-xs text-neutral-700 hover:text-neutral-950 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Demo Customer</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="px-2.5 py-1.5 text-xs border border-neutral-200 hover:border-neutral-900 rounded-xs text-neutral-700 hover:text-neutral-950 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <div className="text-center pt-2 text-xs text-neutral-500">
          <span>Don&apos;t have an account? </span>
          <Link to="/register" className="font-semibold text-neutral-900 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
