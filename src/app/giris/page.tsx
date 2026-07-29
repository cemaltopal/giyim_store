"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("E-posta veya şifre hatalı.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#EBF5FB" }}>
      <div className="rounded-xl shadow-sm p-8 w-full max-w-sm" style={{ backgroundColor: "white" }}>
        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: "#1A6090" }}>Giriş Yap</h1>
        <p className="text-center text-sm mb-6" style={{ color: "#5DADE2" }}>StyleStore'a hoş geldin!</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            placeholder="Şifreniz"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 border rounded-lg text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: "#AED6F1", color: "#1A6090" }}
          />
          {error && <p className="text-sm text-center" style={{ color: "#E63946" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="py-3 rounded-lg font-medium text-white hover:opacity-90 transition disabled:opacity-50"
            style={{ backgroundColor: "#2E86C1" }}
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: "#5DADE2" }}>
          Hesabın yok mu?{" "}
          <Link href="/kayit" className="font-medium hover:underline" style={{ color: "#E63946" }}>
            Kayıt Ol
          </Link>
        </p>
      </div>
    </main>
  );
}