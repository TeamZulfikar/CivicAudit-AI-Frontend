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

    // Allow both authenticated roles (admin and user) to view audit dossier
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication required to view audit dossier." },
        { status: 401 }
      );
    }

    const audit = await prisma.auditRun.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    return NextResponse.json({ audit });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load audit" },
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

    // Allow both authenticated roles (admin and user) to view audit dossier
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication required to view audit dossier." },
        { status: 401 }
      );
    }

    await prisma.auditRun.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Audit deleted" });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete audit" },
      { status: 500 }
    );
  }
}
