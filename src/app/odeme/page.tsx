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
    <main className="min-h-screen" style={{ backgroundColor: "#EBF5FB" }}>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8" style={{ color: "#1A6090" }}>Ödeme</h1>

        <div className="rounded-xl p-6 mb-6 shadow-sm" style={{ backgroundColor: "white" }}>
          <h2 className="font-semibold mb-4" style={{ color: "#1A6090" }}>Sipariş Özeti</h2>
          <div className="flex flex-col gap-3">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between text-sm" style={{ color: "#5DADE2" }}>
                <span>{item.name} x{item.quantity}</span>
                <span style={{ color: "#1A6090" }}>₺{(item.price * item.quantity).toLocaleString("tr-TR")}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between font-bold" style={{ borderColor: "#AED6F1" }}>
              <span style={{ color: "#1A6090" }}>Toplam</span>
              <span style={{ color: "#E63946" }}>₺{total.toLocaleString("tr-TR")}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 rounded-xl font-medium text-lg text-white hover:opacity-90 transition disabled:opacity-50"
          style={{ backgroundColor: "#E63946" }}
        >
          {loading ? "Yönlendiriliyor..." : "Stripe ile Güvenli Öde"}
        </button>

        <p className="text-center text-xs mt-4" style={{ color: "#5DADE2" }}>
          Ödemeniz Stripe altyapısıyla güvenli şekilde işlenir.
        </p>
      </div>
    </main>
  );
}