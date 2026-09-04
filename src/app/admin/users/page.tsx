import type { Metadata } from "next";
import Link from "next/link";
import { listUsers } from "@/lib/services/admin.service";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { UserRowActions } from "./user-row-actions";

export const metadata: Metadata = { title: "Users · Admin" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; active?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const { users, total, page, pageSize } = await listUsers({
    q: sp.q,
    role: sp.role,
    active: sp.active,
    page: Number(sp.page ?? 1),
  });
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted">
          {total} account{total === 1 ? "" : "s"} — activate/deactivate, change
          roles, grant level access and reset progress.
        </p>
      </div>

      <form method="get" className="flex flex-wrap items-center gap-2">
        <input name="q" defaultValue={sp.q ?? ""} placeholder="Search name, email, username…" className="input !w-64" aria-label="Search users" />
        <select name="role" defaultValue={sp.role ?? ""} className="input !w-36" aria-label="Filter by role">
          <option value="">All roles</option>
          <option value="STUDENT">STUDENT</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <select name="active" defaultValue={sp.active ?? ""} className="input !w-36" aria-label="Filter by status">
          <option value="">Any status</option>
          <option value="true">Active</option>
          <option value="false">Deactivated</option>
        </select>
        <button className="btn btn-primary btn-sm">Filter</button>
        <Link href="/admin/users" className="btn btn-ghost btn-sm">Reset</Link>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wider text-faint">
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Lessons done</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-line/60 last:border-0 hover:bg-surface-2/40">
                <td className="px-4 py-3">
                  <p className="font-semibold">
                    {u.firstName} {u.lastName}{" "}
                    <span className="font-normal text-faint">@{u.username}</span>
                  </p>
                  <p className="text-xs text-faint">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={u.role === "ADMIN" ? "purple" : "green"}>{u.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={u.isActive ? "green" : "red"}>
                    {u.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3">{u._count.lessonProgress}</td>
                <td className="px-4 py-3 text-xs text-faint">
                  {formatDate(u.createdAt)}
                  {u.lastLoginAt ? (
                    <span className="block">last login {formatDate(u.lastLoginAt)}</span>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <UserRowActions user={u} />
                </td>
              </tr>
            ))}
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No users match this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {pages > 1 ? (
        <div className="flex items-center gap-2">
          {Array.from({ length: pages }).map((_, i) => {
            const p = i + 1;
            const params = new URLSearchParams();
            if (sp.q) params.set("q", sp.q);
            if (sp.role) params.set("role", sp.role);
            if (sp.active) params.set("active", sp.active);
            params.set("page", String(p));
            return (
              <Link
                key={p}
                href={`/admin/users?${params.toString()}`}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold ${
                  p === page
                    ? "bg-brand text-white"
                    : "border border-line text-muted hover:text-ink"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      ) : null}

    </div>
  );
}
