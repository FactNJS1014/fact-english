"use client";

import { useState } from "react";
import { changePasswordAction } from "@/lib/actions/auth.actions";
import { toast } from "@/components/ui/toast";
import { Button, Field, Input } from "@/components/ui/primitives";
import { Spinner } from "@/components/ui/spinner";

export function ChangePasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast("New passwords do not match.", "danger");
      return;
    }
    setBusy(true);
    const fd = new FormData();
    fd.set("currentPassword", form.currentPassword);
    fd.set("newPassword", form.newPassword);
    fd.set("confirmPassword", form.confirmPassword);
    const res = await changePasswordAction(fd);
    setBusy(false);
    if (res.ok) {
      toast("Password updated. Use it next time you log in.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      toast(res.error ?? "Could not change password.", "danger");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3.5">
      <Field label="Current password">
        <Input
          type="password"
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          required
        />
      </Field>
      <Field label="New password" hint="Minimum 8 characters">
        <Input
          type="password"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          minLength={8}
          required
        />
      </Field>
      <Field label="Confirm new password">
        <Input
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          minLength={8}
          required
        />
      </Field>
      <Button type="submit" disabled={busy} className="self-start">
        {busy ? <Spinner className="h-4 w-4" /> : null} Update password
      </Button>
    </form>
  );
}
