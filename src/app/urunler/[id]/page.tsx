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

  if (loading) return (
    <div className="text-center py-20" style={{ color: "#2E86C1" }}>Yükleniyor...</div>
  );
  if (!product) return (
    <div className="text-center py-20" style={{ color: "#2E86C1" }}>Ürün bulunamadı.</div>
  );

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#EBF5FB" }}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href="/urunler" className="text-sm hover:underline mb-6 inline-block" style={{ color: "#2E86C1" }}>
          ← Ürünlere Dön
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Fotoğraf */}
          <div className="rounded-xl overflow-hidden aspect-square" style={{ backgroundColor: "#AED6F1" }}>
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: "#2E86C1" }}>
                Fotoğraf yok
              </div>
            )}
          </div>

          {/* Detaylar */}
          <div>
            <p className="text-sm uppercase mb-2" style={{ color: "#5DADE2" }}>{product.category}</p>
            <h1 className="text-3xl font-bold mb-3" style={{ color: "#1A6090" }}>{product.name}</h1>
            <p className="text-2xl font-bold mb-6" style={{ color: "#E63946" }}>
              ₺{product.price.toLocaleString("tr-TR")}
            </p>
            <p className="mb-6" style={{ color: "#2E86C1" }}>{product.description}</p>

            {/* Beden Seçimi */}
            {product.sizes.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2" style={{ color: "#1A6090" }}>Beden</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="px-4 py-2 border rounded-lg text-sm font-medium transition"
                      style={{
                        backgroundColor: selectedSize === size ? "#2E86C1" : "white",
                        color: selectedSize === size ? "white" : "#1A6090",
                        borderColor: "#2E86C1",
                      }}
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
                <p className="text-sm font-medium mb-2" style={{ color: "#1A6090" }}>Renk</p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="px-4 py-2 border rounded-lg text-sm font-medium transition"
                      style={{
                        backgroundColor: selectedColor === color ? "#2E86C1" : "white",
                        color: selectedColor === color ? "white" : "#1A6090",
                        borderColor: "#2E86C1",
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stok */}
            <p className="text-sm mb-6" style={{ color: product.stock > 0 ? "#27AE60" : "#E63946" }}>
              {product.stock > 0 ? `${product.stock} adet stokta` : "Stokta yok"}
            </p>

            {/* Sepete Ekle */}
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className="w-full py-4 rounded-xl font-medium text-lg transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: added ? "#27AE60" : "#E63946", color: "white" }}
            >
              {added ? "✓ Sepete Eklendi!" : "Sepete Ekle"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}