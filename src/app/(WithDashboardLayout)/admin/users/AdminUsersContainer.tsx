"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { updateUserStatus, updateUserRole } from "@/services/user";
import { DataTable } from "@/components/ui/core/DataTable";
import { ConfirmModal } from "@/components/ui/core/ConfirmModal";
import { IMeta } from "@/types/meta";

interface AdminUsersContainerProps {
  initialUsers: any[];
  meta: IMeta | null;
}

export default function AdminUsersContainer({
  initialUsers = [],
  meta,
}: AdminUsersContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<any[]>(initialUsers);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalTargetUser, setModalTargetUser] = useState<any>(null);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Sync state mutations to server and locally
  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    setLoadingUserId(userId);
    try {
      const res = await updateUserStatus(userId, newStatus);
      if (res?.success) {
        toast.success(`User status updated to ${newStatus} successfully.`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
        );
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to update user status.");
      }
    } catch {
      toast.error("An error occurred during updating status.");
    } finally {
      setLoadingUserId(null);
      setConfirmOpen(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setLoadingUserId(userId);
    try {
      const res = await updateUserRole(userId, newRole);
      if (res?.success) {
        toast.success(`User role updated to ${newRole} successfully.`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to update user role.");
      }
    } catch {
      toast.error("An error occurred during updating role.");
    } finally {
      setLoadingUserId(null);
    }
  };

  // Open confirmation modal for banning
  const triggerBanConfirm = (userObj: any) => {
    setModalTargetUser(userObj);
    setConfirmOpen(true);
  };

  // Filter updates
  const setFilterParam = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") {
      params.set(key, val);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const currentRole = searchParams.get("role") || "all";
  const currentStatus = searchParams.get("status") || "all";
  const currentPage = meta?.page || 1;

  // Columns definition for DataTable
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Avatar & Name",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 rounded-full border">
              <AvatarImage src={u.profilePhoto || ""} alt={u.name} />
              <AvatarFallback className="text-[10px] font-bold">
                {u.name?.slice(0, 2).toUpperCase() || "US"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-xs">{u.name}</span>
              <span className="text-[10px] text-muted-foreground capitalize font-semibold">{u.role}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-mono">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <Badge
            variant={role === "admin" ? "default" : "outline"}
            className={
              role === "admin"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/15 border-transparent text-[10px] font-black"
                : "text-[10px] font-bold"
            }
          >
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "active";
        const isActive = status === "active";
        return (
          <Badge
            className={
              isActive
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-transparent text-[10px] font-black"
                : "bg-red-500/15 text-red-600 dark:text-red-400 border-transparent text-[10px] font-black"
            }
            variant="outline"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined Date",
      cell: ({ row }) => {
        const date = row.original.createdAt ? new Date(row.original.createdAt) : null;
        return (
          <span className="text-xs text-muted-foreground font-medium">
            {date ? date.toLocaleDateString() : "N/A"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const u = row.original;
        const isBanned = u.status === "banned";
        const isSelfLoading = loadingUserId === u._id;

        return (
          <div className="flex gap-2 justify-start items-center">
            {/* Change Role Selector */}
            <Select
              disabled={isSelfLoading}
              value={u.role}
              onValueChange={(val) => handleUpdateRole(u._id, val)}
            >
              <SelectTrigger className="w-[110px] h-8 rounded-full text-[10px] font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user" className="text-[10px]">User</SelectItem>
                <SelectItem value="admin" className="text-[10px]">Admin</SelectItem>
              </SelectContent>
            </Select>

            {/* Ban / Unban Toggle Button */}
            {isBanned ? (
              <Button
                disabled={isSelfLoading}
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus(u._id, "active")}
                className="h-8 rounded-full px-3 text-[10px] font-black border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/20 flex gap-1 items-center"
              >
                <UserCheck className="w-3 h-3" />
                Unban
              </Button>
            ) : (
              <Button
                disabled={isSelfLoading}
                variant="outline"
                size="sm"
                onClick={() => triggerBanConfirm(u)}
                className="h-8 rounded-full px-3 text-[10px] font-black border-red-500/20 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 flex gap-1 items-center"
              >
                <ShieldAlert className="w-3 h-3" />
                Ban
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  // Filters slot
  const filters = (
    <>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <span>Role:</span>
        <Select value={currentRole} onValueChange={(val) => setFilterParam("role", val)}>
          <SelectTrigger className="w-[110px] h-8 rounded-full">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <span>Status:</span>
        <Select value={currentStatus} onValueChange={(val) => setFilterParam("status", val)}>
          <SelectTrigger className="w-[110px] h-8 rounded-full">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Manage Users</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Audit platform user registrations, grant administrator privileges, or block accounts.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={users}
        totalCount={meta?.total || users.length}
        currentPage={currentPage}
        pageSize={meta?.limit || 10}
        onPageChange={(page) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", page.toString());
          router.push(`${pathname}?${params.toString()}`);
        }}
        onSearch={(searchVal) => {
          const params = new URLSearchParams(searchParams.toString());
          if (searchVal) {
            params.set("search", searchVal);
          } else {
            params.delete("search");
          }
          params.set("page", "1");
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }}
        searchPlaceholder="Search by name or email..."
        filterSlot={filters}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (modalTargetUser) {
            handleUpdateStatus(modalTargetUser._id, "banned");
          }
        }}
        title="Ban User Account?"
        description={`Are you sure you want to ban ${modalTargetUser?.name || "this user"}? Banned users will lose access to login or shop on the platform.`}
        confirmLabel="Ban Account"
        variant="danger"
        isLoading={loadingUserId === modalTargetUser?._id}
      />
    </div>
  );
}
