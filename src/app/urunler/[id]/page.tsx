"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
}

export default function UrunDetayPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  function addToCart() {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = cart.findIndex(
      (item: any) => item.id === product.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || "",
        size: selectedSize,
        color: selectedColor,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Yükleniyor...</div>;
  if (!product) return <div className="text-center py-20 text-gray-400">Ürün bulunamadı.</div>;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href="/urunler" className="text-sm text-gray-500 hover:underline mb-6 inline-block">
          ← Ürünlere Dön
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Fotoğraf */}
          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Fotoğraf yok
              </div>
            )}
          </div>

          {/* Detaylar */}
          <div>
            <p className="text-sm text-gray-400 uppercase mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
            <p className="text-2xl font-semibold text-gray-900 mb-6">
              ₺{product.price.toLocaleString("tr-TR")}
            </p>
            <p className="text-gray-500 mb-6">{product.description}</p>

            {/* Beden Seçimi */}
            {product.sizes.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Beden</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${
                        selectedSize === size
                          ? "bg-gray-900 text-white border-gray-900"
                          : "text-gray-700 hover:border-gray-900"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Renk Seçimi */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Renk</p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${
                        selectedColor === color
                          ? "bg-gray-900 text-white border-gray-900"
                          : "text-gray-700 hover:border-gray-900"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stok */}
            <p className={`text-sm mb-6 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
              {product.stock > 0 ? `${product.stock} adet stokta` : "Stokta yok"}
            </p>

            {/* Sepete Ekle */}
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`w-full py-4 rounded-xl font-medium text-lg transition ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {added ? "✓ Sepete Eklendi!" : "Sepete Ekle"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}