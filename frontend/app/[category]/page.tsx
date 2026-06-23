import Link from "next/link";
import Countdown from "../components/countDown";
import { Clock } from "lucide-react";
import SearchBar from "../components/searchBar";

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
export default async function CategoryAuctions({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  let auctions:AuctionItem[]=[]
    try{
        const res = await fetch(`http://localhost:3000/auctions/category/${category}`, {
        cache: 'no-store'
        });
        if(!res.ok){
            throw new Error('Error Response')
        }
        auctions = await res.json();
        console.log(auctions)
    }catch(error){
        console.error('Error fetching data')
    }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 p-5">
        <SearchBar/>
      <h1 className="text-5xl font-bold text-center mb-6 capitalize">
        {category} Auctions
      </h1>
      {/* Grid of auctions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {auctions.length > 0 ? (
            auctions.map((auction) => (
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
  );
}