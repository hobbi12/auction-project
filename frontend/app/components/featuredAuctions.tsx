// "use client";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import Countdown from "./countDown";

interface AuctionItem {
  id: number;
  product: {
    id: number;
    title: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    startingPrice: string;
    category: string;
    isActive: boolean;
  };
  startingPrice: string;
  currentPrice: string;
  startsAt: string;
  endsAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default async function FeaturedAuctions() {
  let visibleAuctions: AuctionItem[] = [];
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  try {
    const res = await fetch('http://localhost:3000/auctions', {
      method: 'GET',
      cache: 'no-store',
      next: { revalidate: 0 },
      headers:{
        Authorization: `Bearer ${token}`,
        }
    });
    if (res.ok) {
      const data = await res.json();
       visibleAuctions=data.slice(0,4)
       console.log('Featured Auctions fetched:', visibleAuctions);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">Live Auctions</h2>
            <p className="text-slate-400 mt-2">Bid on exclusive items right now</p>
          </div>
          <Link href="/auctions" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 font-medium transition">
            View All Auctions <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleAuctions.length > 0 ? (
            visibleAuctions.map((auction) => (
              <div
                key={auction.id}
                className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-52 bg-slate-800 overflow-hidden">
                  <img
                    src={auction.product.imageUrl || "/placeholder.jpg"}
                    alt={auction.product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 text-emerald-400">
                    <Clock size={15} />
                    <Countdown endsAt={auction.endsAt} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-xs uppercase tracking-widest text-indigo-400 mb-1">
                    {auction.product.category}
                  </div>

                  <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-3 group-hover:text-indigo-400 transition">
                    {auction.product.title}
                  </h3>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-400">Current Bid</p>
                      <p className="text-2xl font-bold text-emerald-400">
                        ${parseFloat(auction.currentPrice).toLocaleString()}
                      </p>
                    </div>

                    <Link href={`/auctions/${auction.product.slug}`} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-2xl text-sm font-medium transition active:scale-95">
                      Bid Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-slate-400 text-lg">No live auctions at the moment</p>
              <p className="text-slate-500 mt-2">Check back soon for new items</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
