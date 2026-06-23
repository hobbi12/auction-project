'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Hammer, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const router = useRouter();
  const [msg,setMsg] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSignup = async() => {
    try{
    const res=await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(formData)
    })
    const data=await res.json();
    if (!res.ok) {
      setMsg(data.message || 'Signup failed');
      return;
    }
    router.replace('/');
    router.refresh(); // Refresh the page to update authentication state
  }catch{
      setMsg('An error occurred during signup');
  };
  };
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <Hammer className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">BidSphere</h1>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-10 border border-slate-800">
          <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
          <p className="text-slate-400 text-center mb-8">Join the best bidding marketplace</p>

          <form className="space-y-6">
            {/* <div className="grid grid-cols-2 gap-4"> */}
              {/* <div>
                <label className="block text-sm text-slate-400 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="Ahmed"
                />
              </div> */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="Mohammed"
                />
              </div>
            {/* </div> */}

            <div>
              <label className="block text-sm text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="Create strong password"
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

            <button
              onClick={handleSignup}
              // type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-semibold text-lg transition mt-4"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-slate-400 mt-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}