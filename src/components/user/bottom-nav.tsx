"use client";

import { Calendar, Clock, Home, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    path: "/user-leave",
    label: "Leave",
    icon: Calendar,
  },
  {
    path: "/user-attendance",
    label: "Attendance",
    icon: Clock,
  },
  {
    path: "/user-holidays",
    label: "Holiday",
    icon: Home,
  },
  {
    path: "/user-profile",
    label: "Profile",
    icon: User,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto border-t border-border/30 bg-background/95 backdrop-blur-md shadow-lg">
      <nav className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "bottom-nav-item flex flex-col items-center py-3 px-3 text-xs",
                isActive
                  ? "active text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn("h-5 w-5 mb-1", isActive ? "text-primary" : "")}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
