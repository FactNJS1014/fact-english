import Link from "next/link";
import { Pencil } from "lucide-react";
import { Badge } from "../ui/badge";
import { Banner } from "../ui/banner";
import {
  AdminForm,
  KindFields,
  IdField,
  TextField,
  TextAreaField,
  NumberField,
  SelectField,
  StatusSelect,
  STATUS_OPTIONS,
  DIFFICULTY_OPTIONS,
  DeleteButton,
  ReorderButtons,
} from "./admin-forms";

export type FieldDef =
  | { type: "text"; name: string; label: string; required?: boolean; hint?: string; placeholder?: string }
  | { type: "textarea"; name: string; label: string; required?: boolean; hint?: string; rows?: number }
  | { type: "number"; name: string; label: string; min?: number; max?: number }
  | { type: "select"; name: string; label: string; options: () => { value: string; label: string }[] }
  | { type: "status" }
  | { type: "difficulty" };

export interface CrudConfig {
  kind: string;
  title: string;
  description: string;
  returnTo: string;
  columns: {
    key: string;
    label: string;
    render: (item: Record<string, unknown>) => React.ReactNode;
  }[];
  fields: FieldDef[];
  /** Optional second panel rendered after the table (e.g. question editors). */
  extraPanel?: (item: Record<string, unknown>) => React.ReactNode;
  allowReorder?: "level" | "course" | "topic";
}

export function AdminCrudPage({
  config,
  items,
  options,
  searchParams,
}: {
  config: CrudConfig;
  items: Record<string, unknown>[];
  options?: Record<string, { value: string; label: string }[]>;
  searchParams: { edit?: string; saved?: string; deleted?: string; error?: string; reordered?: string };
}) {
  const editing = searchParams.edit
    ? items.find((i) => String(i.id) === searchParams.edit) ?? null
    : null;

  const valueOf = (item: Record<string, unknown> | null, name: string) =>
    item ? (item[name] as string | number | null | undefined) ?? null : null;

  const fieldValue = (f: FieldDef): string | number | null => {
    if (!editing) {
      if (f.type === "select" && f.name === "levelId" && options?.level?.length === 1) {
        return options.level[0]!.value;
      }
      if (f.type === "select" && f.name === "courseId" && options?.course?.length === 1) {
        return options.course[0]!.value;
      }
      if (f.type === "select" && f.name === "topicId" && options?.topic?.length === 1) {
        return options.topic[0]!.value;
      }
      if (f.type === "select" && f.name === "lessonId" && options?.lesson?.length === 1) {
        return options.lesson[0]!.value;
      }
      return null;
    }
    if (f.type === "status") return String(editing.published ?? "DRAFT");
    if (f.type === "difficulty") return String(editing.difficulty ?? "BASIC");
    if (f.type === "select") return valueOf(editing, f.name) as string;
    if (f.type === "number") return (valueOf(editing, f.name) as number) ?? 0;
    return valueOf(editing, f.name) as string;
  };

  const renderField = (f: FieldDef) => {
    switch (f.type) {
      case "text":
        return (
          <TextField
            key={f.name}
            name={f.name}
            label={f.label}
            required={f.required}
            hint={f.hint}
            placeholder={f.placeholder}
            defaultValue={editing ? String(valueOf(editing, f.name) ?? "") : null}
          />
        );
      case "textarea":
        return (
          <TextAreaField
            key={f.name}
            name={f.name}
            label={f.label}
            required={f.required}
            hint={f.hint}
            rows={f.rows}
            defaultValue={editing ? String(valueOf(editing, f.name) ?? "") : null}
          />
        );
      case "number":
        return (
          <NumberField
            key={f.name}
            name={f.name}
            label={f.label}
            min={f.min}
            max={f.max}
            defaultValue={editing ? Number(valueOf(editing, f.name) ?? 0) : 0}
          />
        );
      case "status":
        return <div key="status"><StatusSelect defaultValue={String(fieldValue(f) ?? "DRAFT")} /></div>;
      case "difficulty":
        return (
          <div key="difficulty">
            <SelectField
              name="difficulty"
              label="Difficulty"
              options={DIFFICULTY_OPTIONS}
              defaultValue={String(fieldValue(f) ?? "BASIC")}
            />
          </div>
        );
      case "select": {
        const opts = f.options();
        const active = f.name === "levelId" || f.name === "courseId" || f.name === "topicId" || f.name === "lessonId";
        return (
          <SelectField
            key={f.name}
            name={f.name}
            label={f.label}
            options={active && !editing && opts.length > 1
              ? [{ value: "", label: `— choose ${f.label.toLowerCase()} —` }, ...opts]
              : opts}
            defaultValue={fieldValue(f) as string}
          />
        );
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{config.title}</h1>
        <p className="mt-1 text-sm text-muted">{config.description}</p>
      </div>

      {searchParams.saved ? (
        <Banner tone="success" param="saved">Saved successfully.</Banner>
      ) : null}
      {searchParams.deleted ? (
        <Banner tone="info" param="deleted">Item deleted.</Banner>
      ) : null}
      {searchParams.reordered ? (
        <Banner tone="info" param="reordered">Order updated.</Banner>
      ) : null}
      {searchParams.error ? (
        <Banner tone="danger" param="error">{searchParams.error}</Banner>
      ) : null}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wider text-faint">
              {config.columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>
              ))}
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={String(item.id)} className="border-b border-line/60 last:border-0 hover:bg-surface-2/40">
                {config.columns.map((c) => (
                  <td key={c.key} className="px-4 py-3">{c.render(item)}</td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {config.allowReorder ? (
                      <ReorderButtons kind={config.allowReorder} id={String(item.id)} returnTo={config.returnTo} />
                    ) : null}
                    <Link
                      href={`${config.returnTo}?edit=${item.id}`}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted transition hover:text-brand"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <DeleteButton kind={config.kind} id={String(item.id)} returnTo={config.returnTo} label="Delete" />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={config.columns.length + 1} className="px-4 py-10 text-center text-muted">
                  Nothing here yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {config.extraPanel && editing ? config.extraPanel(editing) : null}

      <div className="card p-5 sm:p-6">
        <h2 className="mb-4 font-bold">
          {editing ? `Edit — ${String(editing.title ?? editing.name ?? "item")}` : `Create new ${config.kind}`}
        </h2>
        <AdminForm onCancelHref={editing ? config.returnTo : undefined}>
          <KindFields kind={config.kind} returnTo={config.returnTo} />
          <IdField id={editing ? String(editing.id) : null} />
          <div className="grid gap-3.5 sm:grid-cols-2">{config.fields.map(renderField)}</div>
        </AdminForm>
      </div>
    </div>
  );
}

export function StatusBadge({ value }: { value: string }) {
  const tone =
    value === "PUBLISHED" ? "green" : value === "DRAFT" ? "amber" : "default";
  return <Badge tone={tone as "green"}>{value.toLowerCase()}</Badge>;
}

export function statusOptions() {
  return STATUS_OPTIONS;
}
