import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { items } = await request.json();

  const lineItems = items.map((item: any) => ({
    price_data: {
      currency: "try",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/odeme/basarili?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/sepet`,
    metadata: {
      userId: (session?.user as any)?.id || "",
      items: JSON.stringify(items.map((i: any) => ({
        id: i.id,
        quantity: i.quantity,
        price: i.price,
        size: i.size || "",
        color: i.color || "",
      }))),
    },
  });

  return NextResponse.json({ url: stripeSession.url });
}