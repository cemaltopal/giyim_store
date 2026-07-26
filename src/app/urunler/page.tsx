"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
}

export default function UrunlerPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  async function fetchProducts() {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.append("category", selectedCategory);
    if (search) params.append("search", search);

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Ürünler</h1>

        {/* Filtreler */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
            className="flex-1 p-3 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 border rounded-lg text-sm text-gray-700"
          >
            <option value="">Tüm Kategoriler</option>
            <option value="kadin">Kadın</option>
            <option value="erkek">Erkek</option>
            <option value="aksesuar">Aksesuar</option>
            <option value="spor">Spor</option>
          </select>
          <button
            onClick={() => { setSearch(""); setSelectedCategory(""); }}
            className="px-4 py-3 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Temizle
          </button>
        </div>

        {/* Ürün Listesi */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Ürün bulunamadı.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/urunler/${product.id}`}>
                <div className="group cursor-pointer">
                  <div className="bg-gray-100 rounded-xl overflow-hidden mb-3 aspect-square">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        Fotoğraf yok
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-800 text-sm">{product.name}</h3>
                  <p className="text-gray-500 text-sm">₺{product.price.toLocaleString("tr-TR")}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}