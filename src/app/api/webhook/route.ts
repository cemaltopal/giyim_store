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

    if (itemsJson) {
      const items = JSON.parse(itemsJson);

      for (const item of items) {
        console.log("Stok düşürülüyor:", item.id, item.quantity);
        await prisma.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}