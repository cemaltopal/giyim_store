export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#EBF5FB" }}>
      {/* Hero */}
      <section className="text-white py-20 px-4" style={{ backgroundColor: "#5DADE2" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Yeni Sezon Koleksiyonu</h1>
          <p className="text-blue-100 text-lg mb-8">
            En trend parçalar, en uygun fiyatlarla
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/urunler?category=kadin"
              className="px-8 py-3 rounded-lg font-medium text-white transition hover:opacity-90"
              style={{ backgroundColor: "#E63946" }}
            >
              Kadın
            </Link>
            <Link
              href="/urunler?category=erkek"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white transition"
              style={{ color: "white" }}
            >
              Erkek
            </Link>
          </div>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8" style={{ color: "#1A6090" }}>Kategoriler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Kadın", value: "kadin" },
            { label: "Erkek", value: "erkek" },
            { label: "Aksesuar", value: "aksesuar" },
            { label: "Spor", value: "spor" },
          ].map((cat) => (
            <Link
              key={cat.value}
              href={`/urunler?category=${cat.value}`}
              className="rounded-xl py-8 text-center font-medium transition hover:opacity-90"
              style={{ backgroundColor: "#2E86C1", color: "white" }}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Öne Çıkan Ürünler */}
      {featuredProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold mb-8" style={{ color: "#1A6090" }}>Öne Çıkan Ürünler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/urunler/${product.id}`}>
                <div className="group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition" style={{ backgroundColor: "white" }}>
                  <div className="overflow-hidden aspect-square" style={{ backgroundColor: "#AED6F1" }}>
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-sm">
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
        </section>
      )}
    </main>
  );
}