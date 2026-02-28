import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// ✅ DELETE product
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ MUST await

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }
}

// ✅ PUT update product
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ MUST await

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }
}

// ✅ GET single product (needed for edit page)
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  return NextResponse.json(product);
}
