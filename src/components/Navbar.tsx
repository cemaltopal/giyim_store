"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: "#2E86C1" }}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          StyleStore
        </Link>

        {/* Masaüstü menü */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/urunler" className="text-blue-100 hover:text-white">Ürünler</Link>
          <Link href="/urunler?category=kadin" className="text-blue-100 hover:text-white">Kadın</Link>
          <Link href="/urunler?category=erkek" className="text-blue-100 hover:text-white">Erkek</Link>
          <Link href="/sepet" className="text-blue-100 hover:text-white">🛒 Sepet</Link>
          {session ? (
            <>
              <Link href="/hesabim" className="text-blue-100 hover:text-white">Hesabım</Link>
              {(session.user as any)?.role === "admin" && (
                <Link href="/admin" className="text-blue-100 hover:text-white">Admin</Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-red-300 hover:text-red-100"
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link href="/giris" className="text-blue-100 hover:text-white">Giriş</Link>
              <Link href="/kayit" className="px-4 py-2 rounded-lg font-medium text-white" style={{ backgroundColor: "#E63946" }}>
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
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobil menü */}
      {menuOpen && (
        <div className="md:hidden border-t border-blue-400 px-4 py-4 flex flex-col gap-4 text-sm font-medium" style={{ backgroundColor: "#2E86C1" }}>
          <Link href="/urunler" onClick={() => setMenuOpen(false)} className="text-blue-100 hover:text-white">Ürünler</Link>
          <Link href="/urunler?category=kadin" onClick={() => setMenuOpen(false)} className="text-blue-100 hover:text-white">Kadın</Link>
          <Link href="/urunler?category=erkek" onClick={() => setMenuOpen(false)} className="text-blue-100 hover:text-white">Erkek</Link>
          <Link href="/sepet" onClick={() => setMenuOpen(false)} className="text-blue-100 hover:text-white">🛒 Sepet</Link>
          {session ? (
            <>
              <Link href="/hesabim" onClick={() => setMenuOpen(false)} className="text-blue-100 hover:text-white">Hesabım</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-red-300 text-left">
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link href="/giris" onClick={() => setMenuOpen(false)} className="text-blue-100 hover:text-white">Giriş</Link>
              <Link href="/kayit" onClick={() => setMenuOpen(false)} className="text-blue-100 hover:text-white">Kayıt Ol</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}