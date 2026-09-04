import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChangePasswordForm } from "./change-password-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = (await getSessionUser())!;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-1 text-muted">Manage your account security and preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-line bg-surface-2 px-4 py-3">
              <span className="text-muted">Role</span>
              <Badge tone={session!.role === "ADMIN" ? "purple" : "green"}>
                {session!.role}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-line bg-surface-2 px-4 py-3">
              <span className="text-muted">Username</span>
              <span className="font-semibold">@{session!.username}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-faint">
              Security notes: passwords are stored as bcrypt hashes only.
              Sessions expire automatically 24 hours after login — you will be
              asked to sign in again. Use the theme toggle in the top bar to
              switch between dark and light mode.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
