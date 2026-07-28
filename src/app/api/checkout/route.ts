import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { items } = await request.json();

  const lineItems = items.map((item: any) => ({
    price_data: {
      currency: "try",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
        metadata: {
          productId: item.id,
        },
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/odeme/basarili?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/sepet`,
    metadata: {
      items: JSON.stringify(items.map((i: any) => ({ id: i.id, quantity: i.quantity }))),
    },
  });

  return NextResponse.json({ url: session.url });
}