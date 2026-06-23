'use client';
interface Category{
    id:number,
    name:string,
    description:string,
    imageUrl:string
}
interface NewAuctionClientProps {
  token: string | undefined;
}
import { useEffect, useState } from 'react';
import { ArrowLeft, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

  export default function NewAuction({token}:NewAuctionClientProps) {
  const [step, setStep] = useState<'product' | 'auction'>('product');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [productData, setProductData] = useState({
    title: '',
    description: '',
    category: '',
    startingPrice: '',
    imageUrl: '',
  });

  const [auctionData, setAuctionData] = useState({
    startsAt: '',
    endsAt: '',
  });

  const [createdProductId, setCreatedProductId] = useState<number | null>(null);
  const [msg,setMsg]=useState('')
  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:3000/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

    const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    console.log('Sending product data:', productData); // Debug

    try {
        const res = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        credentials: 'include',
        body: JSON.stringify(productData),
        });

        console.log('Response status:', res.status); // Debug
        if(!token)  return setMsg('You have to login')
        if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || `Failed to create product (${res.status})`);
        }

        const product = await res.json();
        console.log('✅ Product created:', product);

        setCreatedProductId(product.id);
        setStep('auction');
        setMessage({ type: 'success', text: 'Product created successfully!' });

    } catch (error: any) {
        console.error('Full error:', error);
        setMessage({ 
        type: 'error', 
        text: error.message || 'Something went wrong while creating product' 
        });
    } finally {
        setLoading(false);
    }
    };

    const handleAddNewAuction = async () => {
  if (!createdProductId) {
    setMessage({ type: 'error', text: 'Product not created yet. Please go back.' });
    return;
  }

  if (!auctionData.startsAt || !auctionData.endsAt) {
    setMessage({ type: 'error', text: 'Please select start and end dates' });
    return;
  }

  setLoading(true);
  setMessage(null);

  try {
    const res = await fetch('http://localhost:3000/auctions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      credentials: 'include',
      body: JSON.stringify({
        productId: createdProductId,
        startingPrice: parseFloat(productData.startingPrice),
        startsAt: auctionData.startsAt,
        endsAt: auctionData.endsAt,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to create auction');
    }

    setMessage({ type: 'success', text: 'Auction created successfully!' });

    // Redirect after success
    setTimeout(() => {
      window.location.href = '/auctions';
    }, 1200);

  } catch (error: any) {
    console.error(error);
    setMessage({ 
      type: 'error', 
      text: error.message || 'Failed to create auction' 
    });
  } finally {
    setLoading(false);
  }
    };
  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16">
        <div className="flex gap-8 mb-6 mt-5 mx-2">
          <div className={`flex-1 h-2 rounded-full ${step === 'product' ? 'bg-indigo-600' : 'bg-slate-700'}`} />
          <div className={`flex-1 h-2 rounded-full ${step === 'auction' ? 'bg-indigo-600' : 'bg-slate-700'}`} />
        </div>
        <div className="flex items-center gap-4 mb-10 mx-50 px-auto">
          <h1 className="text-4xl font-bold tracking-tight">Create New Auction</h1>
        </div>
      <div className="max-w-4xl mx-auto px-6">


        {/* Progress */}


        {step === 'product' ? (
          <form onSubmit={handleProductSubmit} className="space-y-8">
            <div className="bg-slate-900 rounded-3xl p-8">
              <h2 className="text-2xl font-semibold mb-8">Product Information</h2>

              {/* Image URL Input */}
              <div className="mb-8">
                <label className="block text-sm text-slate-400 mb-3">Product Image URL</label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={productData.imageUrl}
                    onChange={(e) => setProductData({ ...productData, imageUrl: e.target.value })}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => window.open(productData.imageUrl, '_blank')}
                    className="px-6 bg-slate-800 border border-slate-700 rounded-2xl hover:bg-slate-700 transition"
                  >
                    <LinkIcon size={24} />
                  </button>
                </div>
                {productData.imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={productData.imageUrl} 
                      alt="Preview" 
                      className="max-h-64 rounded-2xl border border-slate-700"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-400 mb-2">Product Title</label>
                  <input
                    type="text"
                    value={productData.title}
                    onChange={(e) => setProductData({ ...productData, title: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none"
                    placeholder="e.g. Toyota Camry 2022"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Category</label>
                  <select
                    value={productData.category}
                    onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(elem=>{
                        return <option key={elem.id} value={elem.name}>{elem.name}</option>
                    })}
                    {/* <option value="cars">Cars</option>
                    <option value="motorcycles">Motorcycles</option>
                    <option value="houses">Houses</option>
                    <option value="electronics">Electronics</option> */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Starting Price ($)</label>
                  <input
                    type="number"
                    value={productData.startingPrice}
                    onChange={(e) => setProductData({ ...productData, startingPrice: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none"
                    placeholder="25000"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-400 mb-2">Description</label>
                  <textarea
                    value={productData.description}
                    onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-3xl px-5 py-4 h-32 focus:border-indigo-500 outline-none resize-y"
                    placeholder="Describe your item in detail..."
                    required
                  />
                    {msg?<h3 className='text-red-600'>{msg}</h3>:null}

                </div>
              </div>
            </div>

            <button
            onClick={()=>handleProductSubmit}
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-2xl text-xl font-semibold transition"
            >
              {loading ? 'Creating Product...' : 'Continue to Auction Details →'}
            </button>
          </form>
        ) : (
          /* Step 2: Auction */
          <div className="bg-slate-900 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-8">Auction Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={auctionData.startsAt}
                  onChange={(e) => setAuctionData({ ...auctionData, startsAt: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={auctionData.endsAt}
                  onChange={(e) => setAuctionData({ ...auctionData, endsAt: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4"
                />
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button
                onClick={() => setStep('product')}
                className="flex-1 border border-slate-600 py-5 rounded-2xl font-semibold hover:bg-slate-800 transition"
              >
                Back
              </button>
                <button
                onClick={handleAddNewAuction}
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 py-5 rounded-2xl font-semibold transition flex items-center justify-center"
                >
                {loading ? 'Publishing Auction...' : 'Publish Auction'}
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}