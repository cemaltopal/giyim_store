import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook hatası" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const itemsJson = session.metadata?.items;
    const userId = session.metadata?.userId;

    if (itemsJson) {
      const items = JSON.parse(itemsJson);
      const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

      // Sipariş oluştur
      if (userId) {
        const order = await prisma.order.create({
          data: {
            userId,
            total,
            status: "paid",
            stripeId: session.id,
            items: {
              create: items.map((item: any) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
                size: item.size || null,
                color: item.color || null,
              })),
            },
          },
        });
        console.log("Sipariş oluşturuldu:", order.id);
      }

      // Stok düşür
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}