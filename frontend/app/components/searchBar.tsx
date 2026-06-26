'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';

interface AuctionItem {
  id: number;
  product: {
    id: number;
    title: string;
    slug: string;
    imageUrl: string | null;
    category: string;
  };
  currentPrice: string;
}
interface SearchProps {
  token?: string ;
}
export default function SearchBar({token}:SearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:3000/auctions');
        if (res.ok) {
          const data = await res.json();
          setAuctions(data);
        }
      } catch (error) {
        console.error("Error fetching auctions", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // Debounced + Memoized filtered results
  const filteredAuctions = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase().trim();

    return auctions
      .filter(auction => 
        auction.product.title.toLowerCase().includes(term) ||
        auction.product.category.toLowerCase().includes(term)
      )
      .slice(0, 8); // Limit results
  }, [searchTerm, auctions]);

  return (
    <div className="relative max-w-3xl mx-auto px-6 pt-8 pb-6">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={24} />
        </div>
        
        <input
          type="text"
          placeholder="Search cars, watches, real estate, electronics..."
          className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-3xl py-6 pl-16 pr-6 text-lg placeholder:text-slate-500 focus:outline-none transition-all duration-300 shadow-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Search Results Dropdown */}
      {searchTerm.trim() && (
        <div className="absolute mt-1 w-full bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-h-[420px] overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : filteredAuctions.length > 0 ? (
            <div className="p-2">
              {filteredAuctions.map((auction) => (
                <Link
                  key={auction.id}
                  href={`/auctions/${auction.product.slug || auction.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-slate-800 rounded-2xl transition group"
                >
                  <div className="w-14 h-14 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={auction.product.imageUrl || '/placeholder.jpg'} 
                      alt={auction.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-indigo-400 transition line-clamp-1">
                      {auction.product.title}
                    </h3>
                    <p className="text-sm text-slate-400">{auction.product.category}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-emerald-400">
                      ${parseFloat(auction.currentPrice).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-slate-400">No results found for "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {token?<div className="flex justify-center gap-4 mt-5">
        <Link 
          href="/newAuction"
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-semibold transition active:scale-95"
        >
          <Plus size={22} />
          Add New Auction
        </Link>

        <Link 
          href="/how-it-works"
          className="flex items-center gap-3 border border-slate-700 hover:bg-slate-900 px-8 py-4 rounded-2xl font-medium transition"
        >
          How Bidding Works
        </Link>
      </div>:null}
    </div>
  );
}