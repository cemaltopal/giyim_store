"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function BasariliPage() {
  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4" style={{ backgroundColor: "#EBF5FB" }}>
      <div className="text-6xl">🎉</div>
      <h1 className="text-3xl font-bold" style={{ color: "#1A6090" }}>Ödeme Başarılı!</h1>
      <p className="text-center max-w-md" style={{ color: "#5DADE2" }}>
        Siparişiniz alındı. Kısa süre içinde kargo bilgileri e-posta adresinize gönderilecek.
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-xl font-medium text-white hover:opacity-90 transition"
        style={{ backgroundColor: "#2E86C1" }}
      >
        Ana Sayfaya Dön
      </Link>
    </main>
  );
}