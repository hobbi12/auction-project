import {ArrowRight} from 'lucide-react';
import SearchBar from './components/searchBar';
import FeaturedAuctions from './components/featuredAuctions';
import CategoriesSection from './components/categoriesSection';
import Link from 'next/link';
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800 rounded-full px-4 py-1.5 mb-6">
            <span className="text-emerald-400">●</span>
            <span className="text-sm font-medium">Live Auctions Running Now</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            Bid. Win.<br />
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Own It.
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Discover unique items, place smart bids, and win incredible deals in our exciting auction marketplace.
          </p>
          {/* Search Bar */}
            <SearchBar token={token}/>

        </div>
      </section>
      {/* Stats */}
      <div className="bg-slate-900 py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-indigo-400">12,458</div>
            <div className="text-slate-400 mt-1">Active Auctions</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-emerald-400">87,392</div>
            <div className="text-slate-400 mt-1">Happy Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-amber-400">$24.8M</div>
            <div className="text-slate-400 mt-1">Items Sold</div>
          </div>
        </div>
      </div>

      {/* Featured Auctions */}
      <FeaturedAuctions/>
      {/*  */}

      {/* Categories */}
      <CategoriesSection/>

      <footer className="bg-black py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500">
          © 2026 BidSphere. All rights reserved.
        </div>
      </footer>
    </div>
  );
}