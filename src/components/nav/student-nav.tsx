import Link from "next/link";
import {
  BarChart3,
  Bookmark,
  Flame,
  LayoutDashboard,
  Library,
  Settings,
  Trophy,
  User,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth";
import { Logo } from "../ui/logo";
import { ThemeToggle } from "../ui/theme-toggle";
import { initials } from "@/lib/utils";

export function StudentNav({ user }: { user: AuthUser }) {
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/levels", label: "Learn", icon: Library },
    { href: "/progress", label: "Progress", icon: BarChart3 },
    { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <Logo href="/dashboard" />
        <nav aria-label="Student" className="ml-2 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-ink"
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="chip hidden !text-success !normal-case sm:inline-flex">
            <Flame className="h-3.5 w-3.5" />
            {user.xp} XP
          </span>
          <ThemeToggle />
          <StudentMenu user={user} />
        </div>
      </div>
    </header>
  );
}

function StudentMenu({ user }: { user: AuthUser }) {
  return (
    <details className="group relative">
      <summary className="flex list-none items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 [&::-webkit-details-marker]:hidden">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent-purple text-xs font-bold text-white">
          {initials(user.firstName, user.lastName)}
        </span>
        <span className="hidden max-w-28 truncate text-sm font-semibold sm:block">
          {user.firstName}
        </span>
      </summary>
      <div className="absolute right-0 top-12 flex w-60 flex-col gap-0.5 rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/40">
        <p className="px-3 pb-1 pt-2 text-xs text-faint">
          Signed in as <span className="font-semibold text-muted">{user.email}</span>
        </p>
        <div className="mx-2 border-t border-line" />
        <MenuLink href="/profile" icon={User}>Profile</MenuLink>
        <MenuLink href="/progress" icon={BarChart3}>My Progress</MenuLink>
        <MenuLink href="/settings" icon={Settings}>Settings</MenuLink>
        {user.role === "ADMIN" ? (
          <MenuLink href="/admin" icon={Trophy} accent>Admin Dashboard</MenuLink>
        ) : null}
        <div className="mx-2 my-1 border-t border-line" />
        <LogoutForm />
      </div>
    </details>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
  accent,
}: {
  href: string;
  icon: typeof User;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-surface-2 ${
        accent ? "text-brand" : "text-muted hover:text-ink"
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}

import { logoutAction } from "@/lib/actions/auth.actions";

function LogoutForm() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-danger transition hover:bg-danger/10"
      >
        Logout
      </button>
    </form>
  );
}
