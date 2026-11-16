"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  ArrowLeft,
  ChevronRight,
  RefreshCw,
  Mail,
  Calendar,
  FileText,
  UserCheck,
  UserX,
  Lock,
  MoreVertical,
  ExternalLink,
  Loader2,
  AlertCircle,
  Database,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: string | null;
  emailVerified: boolean;
  image: string | null;
  banned: boolean | null;
  banReason: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    audits: number;
    sessions: number;
  };
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const isAdmin = userRole === "admin";

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "USER" | "BANNED">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load users");
      }
      setUsers(data.users || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error retrieving user database");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionPending && isAdmin) {
      fetchUsers();
    }
  }, [sessionPending, isAdmin]);

  const handleToggleRole = async (targetUser: UserListItem) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    if (
      !confirm(
        `Are you sure you want to change ${targetUser.name}'s role from ${targetUser.role || "user"} to ${newRole.toUpperCase()}?`
      )
    ) {
      return;
    }

    setUpdatingUserId(targetUser.id);
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
        );
      } else {
        const data = await res.json();
        alert(`Failed to update role: ${data.error}`);
      }
    } catch {
      alert("Error updating role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleToggleBan = async (targetUser: UserListItem) => {
    const newBanned = !targetUser.banned;
    const action = newBanned ? "BAN" : "UNBAN";
    if (!confirm(`Are you sure you want to ${action} user ${targetUser.email}?`)) {
      return;
    }

    setUpdatingUserId(targetUser.id);
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          banned: newBanned,
          banReason: newBanned ? "Administrative restriction" : null,
        }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, banned: newBanned } : u))
        );
      } else {
        const data = await res.json();
        alert(`Failed to update ban status: ${data.error}`);
      }
    } catch {
      alert("Error updating ban status");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter === "ADMIN" && u.role !== "admin") return false;
    if (roleFilter === "USER" && u.role === "admin") return false;
    if (roleFilter === "BANNED" && !u.banned) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q)
    );
  });

  // Calculate statistics
  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const standardCount = users.filter((u) => u.role !== "admin").length;
  const bannedCount = users.filter((u) => u.banned).length;

  if (sessionPending) {
    return (
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-20 text-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#19c7e8]" />
        <p className="text-xs text-muted-foreground font-mono">
          Verifying administrative credentials...
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
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            The User Management Registry is exclusively accessible by designated Chief Integrity Officers with Admin credentials.
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
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#d1d5db]/70 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer border-border/60 hover:bg-muted"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portal</span>
          </Button>

          <div className="h-4 w-px bg-border/60 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[3px] bg-[#19c7e8]/10 border border-[#19c7e8]/30 flex items-center justify-center text-[#19c7e8]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                <span>User Registry & Access Matrix</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={isLoading}
            className="h-8 text-xs gap-1.5 cursor-pointer border-border/60 hover:bg-muted font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#19c7e8]" : ""}`} />
            <span>Sync Ledger</span>
          </Button>
        </div>
      </div>

      {/* Diagonal Hatched Divider */}
      <div
        aria-hidden="true"
        className="h-4 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
      />

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-card/60 backdrop-blur-sm space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
            Total Users
          </span>
          <div className="text-2xl font-bold font-mono text-foreground">{totalCount}</div>
          <span className="text-[11px] text-muted-foreground">Registered Accounts</span>
        </div>

        <div className="p-4 rounded-[4px] border border-[#19c7e8]/30 bg-[#19c7e8]/5 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#19c7e8] block">
            Administrators
          </span>
          <div className="text-2xl font-bold font-mono text-[#19c7e8]">{adminCount}</div>
          <span className="text-[11px] text-muted-foreground">Full Oversight Authority</span>
        </div>

        <div className="p-4 rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-card/60 backdrop-blur-sm space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
            Public Auditors
          </span>
          <div className="text-2xl font-bold font-mono text-foreground">{standardCount}</div>
          <span className="text-[11px] text-muted-foreground">Standard Auditor Accounts</span>
        </div>

        <div className="p-4 rounded-[4px] border border-destructive/30 bg-destructive/5 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-destructive block">
            Restricted
          </span>
          <div className="text-2xl font-bold font-mono text-destructive">{bannedCount}</div>
          <span className="text-[11px] text-muted-foreground">Banned or Suspended</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-3.5 sm:p-4 rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-card/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by name, email, or user ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs h-8.5 rounded-[3px] bg-background border-[#d1d5db] dark:border-white/15"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          {(["ALL", "ADMIN", "USER", "BANNED"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setRoleFilter(filter)}
              className={`px-3 py-1.5 rounded-[3px] border transition-colors cursor-pointer whitespace-nowrap ${
                roleFilter === filter
                  ? "border-[#19c7e8] bg-[#19c7e8]/10 text-[#19c7e8] font-bold"
                  : "border-[#d1d5db] dark:border-white/10 text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter === "ALL"
                ? `All (${totalCount})`
                : filter === "ADMIN"
                  ? `Admins (${adminCount})`
                  : filter === "USER"
                    ? `Users (${standardCount})`
                    : `Banned (${bannedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message Banner */}
      {error && (
        <Card className="p-4 border-destructive/40 bg-destructive/10 text-destructive text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers} className="text-xs">
            Retry
          </Button>
        </Card>
      )}

      {/* User Directory Table */}
      <div className="rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-card/80 overflow-hidden shadow-sm">
        {isLoading && users.length === 0 ? (
          <div className="py-20 text-center space-y-2 text-muted-foreground text-xs">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#19c7e8]" />
            <p className="font-mono">Loading user registry from PostgreSQL...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center space-y-2 text-muted-foreground text-xs">
            <Users className="w-8 h-8 mx-auto stroke-1 text-muted-foreground/40" />
            <p className="font-mono">No users matching search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-muted/40 border-b border-[#d1d5db] dark:border-white/10 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Verified</th>
                  <th className="py-3 px-4">Audits Executed</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d1d5db]/60 dark:divide-white/10">
                {filteredUsers.map((user) => {
                  const isCurrentAdmin = session?.user?.id === user.id;
                  const isBusy = updatingUserId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Name & Email */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary text-xs shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <Link
                                href={`/admin/users/${user.id}`}
                                className="font-semibold text-foreground hover:text-[#19c7e8] transition-colors truncate max-w-[180px]"
                              >
                                {user.name}
                              </Link>
                              {isCurrentAdmin && (
                                <span className="text-[9px] font-mono bg-primary/10 text-primary px-1 rounded">
                                  You
                                </span>
                              )}
                              {user.banned && (
                                <Badge variant="destructive" className="text-[9px] font-mono px-1 py-0">
                                  Banned
                                </Badge>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground font-mono block truncate max-w-[200px]">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
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
                      </td>

                      {/* Verification */}
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {user.emailVerified ? (
                          <span className="text-emerald-500 flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60 flex items-center gap-1">
                            <UserX className="w-3.5 h-3.5" />
                            <span>Unverified</span>
                          </span>
                        )}
                      </td>

                      {/* Audits Count */}
                      <td className="py-3 px-4 font-mono text-xs">
                        <span className="font-bold text-foreground">
                          {user._count?.audits || 0}
                        </span>
                        <span className="text-muted-foreground text-[11px] ml-1">audits</span>
                      </td>

                      {/* Created Date */}
                      <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/admin/users/${user.id}`}>
                            <Button
                              variant="outline"
                              size="xs"
                              className="h-7 text-xs gap-1 border-border/80 hover:bg-muted cursor-pointer font-mono"
                              title="View complete user dossier"
                            >
                              <span>Inspect</span>
                              <ChevronRight className="w-3 h-3" />
                            </Button>
                          </Link>

                          {!isCurrentAdmin && (
                            <Button
                              variant="outline"
                              size="xs"
                              disabled={isBusy}
                              onClick={() => handleToggleRole(user)}
                              className="h-7 text-[11px] font-mono border-border/80 hover:bg-muted cursor-pointer"
                              title={`Switch role to ${user.role === "admin" ? "user" : "admin"}`}
                            >
                              {user.role === "admin" ? "Demote" : "Promote"}
                            </Button>
                          )}

                          {!isCurrentAdmin && (
                            <Button
                              variant="outline"
                              size="xs"
                              disabled={isBusy}
                              onClick={() => handleToggleBan(user)}
                              className={`h-7 text-[11px] font-mono cursor-pointer ${
                                user.banned
                                  ? "text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                                  : "text-destructive border-destructive/30 hover:bg-destructive/10"
                              }`}
                              title={user.banned ? "Unban user" : "Ban user"}
                            >
                              {user.banned ? "Unban" : "Ban"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Diagonal Hatched Divider */}
      <div
        aria-hidden="true"
        className="h-4 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
      />
    </main>
  );
}
