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

    const [totalUsers, totalAdmins, totalBanned, totalAudits, totalSessions] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "admin" } }),
        prisma.user.count({ where: { banned: true } }),
        prisma.auditRun.count(),
        prisma.session.count(),
      ]);

    return NextResponse.json({
      telemetry: {
        totalUsers,
        totalAdmins,
        totalBanned,
        totalAudits,
        totalSessions,
        dbStatus: "CONNECTED",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load telemetry" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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

    const body = await req.json();
    const { action } = body;

    if (action === "purge-sessions") {
      const now = new Date();
      const deleted = await prisma.session.deleteMany({
        where: { expiresAt: { lt: now } },
      });
      return NextResponse.json({
        success: true,
        message: `Pruned ${deleted.count} expired sessions from PostgreSQL ledger.`,
        purgedCount: deleted.count,
      });
    }

    if (action === "export-users") {
      const allUsers = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          banned: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { audits: true, sessions: true },
          },
        },
      });
      return NextResponse.json({
        success: true,
        users: allUsers,
      });
    }

    return NextResponse.json(
      { error: "Unknown administrative operation requested." },
      { status: 400 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Operation failed" },
      { status: 500 }
    );
  }
}
