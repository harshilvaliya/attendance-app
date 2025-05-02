import type React from "react";
import "../app/globals.css";
import { ToastProvider } from "@/components/ui/use-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
