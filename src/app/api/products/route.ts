import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const search = searchParams.get("search");

  const products = await prisma.product.findMany({
    where: {
      ...(category && { category }),
      ...(featured && { featured: true }),
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = await prisma.product.create({ data: body });
  return NextResponse.json(product, { status: 201 });
}