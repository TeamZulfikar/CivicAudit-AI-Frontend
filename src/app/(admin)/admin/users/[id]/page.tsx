"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Calendar,
  Clock,
  Laptop,
  Key,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  UserX,
  UserCheck,
  Database,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

interface UserSessionItem {
  id: string;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: string;
  createdAt: string;
}

interface UserAccountItem {
  id: string;
  providerId: string;
  accountId: string;
  createdAt: string;
}

interface UserAuditItem {
  id: string;
  tenderId: string;
  title: string;
  procuringEntity: string;
  mode: string;
  status: string;
  totalQuoted: number | null;
  fairMarket: number | null;
  excessAmount: number | null;
  riskRating: string | null;
  findingsCount: number | null;
  anomaliesCount: number | null;
  createdAt: string;
}

interface FullUserDetails {
  id: string;
  name: string;
  email: string;
  role: string | null;
  emailVerified: boolean;
  image: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
  createdAt: string;
  updatedAt: string;
  sessions: UserSessionItem[];
  accounts: UserAccountItem[];
  audits: UserAuditItem[];
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const { data: currentSession, isPending: sessionPending } = authClient.useSession();
  const currentUserRole = (currentSession?.user as { role?: string } | undefined)?.role;
  const isAdmin = currentUserRole === "admin";
  const isCurrentAdmin = currentSession?.user?.id === userId;

