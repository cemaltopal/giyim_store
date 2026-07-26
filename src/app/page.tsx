import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Yeni Sezon Koleksiyonu</h1>
          <p className="text-gray-400 text-lg mb-8">
            En trend parçalar, en uygun fiyatlarla
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/urunler?category=kadin"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100"
            >
              Kadın
            </Link>
            <Link
              href="/urunler?category=erkek"
              className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900"
            >
              Erkek
            </Link>
          </div>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Kategoriler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Kadın", "Erkek", "Aksesuar", "Spor"].map((cat) => (
            <Link
              key={cat}
              href={`/urunler?category=${cat.toLowerCase()}`}
              className="bg-gray-100 rounded-xl py-8 text-center font-medium text-gray-700 hover:bg-gray-200 transition"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Öne Çıkan Ürünler */}
      {featuredProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Öne Çıkan Ürünler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/urunler/${product.id}`}>
                <div className="group">
                  <div className="bg-gray-100 rounded-xl overflow-hidden mb-3 aspect-square">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
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
        </section>
      )}
    </main>
  );
}