// app/auctions/page.tsx
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { cookies } from "next/headers";
import Countdown from "../components/countDown";
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

export default async function AllAuctions() {
  let auctions: AuctionItem[] = [];
//   const router=useRouter();
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    // console.log("Token in AllAuctions:", token);
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
      auctions = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch auctions:', error);
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-22 pb-4">
        <SearchBar/>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">All Auctions</h1>
            <p className="text-slate-400 mt-3 text-lg">
              Discover and bid on exclusive items
            </p>
          </div>
            {/* <Link href='/newAuction' className="px-8 py-4 bg-white text-black rounded-2xl font-semibold hover:bg-slate-200 transition flex items-center gap-2">
                Add New Auction
              <ArrowRight />
            </Link> */}
          <div className="text-slate-400">
            {auctions.length} Active Auctions
          </div>
        </div>

        {/* Auctions Grid */}
        {auctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {auctions.map((auction) => (
              <div
                key={auction.id}
                className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-56 bg-slate-800 overflow-hidden">
                  <img
                    src={auction.product.imageUrl || "/placeholder.jpg"}
                    alt={auction.product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 text-emerald-400">
                        <Clock size={15} />
                        <Countdown endsAt={auction.endsAt}/>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="uppercase text-xs tracking-widest text-indigo-400 mb-2">
                    {auction.product.category}
                  </div>

                  <h3 className="font-semibold text-xl leading-tight line-clamp-2 mb-4 group-hover:text-indigo-400 transition-colors">
                    {auction.product.title}
                  </h3>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-400">Current Bid</p>
                      <p className="text-3xl font-bold text-emerald-400">
                        ${parseFloat(auction.currentPrice).toLocaleString()}
                      </p>
                    </div>

                    <Link href={`/auctions/${auction.product.slug}`}
                        // onClick={() => router.push(`/auctions/${auction.id}`)}
                        className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-2xl text-sm font-medium transition active:scale-95 text-4xl">
                      More Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <p className="text-2xl text-slate-400">No auctions available right now</p>
            <p className="text-slate-500 mt-4">New items are added regularly</p>
          </div>
        )}
      </div>
    </div>
  );
}