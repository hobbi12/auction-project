'use client';

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteButtonProps {
  auctionId: number;
  token?: string ;
}

export default function DeleteButton({ auctionId, token }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
    const router=useRouter()
  const handleDelete = async () => {
    // if (!confirm("Are you sure you want to delete this auction?")) return;

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3000/auctions/${auctionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to delete auction');
      }

    //   alert('Auction deleted successfully');
      router.refresh()
    //   onDeleted?.();   // Refresh the list

    } catch (error) {
      console.error(error);
      alert('Error deleting auction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 px-5 py-3 rounded-2xl text-sm font-medium transition"
    >
      <Trash2 size={18} />
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}