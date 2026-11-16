import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const demoAccounts = [
      {
        email: "admin@civicaudit.local",
        password: "Admin123!@#",
        name: "Chief Integrity Officer",
        role: "admin",
      },
      {
        email: "user@civicaudit.local",
        password: "User123!@#",
        name: "Public Auditor Analyst",
        role: "user",
      },
    ];

    const results = [];

    for (const acc of demoAccounts) {
      const existingUser = await prisma.user.findUnique({
        where: { email: acc.email },
      });

      if (!existingUser) {
        try {
          const created = await auth.api.signUpEmail({
            body: {
              email: acc.email,
              password: acc.password,
              name: acc.name,
            },
          });
          // Update role directly to ensure it matches
          if (created && created.user) {
            await prisma.user.update({
              where: { id: created.user.id },
              data: { role: acc.role, emailVerified: true },
            });
          }
          results.push({ email: acc.email, status: "created", role: acc.role });
        } catch (e: unknown) {
          results.push({ email: acc.email, status: "error", error: e instanceof Error ? e.message : String(e) });
        }
      } else {
        // Ensure role and emailVerified are correct
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: acc.role, emailVerified: true },
        });
        results.push({ email: acc.email, status: "already_exists_updated", role: acc.role });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Demo seed accounts initialized successfully",
      accounts: results,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to seed accounts",
      },
      { status: 500 }
    );
  }
}
