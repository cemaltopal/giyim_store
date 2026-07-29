"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export default function SepetPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  function updateQuantity(index: number, delta: number) {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function removeItem(index: number) {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: "#EBF5FB" }}>
        <p className="text-lg" style={{ color: "#2E86C1" }}>Sepetiniz boş.</p>
        <Link
          href="/urunler"
          className="px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition"
          style={{ backgroundColor: "#2E86C1" }}
        >
          Alışverişe Başla
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#EBF5FB" }}>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8" style={{ color: "#1A6090" }}>Sepetim</h1>

        <div className="flex flex-col gap-4 mb-8">
          {cart.map((item, index) => (
            <div key={index} className="flex gap-4 rounded-xl p-4 items-center shadow-sm" style={{ backgroundColor: "white" }}>
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: "#AED6F1" }}>
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "#2E86C1" }}>
                    Foto yok
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-medium" style={{ color: "#1A6090" }}>{item.name}</h3>
                <p className="text-sm" style={{ color: "#5DADE2" }}>
                  {item.size && `Beden: ${item.size}`}
                  {item.size && item.color && " · "}
                  {item.color && `Renk: ${item.color}`}
                </p>
                <p className="font-bold mt-1" style={{ color: "#E63946" }}>
                  ₺{(item.price * item.quantity).toLocaleString("tr-TR")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(index, -1)}
                  className="w-8 h-8 border rounded-lg flex items-center justify-center hover:opacity-80 transition"
                  style={{ borderColor: "#2E86C1", color: "#2E86C1" }}
                >
                  −
                </button>
                <span className="w-6 text-center font-medium" style={{ color: "#1A6090" }}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(index, 1)}
                  className="w-8 h-8 border rounded-lg flex items-center justify-center hover:opacity-80 transition"
                  style={{ borderColor: "#2E86C1", color: "#2E86C1" }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(index)}
                className="text-sm ml-2 hover:opacity-70 transition"
                style={{ color: "#E63946" }}
              >
                Sil
              </button>
            </div>
          ))}
        </div>

        {/* Toplam */}
        <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: "white" }}>
          <div className="flex justify-between items-center mb-4">
            <span style={{ color: "#1A6090" }}>Toplam</span>
            <span className="text-2xl font-bold" style={{ color: "#E63946" }}>
              ₺{total.toLocaleString("tr-TR")}
            </span>
          </div>
          <Link
            href="/odeme"
            className="block w-full py-4 rounded-xl font-medium text-center text-white hover:opacity-90 transition"
            style={{ backgroundColor: "#E63946" }}
          >
            Ödemeye Geç
          </Link>
        </div>
      </div>
    </main>
  );
}