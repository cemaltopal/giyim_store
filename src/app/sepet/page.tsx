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
      <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-lg">Sepetiniz boş.</p>
        <Link href="/urunler" className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700">
          Alışverişe Başla
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Sepetim</h1>

        <div className="flex flex-col gap-4 mb-8">
          {cart.map((item, index) => (
            <div key={index} className="flex gap-4 bg-gray-50 rounded-xl p-4 items-center">
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Foto yok
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  {item.size && `Beden: ${item.size}`}
                  {item.size && item.color && " · "}
                  {item.color && `Renk: ${item.color}`}
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  ₺{(item.price * item.quantity).toLocaleString("tr-TR")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(index, -1)}
                  className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-6 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(index, 1)}
                  className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(index)}
                className="text-red-400 hover:text-red-600 text-sm ml-2"
              >
                Sil
              </button>
            </div>
          ))}
        </div>

        {/* Toplam */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Toplam</span>
            <span className="text-2xl font-bold text-gray-900">
              ₺{total.toLocaleString("tr-TR")}
            </span>
          </div>
          <Link
            href="/odeme"
            className="block w-full bg-gray-900 text-white py-4 rounded-xl font-medium text-center hover:bg-gray-700 transition"
          >
            Ödemeye Geç
          </Link>
        </div>
      </div>
    </main>
  );
}