import Link from "next/link";
import { ShieldX } from "lucide-react";

export const metadata = { title: "Forbidden" };

export default function ForbiddenPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
        <ShieldX className="h-7 w-7" />
      </div>
      <p className="text-6xl font-black tracking-tight">403</p>
      <h1 className="text-xl font-bold">Access denied</h1>
      <p className="text-muted">
        Your account does not have permission to view this page. If you believe
        this is a mistake, contact your administrator.
      </p>
      <Link href="/dashboard" className="btn btn-primary">
        Go to dashboard
      </Link>
    </div>
  );
}
