'use client';

import { useState } from "react";
import { X, Hammer, LogIn } from "lucide-react";
import Link from "next/link";

interface BidActionProps {
  token?: string;
  currentPrice: number;
  auctionId: number;
}

export default function BidAction({ token, currentPrice, auctionId }: BidActionProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(currentPrice + 100);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleBidSubmit = async () => {
    if (!token) {
      setMessage({ type: 'error', text: 'You must be logged in to place a bid' });
      return;
    }

    if (bidAmount <= currentPrice) {
      setMessage({ type: 'error', text: `Bid must be higher than $${currentPrice}` });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('http://localhost:3000/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          auctionId,
          amount: bidAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Failed to place bid' });
        return;
      }

      setMessage({ type: 'success', text: 'Bid placed successfully!' });
      setTimeout(() => setOpenDialog(false), 1500); // Close dialog after success

    } catch (error) {
      setMessage({ type: 'error', text: 'Connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
if (!token) {
    return (
      <Link
        href="/auth/login"
        className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 py-5 rounded-2xl text-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 group"
      >
        <LogIn className="w-6 h-6 group-hover:scale-110 transition" />
        Login to Place Bid
      </Link>
    );
  }
  return (
    <>
      <button
      disabled
        onClick={() => setOpenDialog(true)}
        className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 py-5 rounded-2xl text-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
      >
        <Hammer className="w-6 h-6" />
        Place Your Bid
      </button>

      {/* Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-700 px-6 py-5">
              <h2 className="text-2xl font-bold">Place Your Bid</h2>
              <button 
                onClick={() => setOpenDialog(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Current Highest Bid</p>
                <p className="text-3xl font-bold text-emerald-400">
                  ${currentPrice.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Your Bid Amount</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-600 focus:border-indigo-500 rounded-2xl pl-9 pr-5 py-4 text-2xl font-semibold outline-none transition"
                    min={currentPrice + 1}
                  />
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-2xl text-sm ${
                  message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                                             : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}>
                  {message.text}
                </div>
              )}

              <button
                onClick={handleBidSubmit}
                disabled={loading || bidAmount <= currentPrice}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed py-4 rounded-2xl font-semibold text-lg transition-all active:scale-[0.985]"
              >
                {loading ? 'Placing Bid...' : `Confirm Bid - $${bidAmount}`}
              </button>

              <p className="text-center text-xs text-slate-500">
                Bids are final and cannot be withdrawn
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}