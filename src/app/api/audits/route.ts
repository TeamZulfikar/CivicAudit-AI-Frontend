import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Allow both authenticated roles (admin and user)
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication required to access audit records." },
        { status: 401 }
      );
    }

    const audits = await prisma.auditRun.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        tenderId: true,
        title: true,
        procuringEntity: true,
        mode: true,
        status: true,
        sampleName: true,
        filename: true,
        totalQuoted: true,
        fairMarket: true,
        excessAmount: true,
        riskRating: true,
        findingsCount: true,
        anomaliesCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ audits });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch audits" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Allow both authenticated roles (admin and user) to persist audits
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication required to save audit records." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      id,
      tenderId,
      title,
      procuringEntity,
      mode,
      status,
      sampleName,
      filename,
      rawText,
      totalQuoted,
      fairMarket,
      excessAmount,
      riskRating,
      findingsCount,
      anomaliesCount,
      dossier,
      markdown,
      logs,
      error,
    } = body;

    if (id) {
      // Update existing audit run
      const updated = await prisma.auditRun.update({
        where: { id },
        data: {
          status: status || undefined,
          totalQuoted: totalQuoted !== undefined ? totalQuoted : undefined,
          fairMarket: fairMarket !== undefined ? fairMarket : undefined,
          excessAmount: excessAmount !== undefined ? excessAmount : undefined,
          riskRating: riskRating || undefined,
          findingsCount: findingsCount !== undefined ? findingsCount : undefined,
          anomaliesCount: anomaliesCount !== undefined ? anomaliesCount : undefined,
          dossier: dossier || undefined,
          markdown: markdown || undefined,
          logs: logs || undefined,
          error: error || undefined,
        },
      });
      return NextResponse.json({ success: true, audit: updated });
    }

    // Create new audit run
    const created = await prisma.auditRun.create({
      data: {
        tenderId: tenderId || "UNKNOWN",
        title: title || "Procurement Audit",
        procuringEntity: procuringEntity || "Public Procurement Authority",
        mode: mode || "sample",
        status: status || "in_progress",
        sampleName: sampleName || null,
        filename: filename || null,
        rawText: rawText || null,
        totalQuoted: totalQuoted || 0,
        fairMarket: fairMarket || 0,
        excessAmount: excessAmount || 0,
        riskRating: riskRating || "PENDING",
        findingsCount: findingsCount || 0,
        anomaliesCount: anomaliesCount || 0,
        dossier: dossier || null,
        markdown: markdown || null,
        logs: logs || [],
        error: error || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, audit: created });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to record audit" },
      { status: 500 }
    );
  }
}
