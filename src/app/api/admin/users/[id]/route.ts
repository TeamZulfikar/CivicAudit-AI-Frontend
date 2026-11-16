import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const currentRole = (session?.user as { role?: string } | undefined)?.role;
    if (!session || currentRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden. Administrative privileges required." },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        image: true,
        banned: true,
        banReason: true,
        banExpires: true,
        createdAt: true,
        updatedAt: true,
        sessions: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            token: true,
            ipAddress: true,
            userAgent: true,
            expiresAt: true,
            createdAt: true,
          },
        },
        accounts: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            providerId: true,
            accountId: true,
            createdAt: true,
          },
        },
        audits: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            tenderId: true,
            title: true,
            procuringEntity: true,
            mode: true,
            status: true,
            totalQuoted: true,
            fairMarket: true,
            excessAmount: true,
            riskRating: true,
            findingsCount: true,
            anomaliesCount: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load user details" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const currentRole = (session?.user as { role?: string } | undefined)?.role;
    if (!session || currentRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden. Administrative privileges required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { role, banned, banReason, name, emailVerified } = body;

    const dataToUpdate: Record<string, unknown> = {};

    if (role !== undefined) {
      if (role !== "admin" && role !== "user") {
        return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
      }
      dataToUpdate.role = role;
    }

    if (banned !== undefined) {
      dataToUpdate.banned = Boolean(banned);
      dataToUpdate.banReason = banned ? (banReason || "Administrative restriction") : null;
    }

    if (name !== undefined && typeof name === "string") {
      dataToUpdate.name = name.trim();
    }

    if (emailVerified !== undefined) {
      dataToUpdate.emailVerified = Boolean(emailVerified);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        banned: true,
        banReason: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const currentRole = (session?.user as { role?: string } | undefined)?.role;
    const currentUserId = session?.user?.id;

    if (!session || currentRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden. Administrative privileges required." },
        { status: 403 }
      );
    }

    if (currentUserId === id) {
      return NextResponse.json(
        { error: "Action prohibited: You cannot delete your own administrative account." },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "User deleted successfully." });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete user" },
      { status: 500 }
    );
  }
}
