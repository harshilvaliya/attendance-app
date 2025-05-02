import type React from "react";
import "../app/globals.css";
import { ToastProvider } from "@/components/ui/use-toast";
import BottomNavigation from "@/components/user/bottom-nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ToastProvider>
          {children}
          <BottomNavigation />
        </ToastProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
