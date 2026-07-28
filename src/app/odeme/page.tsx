"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export default function OdemePage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    if (stored.length === 0) router.push("/sepet");
    setCart(stored);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleCheckout() {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setLoading(false);
      alert("Ödeme başlatılamadı.");
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Ödeme</h1>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Sipariş Özeti</h2>
          <div className="flex flex-col gap-3">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between text-sm text-gray-600">
                <span>{item.name} x{item.quantity}</span>
                <span>₺{(item.price * item.quantity).toLocaleString("tr-TR")}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
              <span>Toplam</span>
              <span>₺{total.toLocaleString("tr-TR")}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium text-lg hover:bg-gray-700 transition disabled:opacity-50"
        >
          {loading ? "Yönlendiriliyor..." : "Stripe ile Güvenli Öde"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Ödemeniz Stripe altyapısıyla güvenli şekilde işlenir.
        </p>
      </div>
    </main>
  );
}