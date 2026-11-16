import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      },
    },
  },
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "e9a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcde",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
