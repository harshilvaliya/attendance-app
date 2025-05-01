import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAttendanceData } from "@/lib/data";
import { CalendarIcon, Clock, UserCheck, UserX } from "lucide-react";
import { AttendanceTable } from "@/components/dashboard/attendance-table";
import { Button } from "@/components/ui/button";
import { MarkAttendanceDialog } from "@/components/dashboard/mark-attendance-dialog";

export default function AttendancePage() {
  const { today } = getAttendanceData();

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
            <p className="text-muted-foreground">
              Manage employee attendance records
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MarkAttendanceDialog>
              <Button className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                Mark Attendance
              </Button>
            </MarkAttendanceDialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Present Today
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{today.present}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((today.present / today.total) * 100)}% of total
                staff
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Absent Today
              </CardTitle>
              <UserX className="h-4 w-4 text-red-500"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{today.absent}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((today.absent / today.total) * 100)}% of total staff
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Late Arrivals
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{today.late}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((today.late / today.total) * 100)}% of total staff
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="today" className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="history">Attendance History</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Attendance</CardTitle>
                <CardDescription>
                  Attendance for{" "}
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceTable />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>View past attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceTable showDate={true} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
