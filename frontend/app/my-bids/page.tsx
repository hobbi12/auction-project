// 'use client';

import { cookies } from "next/headers";
import { Trophy, AlertCircle, Clock, Eye } from "lucide-react";
import Link from "next/link";
import BidAction from "../auctions/[slug]/bidAction";

interface Bid {
  id: number;
  amount: number;
  createdAt: string;
  auction: {
    id: number;
    currentPrice: number;
    endsAt: string;
    status: string;
    product: {
      id: number;
      title: string;
      imageUrl?: string;
      category: string;
      slug?: string;
    };
  };
}

export default async function MyBids() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  let bids: Bid[] = [];

  try {
    const res = await fetch('http://localhost:3000/bids/my-bids', {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
      cache: 'no-store'
    });

    if (res.ok) {
      bids = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch bids:', error);
  }

return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">My Bids</h1>
            <p className="text-slate-400 mt-3 text-lg">Track your bidding activity</p>
          </div>
          <div className="text-slate-400 text-sm">
            {bids.length} Products
          </div>
        </div>

        {bids.length > 0 ? (
          <div className="space-y-6">   {/* ← Changed to space-y instead of grid */}
            {bids.map((bid) => {
              const isWinning = bid.amount >= bid.auction.currentPrice;
              const isOutbid = bid.amount < bid.auction.currentPrice;

              return (
                <div
                  key={bid.id}
                  className={`bg-slate-900 border rounded-3xl overflow-hidden transition-all hover:-translate-y-1 flex flex-col md:flex-row ${
                    isWinning ? 'border-emerald-500/40' : 'border-red-500/30'
                  }`}
                >
                  {/* Image - Smaller */}
                  <div className="md:w-52 h-52 md:h-auto relative flex-shrink-0">
                    <img
                      src={bid.auction.product.imageUrl || '/placeholder.jpg'}
                      alt={bid.auction.product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 md:right-auto md:left-4">
                      {isWinning ? (
                        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                          <Trophy size={16} /> Winning
                        </div>
                      ) : (
                        <div className="bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                          <AlertCircle size={16} /> Outbid
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="uppercase text-xs tracking-widest text-indigo-400 mb-2">
                      {bid.auction.product.category}
                    </div>

                    <h3 className="text-2xl font-semibold leading-tight mb-4">
                      {bid.auction.product.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-8 mb-6">
                      <div>
                        <p className="text-xs text-slate-400">Your Last Bid</p>
                        <p className="text-3xl font-bold text-white">
                          ${bid.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Current Price</p>
                        <p className={`text-3xl font-bold ${isOutbid ? 'text-red-400' : 'text-emerald-400'}`}>
                          ${bid.auction.currentPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Clock size={18} />
                        Ends {new Date(bid.auction.endsAt).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric', year: 'numeric' 
                        })}
                      </div>

                      <div className="flex gap-3">
                        {/* {isOutbid && (
                          <BidAction 
                            token={token} 
                            currentPrice={bid.auction.currentPrice} 
                            auctionId={bid.auction.id}
                          />
                        )} */}

                        <Link 
                          href={`/auctions/${bid.auction.product.slug || bid.auction.id}`}
                          className="border border-slate-600 hover:bg-slate-800 px-6 py-3 rounded-2xl text-sm font-medium transition flex items-center gap-2"
                        >
                          <Eye size={18} />
                          View Auction
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-32">
            <div className="text-7xl mb-6">🏷️</div>
            <h3 className="text-3xl font-semibold text-slate-300 mb-3">No bids yet</h3>
            <p className="text-slate-400">Start bidding on interesting auctions!</p>
          </div>
        )}
      </div>
    </div>
  );
}