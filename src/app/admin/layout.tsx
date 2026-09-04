import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AdminNav } from "@/components/admin/admin-nav";
import { Toaster } from "@/components/ui/toast";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login?expired=1&redirect=/admin");
  if (user.role !== "ADMIN") redirect("/403");

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-lg">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Logo href="/admin" />
          <span className="chip !border-accent-purple/30 !bg-accent-purple/10 !text-accent-purple">
            Admin
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="btn btn-ghost btn-sm">
              View site
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <div className="border-t border-line bg-surface/40">
          <div className="mx-auto w-full max-w-7xl px-4 py-2 sm:px-6">
            <AdminNav />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:px-6">
        {children}
      </main>
      <footer className="border-t border-line py-5 text-center text-xs text-faint">
        FactBusiness English · Admin console
      </footer>
      <Toaster />
    </div>
  );
}
