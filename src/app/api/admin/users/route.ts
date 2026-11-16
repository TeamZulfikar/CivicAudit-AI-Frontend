import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userRole = (session?.user as { role?: string } | undefined)?.role;
    if (!session || userRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden. Administrative privileges required." },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        image: true,
        banned: true,
        banReason: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            audits: true,
            sessions: true,
          },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to retrieve users" },
      { status: 500 }
    );
  }
}
