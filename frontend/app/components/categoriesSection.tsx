// app/components/CategoriesSection.tsx
import { cookies } from "next/headers";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

export default async function CategoriesSection() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  let categories: Category[] = [];

  try {
    const res = await fetch('http://localhost:3000/categories', {
      method: 'GET',
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      categories = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  // أيقونات افتراضية لكل تصنيف (يمكنك تغييرها)
  const categoryIcons: Record<string, string> = {
    cars: '🚗',
    motorcycles: '🏍️',
    houses: '🏠',
    electronics: '📱',
    watches: '⌚',
    fashion: '👕',
    collectibles: '🎨',
  };

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold tracking-tight mb-4">Shop by Category</h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            Discover thousands of unique items across different categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="group bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-5xl mb-6 transition-transform group-hover:scale-110">
                  {categoryIcons[category.name.toLowerCase()] || '📦'}
                </div>

                <h3 className="text-2xl font-semibold mb-3 group-hover:text-indigo-400 transition">
                  {category.name}
                </h3>

                {category.description && (
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {category.description}
                  </p>
                )}

                <Link href={`/${category.name}`} className="mt-auto pt-6 text-xs uppercase tracking-widest text-indigo-400 font-medium">
                  Explore →
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-slate-400 text-xl">No categories available at the moment</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}