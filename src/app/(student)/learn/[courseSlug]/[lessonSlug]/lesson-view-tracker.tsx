"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { viewLessonAction } from "@/lib/actions/learning.actions";

export function LessonViewTracker({
  lessonId,
  alreadyViewed,
}: {
  lessonId: string;
  alreadyViewed: boolean;
}) {
  const router = useRouter();
  const fired = useRef(false);

  useEffect(() => {
    if (alreadyViewed || fired.current) return;
    fired.current = true;
    viewLessonAction(lessonId).then((res) => {
      if (res?.ok) router.refresh();
    });
  }, [alreadyViewed, lessonId, router]);

  return null;
}
