import { cn } from "@/lib/utils";

function renderInline(text: string, keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  // Split on **bold**, *italic* and `code` — content is always text nodes (XSS-safe).
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  parts.forEach((part, i) => {
    if (!part) return;
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    } else if (part.startsWith("`") && part.endsWith("`")) {
      nodes.push(
        <code
          key={`${keyPrefix}-${i}`}
          className="rounded-md bg-surface-3 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-cyan"
        >
          {part.slice(1, -1)}
        </code>
      );
    } else if (part.startsWith("*") && part.endsWith("*")) {
      nodes.push(
        <em key={`${keyPrefix}-${i}`} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    } else {
      nodes.push(part);
    }
  });
  return nodes;
}

/** Block-level markdown renderer for lesson content (headings, lists, quotes, fenced code). */
export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let codeBuffer: string[] = [];
  let codeLang = "";
  let inCode = false;
  let key = 0;

  const flushList = () => {
    if (listBuffer.length === 0 || !listType) return;
    const items = listBuffer.map((item, i) => (
      <li key={`li-${key}-${i}`} className="ml-1 leading-relaxed">
        {renderInline(item, `li-${key}-${i}`)}
      </li>
    ));
    blocks.push(
      listType === "ol" ? (
        <ol key={`list-${key}`} className="my-3 list-decimal space-y-1.5 pl-5 marker:text-brand">
          {items}
        </ol>
      ) : (
        <ul key={`list-${key}`} className="my-3 list-disc space-y-1.5 pl-5 marker:text-brand">
          {items}
        </ul>
      )
    );
    key += 1;
    listBuffer = [];
    listType = null;
  };

  const flushCode = () => {
    if (codeBuffer.length === 0) return;
    blocks.push(
      <div key={`code-${key}`} className="my-4 overflow-hidden rounded-xl border border-line bg-[#0a1120]">
        {codeLang ? (
          <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
            <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-faint">
              {codeLang}
            </span>
          </div>
        ) : null}
        <pre className="overflow-x-auto p-4 text-[0.85rem] leading-relaxed text-cyan-100">
          <code>{codeBuffer.join("\n")}</code>
        </pre>
      </div>
    );
    key += 1;
    codeBuffer = [];
    codeLang = "";
  };

  for (const line of lines) {
    if (inCode) {
      if (line.trim().startsWith("```")) {
        inCode = false;
        flushCode();
      } else {
        codeBuffer.push(line);
      }
      continue;
    }
    if (line.trim().startsWith("```")) {
      flushList();
      inCode = true;
      codeLang = line.trim().slice(3).trim();
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }

    // headings
    const h = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (h) {
      flushList();
      const level = h[1]!.length;
      const text = renderInline(h[2]!, `h-${key}`);
      const cls =
        level === 1
          ? "text-2xl font-bold tracking-tight"
          : level === 2
            ? "text-xl font-bold tracking-tight"
            : level === 3
              ? "text-lg font-semibold"
              : "text-base font-semibold";
      blocks.push(
        <h2
          key={`h-${key}`}
          className={cn(cls, "mt-7 mb-3 first:mt-0", level >= 3 && "text-ink")}
        >
          {text}
        </h2>
      );
      key += 1;
      continue;
    }
    // quote / callout
    if (trimmed.startsWith(">")) {
      flushList();
      blocks.push(
        <blockquote
          key={`q-${key}`}
          className="my-4 rounded-r-xl border-l-4 border-brand bg-brand-soft px-4 py-3 text-[0.95rem] leading-relaxed"
        >
          {renderInline(trimmed.slice(1).trim(), `q-${key}`)}
        </blockquote>
      );
      key += 1;
      continue;
    }
    // lists
    const ul = /^[-*]\s+(.*)$/.exec(trimmed);
    const ol = /^\d+[.)]\s+(.*)$/.exec(trimmed);
    if (ul) {
      if (listType !== "ul") flushList();
      listType = "ul";
      listBuffer.push(ul[1]!);
      continue;
    }
    if (ol) {
      if (listType !== "ol") flushList();
      listType = "ol";
      listBuffer.push(ol[1]!);
      continue;
    }
    flushList();
    // rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push(<hr key={`hr-${key}`} className="my-5 border-line-strong" />);
      key += 1;
      continue;
    }
    blocks.push(
      <p key={`p-${key}`} className="my-3 leading-relaxed">
        {renderInline(trimmed, `p-${key}`)}
      </p>
    );
    key += 1;
  }
  flushList();
  flushCode();

  return (
    <div className={cn("text-[0.95rem] text-ink/90", className)}>{blocks}</div>
  );
}
