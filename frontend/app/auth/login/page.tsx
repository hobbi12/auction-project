'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Hammer, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await res.json();
      console.log('Login response:', data); // Debug log

      if (!res.ok) {
        setMsg(data.message || 'Invalid email or password');
        return;
      }
      router.push('/');
      router.refresh(); // Refresh لتحديث الـ auth state

    } catch (error) {
      setMsg('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <Hammer className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">BidSphere</h1>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-10 border border-slate-800">
          <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-slate-400 text-center mb-8">Sign in to continue bidding</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 transition"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {msg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl text-center">
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 py-4 rounded-2xl font-semibold text-lg transition mt-4 flex items-center justify-center"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-8">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}