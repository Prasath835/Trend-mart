import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Input } from '../../components/common/Input.tsx';
import { Button } from '../../components/common/Button.tsx';

export const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@trendmart.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide administrator email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== 'admin') {
        setError('Access denied. This account does not possess administrator credentials.');
        return;
      }
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center max-w-md mx-auto px-4 py-12">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Storefront</span>
        </Link>
      </div>

      <div className="bg-neutral-950 text-white rounded-xs p-8 sm:p-10 border border-neutral-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xs flex items-center justify-center mx-auto text-white">
            <KeyRound className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-serif-display font-bold tracking-tight text-white">
            Trend Mart Administration
          </h1>
          <p className="text-xs text-neutral-400">
            Sign in to access catalog, orders, and customer management
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
              Administrator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
              placeholder="admin@trendmart.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            isLoading={loading}
            className="w-full bg-white text-neutral-950 hover:bg-neutral-200 mt-2 font-semibold"
          >
            <span>Sign In to Admin</span>
          </Button>
        </form>

        <div className="p-3 bg-neutral-900/90 border border-neutral-800/80 rounded-xs text-[11px] text-neutral-400 space-y-1">
          <p className="font-semibold text-neutral-300">Default Evaluator Credentials:</p>
          <p>Email: <span className="text-white font-mono">admin@trendmart.com</span></p>
          <p>Password: <span className="text-white font-mono">Admin@123</span></p>
        </div>
      </div>
    </div>
  );
};
