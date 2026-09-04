"use client";

import { useState } from "react";
import { saveEntityAction, deleteEntityAction, reorderEntityAction } from "@/lib/actions/admin.actions";
import { Field } from "../ui/primitives";

export function TextField({
  name,
  label,
  defaultValue,
  required,
  hint,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        name={name}
        className="input"
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
      />
    </Field>
  );
}

export function TextAreaField({
  name,
  label,
  defaultValue,
  required,
  hint,
  rows = 3,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  hint?: string;
  rows?: number;
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        name={name}
        className="input font-mono text-xs leading-relaxed"
        defaultValue={defaultValue ?? ""}
        required={required}
        rows={rows}
      />
    </Field>
  );
}

export function NumberField({
  name,
  label,
  defaultValue,
  min,
  max,
}: {
  name: string;
  label: string;
  defaultValue?: number | null;
  min?: number;
  max?: number;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        name={name}
        className="input"
        defaultValue={defaultValue ?? 0}
        min={min}
        max={max}
      />
    </Field>
  );
}

export function SelectField({
  name,
  label,
  defaultValue,
  options,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <Field label={label}>
      <select name={name} className="input" defaultValue={defaultValue ?? ""} required={required}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export const DIFFICULTY_OPTIONS = [
  { value: "BASIC", label: "Basic" },
  { value: "ELEMENTARY", label: "Elementary" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "UPPER_INTERMEDIATE", label: "Upper Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

export function StatusSelect({
  defaultValue,
}: {
  defaultValue?: string | null;
}) {
  return (
    <SelectField
      name="published"
      label="Status"
      options={STATUS_OPTIONS}
      defaultValue={defaultValue}
    />
  );
}

export function SubmitButton({ label = "Save" }: { label?: string }) {
  return (
    <button type="submit" className="btn btn-primary">
      {label}
    </button>
  );
}

export function CancelEdit({ href }: { href: string }) {
  return (
    <a href={href} className="btn btn-ghost">
      Cancel
    </a>
  );
}

/** Delete control calling the deleteEntityAction server action (client-side confirm). */
export function DeleteButton({
  kind,
  id,
  returnTo,
  label = "Delete",
}: {
  kind: string;
  id: string;
  returnTo: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);

  const onDelete = async () => {
    if (busy) return;
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    setBusy(true);
    const fd = new FormData();
    fd.set("kind", kind);
    fd.set("id", id);
    fd.set("returnTo", returnTo);
    // deleteEntityAction revalidates and redirects client-side on success.
    await deleteEntityAction(fd);
    setBusy(false);
  };

  return (
    <button type="button" onClick={onDelete} disabled={busy} className="btn btn-danger btn-sm">
      {label}
    </button>
  );
}

/** Up/down reorder controls calling reorderEntityAction. */
export function ReorderButtons({
  kind,
  id,
  returnTo,
}: {
  kind: "level" | "course" | "topic";
  id: string;
  returnTo: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <ReorderOne kind={kind} id={id} returnTo={returnTo} direction="up" label="↑" />
      <ReorderOne kind={kind} id={id} returnTo={returnTo} direction="down" label="↓" />
    </div>
  );
}

function ReorderOne({
  kind,
  id,
  returnTo,
  direction,
  label,
}: {
  kind: "level" | "course" | "topic";
  id: string;
  returnTo: string;
  direction: "up" | "down";
  label: string;
}) {
  const [busy, setBusy] = useState(false);

  const onMove = async () => {
    if (busy) return;
    setBusy(true);
    const fd = new FormData();
    fd.set("kind", kind);
    fd.set("id", id);
    fd.set("direction", direction);
    fd.set("returnTo", returnTo);
    // reorderEntityAction revalidates and redirects client-side on success.
    await reorderEntityAction(fd);
    setBusy(false);
  };

  return (
    <button
      type="button"
      onClick={onMove}
      disabled={busy}
      aria-label={`Move ${direction}`}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted transition hover:text-ink"
    >
      {label}
    </button>
  );
}

/** Hidden fields used by saveEntityAction. */
export function KindFields({ kind, returnTo }: { kind: string; returnTo: string }) {
  return (
    <>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="returnTo" value={returnTo} />
    </>
  );
}

export function IdField({ id }: { id?: string | null }) {
  return id ? <input type="hidden" name="id" value={id} /> : null;
}

export function AdminForm({
  children,
  onCancelHref,
}: {
  children: React.ReactNode;
  onCancelHref?: string;
}) {
  return (
    <form action={saveEntityAction} className="flex flex-col gap-3.5">
      {children}
      <div className="mt-1 flex items-center gap-2">
        <SubmitButton />
        {onCancelHref ? <CancelEdit href={onCancelHref} /> : null}
      </div>
    </form>
  );
}
