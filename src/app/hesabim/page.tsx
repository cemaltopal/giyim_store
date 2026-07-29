import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HesabimPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/giris");

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    include: {
      orders: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/giris");

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#EBF5FB" }}>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#1A6090" }}>Hesabım</h1>
        <p className="mb-8" style={{ color: "#5DADE2" }}>Hoş geldin, {user.name}!</p>

        {/* Kullanıcı Bilgileri */}
        <div className="rounded-xl shadow-sm p-6 mb-8" style={{ backgroundColor: "white" }}>
          <h2 className="font-semibold mb-4" style={{ color: "#1A6090" }}>Kişisel Bilgiler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p style={{ color: "#5DADE2" }}>Ad Soyad</p>
              <p className="font-medium" style={{ color: "#1A6090" }}>{user.name}</p>
            </div>
            <div>
              <p style={{ color: "#5DADE2" }}>E-posta</p>
              <p className="font-medium" style={{ color: "#1A6090" }}>{user.email}</p>
            </div>
          </div>
        </div>

        {/* Sipariş Geçmişi */}
        <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: "white" }}>
          <h2 className="font-semibold mb-4" style={{ color: "#1A6090" }}>Sipariş Geçmişi</h2>

          {user.orders.length === 0 ? (
            <div className="text-center py-10">
              <p className="mb-4" style={{ color: "#5DADE2" }}>Henüz siparişiniz yok.</p>
              <Link
                href="/urunler"
                className="px-6 py-2 rounded-lg text-sm text-white hover:opacity-90 transition"
                style={{ backgroundColor: "#2E86C1" }}
              >
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {user.orders.map((order) => (
                <div key={order.id} className="border rounded-xl p-4" style={{ borderColor: "#AED6F1" }}>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-xs" style={{ color: "#5DADE2" }}>
                        {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm font-medium" style={{ color: "#1A6090" }}>
                        Sipariş #{order.id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: "#EBF5FB", color: "#27AE60" }}>
                        {order.status === "paid" ? "Ödendi" : order.status}
                      </span>
                      <p className="text-sm font-bold mt-1" style={{ color: "#E63946" }}>
                        ₺{order.total.toLocaleString("tr-TR")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: "#AED6F1" }}>
                          {item.product.images[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "#2E86C1" }}>
                              Foto
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: "#1A6090" }}>{item.product.name}</p>
                          <p className="text-xs" style={{ color: "#5DADE2" }}>
                            {item.size && `Beden: ${item.size}`}
                            {item.size && item.color && " · "}
                            {item.color && `Renk: ${item.color}`}
                            {" · "}x{item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium" style={{ color: "#E63946" }}>
                          ₺{(item.price * item.quantity).toLocaleString("tr-TR")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}