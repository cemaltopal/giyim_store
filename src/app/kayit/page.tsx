"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function KayitPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/giris");
    } else {
      setError(data.error || "Bir hata oluştu.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Kayıt Ol</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Adınız Soyadınız"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-3 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="email"
            placeholder="E-posta adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="password"
            placeholder="Şifreniz (min. 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="p-3 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition disabled:opacity-50"
          >
            {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Zaten hesabın var mı?{" "}
          <Link href="/giris" className="text-blue-600 hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </main>
  );
}