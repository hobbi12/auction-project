// app/how-it-works/page.tsx
import { ArrowRight, UserPlus, Search, Gavel, Trophy } from 'lucide-react';
import Link from 'next/link';
import { cookies } from "next/headers";

const steps = [
  {
    icon: <UserPlus className="w-10 h-10" />,
    title: "1. Create Account",
    desc: "Sign up in seconds and verify your email to start bidding or selling.",
    color: "indigo"
  },
  {
    icon: <Search className="w-10 h-10" />,
    title: "2. Browse Auctions",
    desc: "Explore thousands of unique items across different categories.",
    color: "emerald"
  },
  {
    icon: <Gavel className="w-10 h-10" />,
    title: "3. Place Your Bid",
    desc: "Bid smartly and compete with other bidders in real-time.",
    color: "amber"
  },
  {
    icon: <Trophy className="w-10 h-10" />,
    title: "4. Win & Pay",
    desc: "If you're the highest bidder when the auction ends, you win!",
    color: "violet"
  }
];

export default async function HowItWorks() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  
  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-6xl font-bold tracking-tight mb-6">
            How <span className="text-indigo-400">BidSphere</span> Works
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Simple, secure, and exciting. Buy and sell through live auctions in just a few steps.
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500 transition-all group"
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 bg-slate-800 text-${step.color}-400 group-hover:scale-110 transition-transform`}>
                {step.icon}
              </div>
              
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {step.desc}
              </p>

              <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-emerald-500 mt-10 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-slate-900 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose BidSphere?</h2>
            <p className="text-slate-400 text-lg">The smartest way to buy and sell online</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Secure Payments", desc: "All transactions are protected with bank-level security" },
              { title: "Real-time Bidding", desc: "Watch bids update instantly with live notifications" },
              { title: "Verified Sellers", desc: "All sellers are verified for your peace of mind" }
            ].map((benefit, i) => (
              <div key={i} className="bg-slate-800 p-8 rounded-3xl text-center">
                <div className="text-emerald-400 text-4xl mb-6">★</div>
                <h3 className="text-2xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-slate-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-gradient-to-br from-indigo-950 to-slate-950 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to start bidding?</h2>
        <p className="text-slate-400 mb-10 text-lg">Join thousands of users discovering amazing deals every day.</p>
        
        <div className="flex justify-center gap-4">
          {token?(null):
          <Link href="/signup" className="bg-white text-black px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-slate-200 transition">
            Create Free Account
          </Link>}

          <Link href="/auctions" className="border border-slate-600 hover:bg-slate-900 px-10 py-4 rounded-2xl font-semibold text-lg transition">
            Browse Auctions
          </Link>
        </div>
      </div>
    </div>
  );
}