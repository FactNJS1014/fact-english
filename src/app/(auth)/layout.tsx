import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 15% 0%, rgba(59,130,246,0.16), transparent 60%), radial-gradient(ellipse 45% 40% at 90% 20%, rgba(139,92,246,0.12), transparent 55%), radial-gradient(ellipse 60% 50% at 50% 110%, rgba(34,211,238,0.08), transparent 60%)",
        }}
      />
      <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="relative z-10 pb-6 text-center text-xs text-faint">
        <Link href="/" className="hover:text-muted">
          ← Back to home
        </Link>
      </footer>
    </div>
  );
}
