"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton(){
    const router=useRouter();
    const handleLogout = async () => {
        try {
          const res = await fetch('http://localhost:3000/auth/logout',{
            method: 'POST',
            credentials: 'include',
          });

          const data = await res.json();
          if(!res.ok){
            console.error('Logout failed:', data.message);
            return;
          }
          router.push('/auth/login');
          router.refresh(); // Refresh لتحديث الـ auth state
          console.log('Logout response:', data); // Debug log
        } catch (error) {
          console.error('Logout error:', error);
        }
    } 
    return(
        <>
            <button className="px-5 py-2.5 rounded-full border border-slate-700 hover:border-slate-500 transition hover:bg-red-600"
            onClick={handleLogout}
            >
              Logout
            </button>
        </>
    )
}