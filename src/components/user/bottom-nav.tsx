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
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto max-w-screen-2xl px-4">
        <ul className="flex items-center justify-around sm:justify-center sm:gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path} className="w-full sm:w-auto">
                <Link
                  href={item.path}
                  className={cn(
                    "relative flex h-16 sm:h-14 flex-col items-center justify-center gap-1 p-2 transition-all hover:scale-105",
                    isActive
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-[''] hover:text-primary/90"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all",
                      isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
