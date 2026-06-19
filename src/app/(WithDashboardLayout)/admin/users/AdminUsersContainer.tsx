"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateUserStatus, updateUserRole } from "@/services/user";
import { useState } from "react";
import { ShieldAlert, UserMinus, UserCheck, ShieldCheck } from "lucide-react";

interface AdminUsersContainerProps {
  initialUsers: any[];
}

export default function AdminUsersContainer({ initialUsers = [] }: AdminUsersContainerProps) {
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    setLoadingId(userId);
    const targetStatus = currentStatus === "active" ? "banned" : "active";
    try {
      const res = await updateUserStatus(userId, targetStatus);
      if (res?.success) {
        toast.success(`User status updated to ${targetStatus} successfully.`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: targetStatus } : u))
        );
      } else {
        toast.error(res?.message || "Failed to update user status.");
      }
    } catch {
      toast.error("An error occurred during updating status.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    setLoadingId(userId);
    const targetRole = currentRole === "admin" ? "user" : "admin";
    try {
      const res = await updateUserRole(userId, targetRole);
      if (res?.success) {
        toast.success(`User role updated to ${targetRole} successfully.`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: targetRole } : u))
        );
      } else {
        toast.error(res?.message || "Failed to update user role.");
      }
    } catch {
      toast.error("An error occurred during updating role.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Manage Users</h1>
        <p className="text-xs text-muted-foreground">Audit platform accounts, change roles, or suspend access.</p>
      </div>

      <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((userObj) => (
                <TableRow key={userObj._id}>
                  <TableCell className="font-bold text-xs">{userObj.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">{userObj.email}</TableCell>
                  <TableCell className="capitalize">
                    <Badge variant={userObj.role === "admin" ? "default" : "outline"} className="text-xs font-semibold">
                      {userObj.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`text-xs font-semibold ${
                        userObj.status === "active"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/15 text-red-600 dark:text-red-400"
                      }`}
                      variant="outline"
                    >
                      {userObj.status || "active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    {/* Toggle Role Button */}
                    <Button
                      disabled={loadingId === userObj._id}
                      variant="ghost"
                      size="sm"
                      className="rounded-full flex gap-1 items-center"
                      onClick={() => handleToggleRole(userObj._id, userObj.role)}
                    >
                      {userObj.role === "admin" ? (
                        <>
                          <UserMinus className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="text-[10px]">Demote</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="text-[10px]">Make Admin</span>
                        </>
                      )}
                    </Button>

                    {/* Toggle Status (Block/Unblock) */}
                    <Button
                      disabled={loadingId === userObj._id}
                      variant="ghost"
                      size="sm"
                      className="rounded-full flex gap-1 items-center"
                      onClick={() => handleToggleStatus(userObj._id, userObj.status || "active")}
                    >
                      {userObj.status === "active" || !userObj.status ? (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                          <span className="text-[10px] text-red-600">Block</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[10px] text-emerald-600">Activate</span>
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-xs">
                  No accounts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
