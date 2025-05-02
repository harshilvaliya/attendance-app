"use client";

import Link from "next/link";
import { Calendar, FileText, Clock, Users, ArrowRight } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ShortcutCards() {
  const shortcuts = [
    {
      title: "Manage Attendance",
      description: "View and manage daily attendance records",
      icon: Calendar,
      href: "/attendance",
      color: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Leave Requests",
      description: "Review and approve employee leave requests",
      icon: FileText,
      href: "/leaves",
      color: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Holidays",
      description: "Manage company holidays and events",
      icon: Clock,
      href: "/holidays",
      color: "bg-orange-100 dark:bg-orange-900",
    },
    {
      title: "Employees",
      description: "Add, edit, and manage employee profiles",
      icon: Users,
      href: "/employees",
      color: "bg-purple-100 dark:bg-purple-900",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {shortcuts.map((shortcut) => (
        <Card key={shortcut.title} className="overflow-hidden">
          <CardHeader className="p-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${shortcut.color} mb-2`}
            >
              <shortcut.icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">{shortcut.title}</CardTitle>
            <CardDescription>{shortcut.description}</CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0">
            <Button
              asChild
              variant="ghost"
              className="py-0 px-1 h-auto font-normal"
            >
              <Link href={shortcut.href} className="flex items-center">
                Go to {shortcut.title.split(" ")[1]}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
