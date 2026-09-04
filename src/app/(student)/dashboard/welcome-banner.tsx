"use client";

import { useSearchParams } from "next/navigation";
import { Banner } from "@/components/ui/banner";

export function WelcomeBanner({ name }: { name: string }) {
  const params = useSearchParams();
  const welcome = params.get("welcome") === "1";

  if (!welcome) return null;
  return (
    <Banner tone="success" param="welcome">
      Welcome{name ? `, ${name}` : ""}! Your account is ready. Start with
      Level 1 · Basic and complete your first lesson.
    </Banner>
  );
}
