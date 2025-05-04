import type React from "react";
import BottomNavigation from "@/components/user/bottom-nav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-16">
      {children}
      <BottomNavigation />
    </div>
  );
}
