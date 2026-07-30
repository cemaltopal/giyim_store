export const dynamic = "force-dynamic";

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
    <main className="min-h-screen" style={{ backgroundColor: "#EBF5FB" }}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8" style={{ color: "#1A6090" }}>Ürünler</h1>

        {/* Filtreler */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
            className="flex-1 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: "#2E86C1", backgroundColor: "white", color: "#1A6090" }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 border rounded-lg text-sm"
            style={{ borderColor: "#2E86C1", backgroundColor: "white", color: "#1A6090" }}
          >
            <option value="">Tüm Kategoriler</option>
            <option value="kadin">Kadın</option>
            <option value="erkek">Erkek</option>
            <option value="aksesuar">Aksesuar</option>
            <option value="spor">Spor</option>
          </select>
          <button
            onClick={() => { setSearch(""); setSelectedCategory(""); }}
            className="px-4 py-3 border rounded-lg text-sm transition hover:opacity-80"
            style={{ borderColor: "#2E86C1", color: "#2E86C1", backgroundColor: "white" }}
          >
            Temizle
          </button>
        </div>

        {/* Ürün Listesi */}
        {loading ? (
          <div className="text-center py-20" style={{ color: "#2E86C1" }}>Yükleniyor...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20" style={{ color: "#2E86C1" }}>Ürün bulunamadı.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/urunler/${product.id}`}>
                <div className="group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition" style={{ backgroundColor: "white" }}>
                  <div className="overflow-hidden aspect-square" style={{ backgroundColor: "#AED6F1" }}>
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: "#2E86C1" }}>
                        Fotoğraf yok
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm" style={{ color: "#1A6090" }}>{product.name}</h3>
                    <p className="text-sm font-bold mt-1" style={{ color: "#E63946" }}>
                      ₺{product.price.toLocaleString("tr-TR")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}