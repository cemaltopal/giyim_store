"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  featured: boolean;
  images: string[];
}

export default function AdminClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "kadin",
    sizes: "",
    colors: "",
    stock: "",
    images: "",
    featured: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: "",
      price: String(product.price),
      category: product.category,
      sizes: "",
      colors: "",
      stock: String(product.stock),
      images: product.images[0] || "",
      featured: product.featured,
    });
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()) : [],
      colors: form.colors ? form.colors.split(",").map((c) => c.trim()) : [],
      stock: Number(form.stock),
      images: form.images ? [form.images] : [],
      featured: form.featured,
    };

    if (editingProduct) {
      await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setShowForm(false);
    setEditingProduct(null);
    setForm({
      name: "", description: "", price: "", category: "kadin",
      sizes: "", colors: "", stock: "", images: "", featured: false,
    });
    fetchProducts();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: "#2E86C1" }}>
  <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
    <Link href="/" className="text-xl font-bold text-white">StyleStore</Link>
    <div className="flex items-center gap-4">
      <span className="text-sm" style={{ color: "#D6EAF8" }}>Admin Paneli</span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm hover:underline"
        style={{ color: "#FFB3B3" }}
      >
        Çıkış Yap
      </button>
    </div>
  </div>
</nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Ürün Yönetimi</h1>
          <button
  onClick={() => { setShowForm(true); setEditingProduct(null); }}
  className="px-5 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition"
  style={{ backgroundColor: "#E63946" }}
>
  + Yeni Ürün
</button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="font-bold text-gray-800 mb-4">
              {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required placeholder="Ürün adı" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="p-3 border rounded-lg text-sm col-span-2" />
              <textarea placeholder="Açıklama" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="p-3 border rounded-lg text-sm col-span-2 resize-none" rows={3} />
              <input required placeholder="Fiyat (₺)" type="number" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="p-3 border rounded-lg text-sm" />
              <input required placeholder="Stok adedi" type="number" value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })}
                className="p-3 border rounded-lg text-sm" />
              <select value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="p-3 border rounded-lg text-sm">
                <option value="kadin">Kadın</option>
                <option value="erkek">Erkek</option>
                <option value="aksesuar">Aksesuar</option>
                <option value="spor">Spor</option>
              </select>
              <input placeholder="Bedenler (S, M, L, XL)" value={form.sizes}
                onChange={e => setForm({ ...form, sizes: e.target.value })}
                className="p-3 border rounded-lg text-sm" />
              <input placeholder="Renkler (Siyah, Beyaz, Kırmızı)" value={form.colors}
                onChange={e => setForm({ ...form, colors: e.target.value })}
                className="p-3 border rounded-lg text-sm" />
              <div className="col-span-2">
  <label className="block text-sm text-gray-600 mb-2">Fotoğraf</label>
  <div className="flex gap-3 items-center">
    <input
      type="file"
      accept="image/*"
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) setForm({ ...form, images: data.url });
      }}
      className="flex-1 p-3 border rounded-lg text-sm"
    />
    {form.images && (
      <img
        src={form.images}
        alt="Önizleme"
        className="w-16 h-16 object-cover rounded-lg border"
      />
    )}
  </div>
  {form.images && (
    <p className="text-xs text-green-600 mt-1">✓ Fotoğraf yüklendi</p>
  )}
</div>
              <label className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
                <input type="checkbox" checked={form.featured}
                  onChange={e => setForm({ ...form, featured: e.target.checked })} />
                Öne çıkan ürün
              </label>
              <div className="col-span-2 flex gap-3">
                <button type="submit"
  className="px-6 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition"
  style={{ backgroundColor: "#2E86C1" }}>
  {editingProduct ? "Güncelle" : "Ekle"}
</button>
<button type="button" onClick={() => setShowForm(false)}
  className="px-6 py-2 rounded-lg text-sm border hover:opacity-80 transition"
  style={{ borderColor: "#2E86C1", color: "#2E86C1" }}>
  İptal
</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Ürün</th>
                  <th className="px-4 py-3 text-left">Kategori</th>
                  <th className="px-4 py-3 text-left">Fiyat</th>
                  <th className="px-4 py-3 text-left">Stok</th>
                  <th className="px-4 py-3 text-left">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{product.category}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      ₺{product.price.toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"
                      }`}>
                        {product.stock > 0 ? `${product.stock} adet` : "Tükendi"}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:underline text-xs">Düzenle</button>
                      <button onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:underline text-xs">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
