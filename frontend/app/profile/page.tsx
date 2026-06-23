// 'use client';

import { cookies } from "next/headers";
import { User, Mail, Phone, Calendar, Shield } from "lucide-react";

export default async function Profile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  let user = null;

  try {
    const res = await fetch('http://localhost:3000/auth/get-profile', {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (res.ok) {
      user = await res.json();
      console.log('User profile fetched:', user);
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400">Access Denied</h1>
          <p className="text-slate-400 mt-4">Please login to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 pt-20 pb-12 mt-5">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-3xl flex items-center justify-center text-6xl shadow-xl">
            👤
          </div>

          <div className="flex-1">
            <h1 className="text-5xl font-bold tracking-tight">
              {user.name} 
            </h1>
            <p className="text-indigo-400 mt-2 text-xl">{user.email}</p>
            
            <div className="flex gap-4 mt-6">
              <div className="bg-slate-900 px-5 py-2 rounded-2xl text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                {user.role || 'Member'}
              </div>
              <div className="bg-slate-900 px-5 py-2 rounded-2xl text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {new Date(user.createdAt).getFullYear()}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <User className="text-indigo-400" /> Personal Information
            </h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-sm">Full Name</p>
                <p className="text-lg font-medium">{user.name} {user.lastName}</p>
              </div>
              
              <div>
                <p className="text-slate-400 text-sm">Email Address</p>
                <p className="text-lg font-medium">{user.email}</p>
              </div>

              {user.phone && (
                <div>
                  <p className="text-slate-400 text-sm">Phone Number</p>
                  <p className="text-lg font-medium">{user.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-700">
            <h2 className="text-xl font-semibold mb-6">Account Activity</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Member Since</span>
                <span className="font-medium">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Bids Placed</span>
                <span className="font-medium text-emerald-400">24</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Auctions Won</span>
                <span className="font-medium text-emerald-400">7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        {/* <div className="mt-10 flex justify-center">
          <button className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-semibold text-lg transition flex items-center gap-3">
            Edit Profile Information
          </button>
        </div> */}
      </div>
    </div>
  );
}