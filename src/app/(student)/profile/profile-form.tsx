"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/lib/actions/auth.actions";
import { toast } from "@/components/ui/toast";
import { Button, Field, Input } from "@/components/ui/primitives";
import { Spinner } from "@/components/ui/spinner";

export function ProfileForm({
  firstName,
  lastName,
  email,
}: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  const [form, setForm] = useState({ firstName, lastName, email });
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData();
    fd.set("firstName", form.firstName);
    fd.set("lastName", form.lastName);
    fd.set("email", form.email);
    const res = await updateProfileAction(fd);
    setBusy(false);
    if (res.ok) {
      toast("Profile updated.");
      router.refresh();
    } else {
      toast(res.error ?? "Could not update profile.", "danger");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3.5">
      <div className="grid gap-3.5 sm:grid-cols-2">
        <Field label="First name">
          <Input
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
        </Field>
        <Field label="Last name">
          <Input
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
          />
        </Field>
      </div>
      <Field label="Email">
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? <Spinner className="h-4 w-4" /> : null} Save changes
        </Button>
        <span className="text-xs text-faint">
          Username cannot be changed here. Password changes live in Settings.
        </span>
      </div>
    </form>
  );
}
