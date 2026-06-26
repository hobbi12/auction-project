// 'use client';

import { cookies } from "next/headers";
import { Trophy, Clock, Edit3, Users, Eye, Trash } from "lucide-react";
import Link from "next/link";
import Countdown from "../components/countDown";
import DeleteButton from "../components/deleteButton";
import SearchBar from "../components/searchBar";

interface MyAuction {
  id: number;
  startingPrice: string;
  currentPrice: string;
  startsAt: string;
  endsAt: string;
  status: string;
  product: {
    id: number;
    title: string;
    imageUrl: string | null;
    category: string;
    slug?: string;
  };
}

export default async function MyAuctions() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

let auctions: MyAuction[] = [];
let errorMessage = '';

try {
  const res = await fetch('http://localhost:3000/auctions/my-auctions', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
    cache: 'no-store'
  });

  if (res.status === 401 || res.status === 403) {
    errorMessage = 'Please log in to view your auctions';
  } else if (!res.ok) {
    errorMessage = 'Failed to load your auctions';
  } else {
    auctions = await res.json();
  }
} catch (error) {
  console.error('Failed to fetch my auctions:', error);
  errorMessage = 'Connection error. Please try again later.';
}
  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16">
        <SearchBar token={token}/>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">My Auctions</h1>
            <p className="text-slate-400 mt-3 text-lg">Manage the auctions you created</p>
          </div>
          <div className="text-slate-400 text-sm">
            {auctions.length} Auctions
          </div>
        </div>
    {errorMessage ? (
            <div className="text-center py-32">
            <div className="text-6xl mb-6">🔒</div>
            <h3 className="text-3xl font-semibold text-slate-300 mb-4">Login Required</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">{errorMessage}</p>
            
            <Link 
                href="/auth/login"
                className="inline-block bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-2xl font-semibold text-lg"
            >
                Login to Continue
            </Link>
            </div>
      ) : auctions.length > 0 ?(
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {auctions.map((auction) => {
              const isActive = auction.status === 'active';
              const isEnded = auction.status === 'finished' || auction.status === 'cancelled';

              return (
                <div
                  key={auction.id}
                  className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden hover:border-indigo-500 transition-all hover:-translate-y-1"
                >
                  <div className="relative h-56">
                    <img
                      src={auction.product.imageUrl || '/placeholder.jpg'}
                      alt={auction.product.title}
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute top-4 right-4">
                      {isActive ? (
                        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                          <Clock size={16} /> <Countdown endsAt={auction.endsAt}/>
                        </div>
                      ) : (
                        <div className="bg-slate-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                          {auction.status}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="uppercase text-xs tracking-widest text-indigo-400 mb-2">
                      {auction.product.category}
                    </div>

                    <h3 className="text-xl font-semibold leading-tight mb-5 line-clamp-2">
                      {auction.product.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-xs text-slate-400">Starting Price</p>
                        <p className="text-2xl font-bold text-white">
                          ${parseFloat(auction.startingPrice).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Current Price</p>
                        <p className="text-2xl font-bold text-emerald-400">
                          ${parseFloat(auction.currentPrice).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={16} />
                        Ends {new Date(auction.endsAt).toLocaleDateString()}
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/auctions/${auction.product.slug}`}
                          className="border border-slate-600 hover:bg-slate-800 px-5 py-3 rounded-2xl text-sm font-medium transition flex items-center gap-2"
                        >
                          <Eye size={18} />
                          View
                        </Link>

                        {isActive && (
                            <DeleteButton 
                            auctionId={auction.id} 
                            token={token} 
                            // onDeleted={() => window.location.reload()}   // أو refresh الـ list
                            />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="text-7xl mb-6">🏷️</div>
            <h3 className="text-3xl font-semibold text-slate-300 mb-3">No auctions yet</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              You haven't created any auctions. Start selling now!
            </p>
            <Link
              href="/newAuction"
              className="inline-block mt-8 bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-semibold"
            >
              Create Your First Auction
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}