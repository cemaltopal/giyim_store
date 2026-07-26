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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Giriş Yap</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            placeholder="Şifreniz"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition disabled:opacity-50"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Hesabın yok mu?{" "}
          <Link href="/kayit" className="text-blue-600 hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </main>
  );
}