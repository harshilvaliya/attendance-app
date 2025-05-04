"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, FileText, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for attendance
const attendanceHistory = [
  { date: "2023-05-01", status: "present", time: "09:00 AM" },
  { date: "2023-05-02", status: "present", time: "08:55 AM" },
  { date: "2023-05-03", status: "absent", time: "-" },
  { date: "2023-05-04", status: "present", time: "09:10 AM" },
];

export default function AttendancePage() {
  const [open, setOpen] = useState(false);
  const [attendance, setAttendance] = useState(attendanceHistory);

  const markAttendance = (status: "present" | "absent") => {
    const today = new Date().toISOString().split("T")[0];
    const time =
      status === "present"
        ? new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-";

    // Check if attendance already marked for today
    const todayIndex = attendance.findIndex((a) => a.date === today);

    if (todayIndex >= 0) {
      // Update existing attendance
      const updatedAttendance = [...attendance];
      updatedAttendance[todayIndex] = { date: today, status, time };
      setAttendance(updatedAttendance);
    } else {
      // Add new attendance
      setAttendance([{ date: today, status, time }, ...attendance]);
    }

    setOpen(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 space-y-8 max-w-7xl min-h-screen">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Attendance
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track and manage your daily attendance records
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Status
            </CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendance[0]?.status === "present" ? "Present" : "Not Marked"}
            </div>
            <p className="text-xs text-muted-foreground">
              {attendance[0]?.time || "Mark your attendance"}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Present
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendance.filter((day) => day.status === "present").length}
            </div>
            <p className="text-xs text-muted-foreground">Days this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center sm:justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all">
              <Plus className="mr-2 h-4 w-4" />
              Mark Attendance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] w-[calc(100%-2rem)] p-4 sm:p-6 rounded-lg">
            <DialogHeader className="space-y-2">
              <DialogTitle>Mark Today&apos;s Attendance</DialogTitle>
              <DialogDescription>
                Select your attendance status for today
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-6">
              <Button
                onClick={() => markAttendance("present")}
                className="flex flex-col h-28 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30 dark:hover:bg-green-900/30 transition-all hover:scale-105"
              >
                <Check className="h-8 w-8 mb-2" />
                Present
              </Button>
              <Button
                onClick={() => markAttendance("absent")}
                className="flex flex-col h-28 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30 dark:hover:bg-red-900/30 transition-all hover:scale-105"
              >
                <X className="h-8 w-8 mb-2" />
                Absent
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Attendance</h2>
        <div className="space-y-4">
          {attendance.map((day, index) => (
            <Card
              key={index}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-medium">
                  {new Date(day.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </CardTitle>
                <div
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium",
                    day.status === "present"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  )}
                >
                  {day.status.charAt(0).toUpperCase() + day.status.slice(1)}
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm text-muted-foreground">
                  Time: {day.time}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
