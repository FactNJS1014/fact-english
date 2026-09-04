import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { Logo } from "../ui/logo";
import { ThemeToggle } from "../ui/theme-toggle";
import { SearchBox } from "../ui/search-box";
import { LayoutDashboard, Menu, X } from "lucide-react";

const links = [
  { href: "/levels", label: "Levels" },
  { href: "/courses", label: "Courses" },
  { href: "/progress", label: "My Progress" },
];

export async function PublicNav() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden w-64 lg:block">
          <SearchBox />
        </div>
        <ThemeToggle />
        {user ? (
          <Link href="/dashboard" className="btn btn-primary btn-sm">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        ) : (
          <div className="hidden items-center gap-2 sm:flex">
            <Link href="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Start Learning
            </Link>
          </div>
        )}
        <PublicMobileMenu user={Boolean(user)} />
      </div>
    </header>
  );
}

function PublicMobileMenu({ user }: { user: boolean }) {
  return (
    <details className="group relative md:hidden">
      <summary className="flex h-9 w-9 list-none items-center justify-center rounded-lg border border-line text-muted [&::-webkit-details-marker]:hidden">
        <Menu className="h-4 w-4 group-open:hidden" />
        <X className="hidden h-4 w-4 group-open:block" />
      </summary>
      <div className="absolute right-0 top-12 flex w-56 flex-col gap-1 rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/30">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink"
          >
            {l.label}
          </Link>
        ))}
        <div className="my-1 border-t border-line" />
        {user ? (
          <Link href="/dashboard" className="btn btn-primary btn-sm">
            Dashboard
          </Link>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Start Learning
            </Link>
          </>
        )}
      </div>
    </details>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-surface/40">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            FactBusiness English is a complete online learning platform for
            Business English — from Basic (Level 1) to Advanced (Level 5).
            Learn the vocabulary, grammar and communication skills you really
            use at work.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-faint">Learn</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/levels" className="hover:text-ink">English Levels</Link></li>
            <li><Link href="/courses" className="hover:text-ink">All Courses</Link></li>
            <li><Link href="/register" className="hover:text-ink">Create Account</Link></li>
            <li><Link href="/login" className="hover:text-ink">Login</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-faint">Levels</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {["basic", "elementary", "intermediate", "upper-intermediate", "advanced"].map((s) => (
              <li key={s}>
                <Link href={`/levels/${s}`} className="capitalize hover:text-ink">
                  {s.replace("-", " ")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-faint">
        © {new Date().getFullYear()} FactBusiness English Learning Platform. All rights reserved.
      </div>
    </footer>
  );
}
