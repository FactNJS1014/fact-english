import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Business English Learning Platform`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "FactBusiness English — learn Business English for the workplace from Level 1 (Basic) to Level 5 (Advanced). Courses, lessons, vocabulary, grammar, listening, quizzes, certificates.",
  keywords: [
    "business english",
    "english for work",
    "FactBusiness English",
    "learning platform",
    "vocabulary",
    "grammar",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1220",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "light" ? "light" : "dark";

  return (
    <html lang="en" className={theme === "dark" ? "dark" : "light"}>
      <body className="bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
