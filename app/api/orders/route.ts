import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // adjust path if needed

// 🔹 GET: Fetch orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let orders;

    if (session.user.isAdmin) {
      // 🔥 ADMIN → Fetch ALL orders
      orders = await prisma.order.findMany({
        include: {
          items: true,
          user: true, // optional if you want user info
        },
        orderBy: { createdAt: "desc" },
        
      });
    } else {
      // 👤 NORMAL USER → Fetch only their orders
      orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}


// 🔹 POST: Create order
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
