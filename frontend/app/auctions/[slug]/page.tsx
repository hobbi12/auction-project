import { cookies } from "next/headers";
import BidAction from "./bidAction";

export default async function AuctionDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
  let auctionDetails = null;
  try {
    const res = await fetch(`http://localhost:3000/auctions/slug/${slug}`, {
      method: 'GET',
      cache: 'no-store',
      next: { revalidate: 0 },
      headers:{
        Authorization: `Bearer ${token}`,
      }
    });

    console.log("Response status:", res.status);   // Debug

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error response:", errorText);
      throw new Error('Auction not found');
    }

    auctionDetails = await res.json();
    console.log("Auction found:", auctionDetails?.product?.title);
  } catch (error) {
    console.error('Error fetching auction:', error);
  }

  if (!auctionDetails) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-red-400 mb-4">Auction Not Found</h1>
          <p className="text-slate-400">Slug tried: <span className="text-red-400">{slug}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* الصورة */}
          <div className="lg:w-1/2">
            <img 
              src={auctionDetails.product.imageUrl || '/placeholder.jpg'} 
              alt={auctionDetails.product.title}
              className="w-full rounded-3xl shadow-2xl"
            />
          </div>

          {/* التفاصيل */}
          <div className="lg:w-1/2 space-y-8">
            <div>
              <div className="uppercase text-indigo-400 tracking-widest text-sm mb-2">
                {auctionDetails.product.category}
              </div>
              <h1 className="text-4xl font-bold leading-tight">
                {auctionDetails.product.title}
              </h1>
            </div>

            <div className="bg-slate-900 rounded-2xl p-8">
              <p className="text-sm text-slate-400 mb-1 font-bold">Starting Price :<span className="mx-2 text-sm font-bold text-emerald-400">${parseFloat(auctionDetails.startingPrice).toLocaleString()}</span></p>
              {/* <p className="">
                
              </p> */}
              <p className="text-sm text-slate-400 mb-1 font-bold">Current Highest Bid</p>
              <p className="text-5xl font-bold text-emerald-400">
                ${parseFloat(auctionDetails.currentPrice).toLocaleString()}
              </p>
            </div>

            <p className="text-slate-300 leading-relaxed text-lg">
              {auctionDetails.product.description}
            </p>

            <div className="pt-6 border-t border-slate-700">
              <BidAction token={token} currentPrice={parseFloat(auctionDetails.currentPrice)} auctionId={auctionDetails.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}