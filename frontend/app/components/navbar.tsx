import { Hammer } from 'lucide-react';
import { cookies } from "next/headers";
import Link from 'next/link';
import LogoutButton from '../components/logout';
export default async function Navbar(){
const cookieStore = await cookies();
const token = cookieStore.get("access_token")?.value;

const [bidsRes, auctionsRes] = await Promise.all([
  fetch('http://localhost:3000/bids/my-bids', {
    headers: { Authorization: `Bearer ${token || ''}` },
    credentials: 'include',
    cache: 'no-store'
  }).catch(() => ({ ok: false }) as Response),

  fetch('http://localhost:3000/auctions/my-auctions', {
    headers: { Authorization: `Bearer ${token || ''}` },
    credentials: 'include',
    cache: 'no-store'
  }).catch(() => ({ ok: false }) as Response)
]);

const bids = bidsRes.ok ? await bidsRes.json() : [];
const auctions = auctionsRes.ok ? await auctionsRes.json() : [];
    return(
        <>
        {/* Navbar */}
            <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-md z-50 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href='/' className="flex items-center gap-3 ">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <Hammer className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">BidSphere</h1>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/auctions" className="hover:text-indigo-400 transition">Auctions</Link>
                    <Link href="/my-auctions" className="hover:text-indigo-400 transition">My Auctions <span className='bg-red-600 w-full text-sm rounded-4xl px-1.5 py-0.5 font-bold'>{auctions.length}</span></Link>
                    <Link href="/my-bids" className="hover:text-indigo-400 transition">My Bids <span className='bg-red-600 w-full text-sm rounded-4xl px-1.5 py-0.5 font-bold'>{bids.length}</span></Link>
                    <Link href="/how-it-works" className="hover:text-indigo-400 transition">How it Works</Link>
                </div>

                <div className="flex items-center gap-4">
                    {token ? (
                        <div className="flex items-center gap-4">
                            <Link href="/profile" className="px-5 py-2.5 rounded-full border border-slate-700 hover:border-slate-500 transition">
                                Profile
                            </Link>
                        <LogoutButton/>
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/login" className="px-5 py-2.5 rounded-full border border-slate-700 hover:border-slate-500 transition">
                                Login
                            </Link>
                            <Link href="/auth/signup" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-full font-medium transition">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
                </div>
            </nav>
        </>
    )
}