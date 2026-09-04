import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { StudentNav } from "@/components/nav/student-nav";
import { Toaster } from "@/components/ui/toast";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    // A cookie existed (middleware let us through) but the DB session is gone
    // or expired → explain that the session expired.
    redirect("/login?expired=1");
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <StudentNav user={user} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
      <footer className="border-t border-line py-6 text-center text-xs text-faint">
        FactBusiness English Learning Platform
      </footer>
      <Toaster />
    </div>
  );
}
