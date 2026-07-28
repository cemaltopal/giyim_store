"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function BasariliPage() {
  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-6xl">🎉</div>
      <h1 className="text-3xl font-bold text-gray-800">Ödeme Başarılı!</h1>
      <p className="text-gray-500 text-center max-w-md">
        Siparişiniz alındı. Kısa süre içinde kargo bilgileri e-posta adresinize gönderilecek.
      </p>
      <Link
        href="/"
        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-700 transition"
      >
        Ana Sayfaya Dön
      </Link>
    </main>
  );
}