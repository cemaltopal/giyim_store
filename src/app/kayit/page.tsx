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
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#EBF5FB" }}>
      <div className="rounded-xl shadow-sm p-8 w-full max-w-sm" style={{ backgroundColor: "white" }}>
        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: "#1A6090" }}>Kayıt Ol</h1>
        <p className="text-center text-sm mb-6" style={{ color: "#5DADE2" }}>StyleStore ailesine katıl!</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Adınız Soyadınız"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-3 border rounded-lg text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: "#AED6F1", color: "#1A6090" }}
          />
          <input
            type="email"
            placeholder="E-posta adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 border rounded-lg text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: "#AED6F1", color: "#1A6090" }}
          />
          <input
            type="password"
            placeholder="Şifreniz (min. 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="p-3 border rounded-lg text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: "#AED6F1", color: "#1A6090" }}
          />
          {error && <p className="text-sm text-center" style={{ color: "#E63946" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="py-3 rounded-lg font-medium text-white hover:opacity-90 transition disabled:opacity-50"
            style={{ backgroundColor: "#E63946" }}
          >
            {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
          </button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: "#5DADE2" }}>
          Zaten hesabın var mı?{" "}
          <Link href="/giris" className="font-medium hover:underline" style={{ color: "#2E86C1" }}>
            Giriş Yap
          </Link>
        </p>
      </div>
    </main>
  );
}