  const [user, setUser] = useState<FullUserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [isActionBusy, setIsActionBusy] = useState(false);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load user details");
      }
      setUser(data.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error retrieving user record");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionPending && isAdmin && userId) {
      fetchUserDetails();
    }
  }, [sessionPending, isAdmin, userId]);

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleRoleToggle = async () => {
    if (!user) return;
    const newRole = user.role === "admin" ? "user" : "admin";
    if (
      !confirm(
        `Are you sure you want to change ${user.name}'s role from ${user.role || "user"} to ${newRole.toUpperCase()}?`
      )
    ) {
      return;
    }

    setIsActionBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUser((prev) => (prev ? { ...prev, role: newRole } : null));
      } else {
        const data = await res.json();
        alert(`Failed to update role: ${data.error}`);
      }
    } catch {
      alert("Error updating role");
    } finally {
      setIsActionBusy(false);
    }
  };

  const handleBanToggle = async () => {
    if (!user) return;
    const newBanned = !user.banned;
    let reason: string | null = null;
    if (newBanned) {
      const input = prompt("Enter administrative reason for ban (optional):", "Policy non-compliance");
      if (input === null) return;
      reason = input || "Administrative restriction";
    }

    setIsActionBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banned: newBanned, banReason: reason }),
      });
      if (res.ok) {
        setUser((prev) => (prev ? { ...prev, banned: newBanned, banReason: reason } : null));
      } else {
        const data = await res.json();
        alert(`Failed to update status: ${data.error}`);
      }
    } catch {
      alert("Error updating ban status");
    } finally {
      setIsActionBusy(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    if (
      !confirm(
        `CRITICAL ACTION: Are you sure you want to permanently delete user "${user.name}" (${user.email})? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsActionBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("User record deleted successfully.");
        router.push("/admin/users");
      } else {
        const data = await res.json();
        alert(`Deletion failed: ${data.error}`);
      }
    } catch {
      alert("Failed to delete user");
    } finally {
      setIsActionBusy(false);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (val?: number | null) => {
    if (val === null || val === undefined) return "$0";
    return "$" + Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  if (sessionPending) {
    return (
      <main className="max-w-7xl w-full mx-auto px-4 py-20 text-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#19c7e8]" />
        <p className="text-xs text-muted-foreground font-mono">
          Verifying administrative authorization...
        </p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="max-w-2xl w-full mx-auto px-4 py-20 font-sans">
        <Card className="p-8 border-destructive/40 bg-destructive/5 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto text-destructive">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Access Restricted</h2>
          <p className="text-xs text-muted-foreground">
            Administrative credentials are required to inspect user accounts.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portal</span>
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-6 font-sans">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#d1d5db]/70 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/users")}
            className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer border-border/60 hover:bg-muted font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>User Registry</span>
          </Button>

          <div className="h-4 w-px bg-border/60 hidden sm:block" />

          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span>User Dossier:</span>
              <span className="text-[#19c7e8] font-mono">{user?.name || userId}</span>
            </h1>

            {user?.banned && (
              <Badge variant="destructive" className="font-mono text-[10px]">
                Banned
              </Badge>
            )}
          </div>
        </div>

        {/* Top Administrative Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {!isCurrentAdmin && user && (
            <Button
              variant="outline"
              size="sm"
              disabled={isActionBusy}
              onClick={handleRoleToggle}
              className="h-8 text-xs font-mono border-border/80 hover:bg-muted cursor-pointer"
            >
              <span>{user.role === "admin" ? "Demote to User" : "Promote to Admin"}</span>
            </Button>
          )}

          {!isCurrentAdmin && user && (
            <Button
              variant="outline"
              size="sm"
              disabled={isActionBusy}
              onClick={handleBanToggle}
              className={`h-8 text-xs font-mono cursor-pointer ${
                user.banned
                  ? "text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                  : "text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
              }`}
            >
              <span>{user.banned ? "Unban Account" : "Ban Account"}</span>
            </Button>
          )}

          {!isCurrentAdmin && user && (
            <Button
              variant="outline"
              size="sm"
              disabled={isActionBusy}
              onClick={handleDeleteUser}
              className="h-8 text-xs gap-1 cursor-pointer text-destructive border-destructive/30 hover:bg-destructive/10 font-mono"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </Button>
          )}
        </div>
      </div>

      {/* Signature Diagonal Hatched Divider */}
      <div
        aria-hidden="true"
        className="h-4 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
      />

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#19c7e8]" />
          <p className="text-xs text-muted-foreground font-mono">
            Retrieving complete user profile, security sessions & audit ledger from PostgreSQL...
          </p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <Card className="p-4 border-destructive/40 bg-destructive/10 text-destructive text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUserDetails} className="text-xs">
            Retry
          </Button>
        </Card>
      )}

      {/* User Complete Data Dossier */}
      {!isLoading && user && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Main Profile Summary Card */}
          <Card className="p-4 sm:p-6 border-[#d1d5db] dark:border-white/10 bg-card/80 backdrop-blur-sm shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#19c7e8]/10 border border-[#19c7e8]/30 flex items-center justify-center text-[#19c7e8] font-bold font-mono text-xl shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className={`font-mono text-[10px] uppercase font-bold ${
                        user.role === "admin"
                          ? "bg-[#19c7e8] text-black border-transparent"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {user.role || "user"}
                    </Badge>
                    {isCurrentAdmin && (
                      <Badge variant="outline" className="font-mono text-[9px] bg-primary/10 text-primary border-primary/30">
                        Current Active Session
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{user.email}</span>
                  </p>

                  <div className="flex items-center gap-2 pt-0.5 text-[11px] font-mono text-muted-foreground">
                    <span>ID: {user.id}</span>
                    <button
                      type="button"
                      onClick={handleCopyUserId}
                      className="text-muted-foreground hover:text-foreground"
                      title="Copy user ID"
                    >
                      {copiedId ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Badges Grid */}
              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto text-xs font-mono">
                <div className="p-2.5 rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-background/60">
                  <span className="text-[10px] text-muted-foreground block">Email Verification</span>
                  <span className={user.emailVerified ? "text-emerald-500 font-semibold" : "text-amber-500 font-semibold"}>
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </span>
                </div>

                <div className="p-2.5 rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-background/60">
                  <span className="text-[10px] text-muted-foreground block">Account Status</span>
                  <span className={user.banned ? "text-destructive font-semibold" : "text-emerald-500 font-semibold"}>
                    {user.banned ? "Restricted / Banned" : "Active & In Good Standing"}
                  </span>
                </div>
              </div>
            </div>

            {user.banned && user.banReason && (
              <div className="mt-4 p-3 rounded-[3px] border border-destructive/30 bg-destructive/5 text-destructive text-xs flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Restriction Reason: {user.banReason}</span>
              </div>
            )}
          </Card>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3.5 rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-card/60 space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block">Audits Run</span>
              <div className="text-xl font-bold text-foreground">{user.audits.length}</div>
              <span className="text-[10px] text-muted-foreground">Historical Dockets</span>
            </div>

            <div className="p-3.5 rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-card/60 space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block">Active Sessions</span>
              <div className="text-xl font-bold text-[#19c7e8]">{user.sessions.length}</div>
              <span className="text-[10px] text-muted-foreground">Tokens in Store</span>
            </div>

            <div className="p-3.5 rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-card/60 space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block">Registered</span>
              <div className="text-xs font-semibold text-foreground truncate">{formatDate(user.createdAt)}</div>
              <span className="text-[10px] text-muted-foreground">Account Creation</span>
            </div>

            <div className="p-3.5 rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-card/60 space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block">Last Profile Update</span>
              <div className="text-xs font-semibold text-foreground truncate">{formatDate(user.updatedAt)}</div>
              <span className="text-[10px] text-muted-foreground">Database Timestamp</span>
            </div>
          </div>

          {/* SECTION 1: USER'S AUDIT HISTORY LEDGER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#19c7e8]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground font-mono">
                  Audit History Ledgers ({user.audits.length})
                </h3>
              </div>
            </div>

            <div className="rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-card/80 overflow-hidden shadow-sm">
              {user.audits.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground font-mono space-y-1">
                  <FileText className="w-6 h-6 mx-auto stroke-1 text-muted-foreground/40" />
                  <p>No audit dockets executed by this user yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[650px]">
                    <thead className="bg-muted/40 border-b border-[#d1d5db] dark:border-white/10 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="py-2.5 px-3.5">Docket Ref</th>
                        <th className="py-2.5 px-3.5">Title & Procuring Authority</th>
                        <th className="py-2.5 px-3.5 text-right">Quoted Budget</th>
                        <th className="py-2.5 px-3.5 text-right">Taxpayer Loss</th>
                        <th className="py-2.5 px-3.5 text-center">Risk Tier</th>
                        <th className="py-2.5 px-3.5 text-center">Status</th>
                        <th className="py-2.5 px-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d1d5db]/60 dark:divide-white/10 font-mono text-[11px]">
                      {user.audits.map((audit) => (
                        <tr key={audit.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3.5 font-bold text-[#19c7e8]">
                            #{audit.tenderId}
                          </td>
                          <td className="py-2.5 px-3.5 font-sans">
                            <span className="font-semibold text-foreground block line-clamp-1">
                              {audit.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {audit.procuringEntity} &bull; {formatDate(audit.createdAt)}
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-foreground font-semibold">
                            {formatCurrency(audit.totalQuoted)}
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-rose-500 font-semibold">
                            +{formatCurrency(audit.excessAmount)}
                          </td>
                          <td className="py-2.5 px-3.5 text-center">
                            {audit.riskRating && (
                              <Badge
                                variant={audit.riskRating.includes("CRITICAL") ? "destructive" : "outline"}
                                className="text-[9px] uppercase px-1 py-0 font-bold"
                              >
                                {audit.riskRating.replace("_RISK", "")}
                              </Badge>
                            )}
                          </td>
                          <td className="py-2.5 px-3.5 text-center">
                            <span
                              className={`inline-block size-2 rounded-full ${
                                audit.status === "completed"
                                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                                  : audit.status === "in_progress"
                                    ? "bg-blue-500 animate-pulse"
                                    : "bg-rose-500"
                              }`}
                              title={audit.status}
                            />
                          </td>
                          <td className="py-2.5 px-3.5 text-right">
                            <Link href={`/audit/${audit.id}`}>
                              <Button
                                variant="outline"
                                size="xs"
                                className="h-6 text-[10px] gap-1 border-border/80 hover:bg-muted cursor-pointer"
                              >
                                <span>Inspect</span>
                                <ExternalLink className="w-2.5 h-2.5 text-primary" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Diagonal Hatched Divider */}
          <div
            aria-hidden="true"
            className="h-4 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
          />

          {/* SECTION 2 & 3: SESSIONS & AUTHENTICATION ACCOUNTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Sessions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#19c7e8]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground font-mono">
                  Active Sessions ({user.sessions.length})
                </h3>
              </div>

              <div className="rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-card/80 p-3 space-y-2.5 shadow-sm font-mono text-xs">
                {user.sessions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-6 text-[11px]">No active sessions.</p>
                ) : (
                  user.sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-2.5 rounded-[3px] border border-border/50 bg-background/50 space-y-1 text-[11px]"
                    >
                      <div className="flex items-center justify-between text-foreground">
                        <span className="font-semibold text-[#19c7e8] truncate max-w-[200px]">
                          Token: {sess.token.substring(0, 16)}...
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(sess.createdAt)}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate font-sans">
                        Client: {sess.userAgent || "Standard Browser"}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
                        <span>IP: {sess.ipAddress || "Internal"}</span>
                        <span>Expires: {formatDate(sess.expiresAt)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Authentication Credentials / Providers */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#19c7e8]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground font-mono">
                  Authentication Providers ({user.accounts.length})
                </h3>
              </div>

              <div className="rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-card/80 p-3 space-y-2.5 shadow-sm font-mono text-xs">
                {user.accounts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-6 text-[11px]">No external accounts connected.</p>
                ) : (
                  user.accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="p-2.5 rounded-[3px] border border-border/50 bg-background/50 space-y-1 text-[11px]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground uppercase">
                          Provider: {acc.providerId}
                        </span>
                        <Badge variant="outline" className="text-[9px] font-mono">
                          Linked
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Account Identifier: {acc.accountId}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Connected: {formatDate(acc.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
