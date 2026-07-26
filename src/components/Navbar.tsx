"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          StyleStore
        </Link>

        {/* Masaüstü menü */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/urunler" className="hover:text-gray-900">Ürünler</Link>
          <Link href="/urunler?category=kadin" className="hover:text-gray-900">Kadın</Link>
          <Link href="/urunler?category=erkek" className="hover:text-gray-900">Erkek</Link>
          <Link href="/sepet" className="hover:text-gray-900">🛒 Sepet</Link>
          {session ? (
            <>
              <Link href="/hesabim" className="hover:text-gray-900">Hesabım</Link>
              {(session.user as any)?.role === "admin" && (
                <Link href="/admin" className="hover:text-gray-900">Admin</Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-red-500 hover:underline"
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link href="/giris" className="hover:text-gray-900">Giriş</Link>
              <Link href="/kayit" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobil menü */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4 text-sm font-medium text-gray-600">
          <Link href="/urunler" onClick={() => setMenuOpen(false)}>Ürünler</Link>
          <Link href="/urunler?category=kadin" onClick={() => setMenuOpen(false)}>Kadın</Link>
          <Link href="/urunler?category=erkek" onClick={() => setMenuOpen(false)}>Erkek</Link>
          <Link href="/sepet" onClick={() => setMenuOpen(false)}>🛒 Sepet</Link>
          {session ? (
            <>
              <Link href="/hesabim" onClick={() => setMenuOpen(false)}>Hesabım</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-red-500 text-left">
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link href="/giris" onClick={() => setMenuOpen(false)}>Giriş</Link>
              <Link href="/kayit" onClick={() => setMenuOpen(false)}>Kayıt Ol</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}