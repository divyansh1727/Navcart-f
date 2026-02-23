import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET all products
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const name = body.name?.trim();
    const price = parseFloat(body.price);

    // Validation
    if (!name || isNaN(price)) {
      return NextResponse.json(
        { error: "Valid name and price are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
      },
    });

    return NextResponse.json(product, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
