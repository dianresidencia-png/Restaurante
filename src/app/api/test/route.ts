import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; 

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const usersCount = await prisma.user.count();

    return NextResponse.json({
      success: true,
      message: "Todo funciona correctamente",
      database: "Conectado",
      usersCount,
      hasSession: !!session,
      userRole: session?.user?.role || "No autenticado",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
