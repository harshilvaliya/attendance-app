import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getHolidaysData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { HolidaysTable } from "@/components/dashboard/holidays-table";
import { HolidayCalendar } from "@/components/dashboard/holiday-calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddHolidayDialog } from "@/components/dashboard/add-holiday-dialog";

export default function HolidaysPage() {
  const holidays = getHolidaysData();

  // Count upcoming holidays (from today)
  const today = new Date();
  const upcomingHolidays = holidays.filter((holiday) => {
    const holidayDate = new Date(holiday.date);
    return holidayDate >= today;
  });

  // Get next holiday
  const nextHoliday = upcomingHolidays.length > 0 ? upcomingHolidays[0] : null;

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Holidays</h1>
            <p className="text-muted-foreground">
              Manage company holidays and events
            </p>
          </div>
          <AddHolidayDialog>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Holiday
            </Button>
          </AddHolidayDialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Holidays
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{holidays.length}</div>
              <p className="text-xs text-muted-foreground">
                For the current year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Holidays
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {upcomingHolidays.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Remaining this year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Next Holiday
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {nextHoliday ? nextHoliday.name : "None"}
              </div>
              <p className="text-xs text-muted-foreground">
                {nextHoliday
                  ? new Date(nextHoliday.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "No upcoming holidays"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Holidays</CardTitle>
                <CardDescription>
                  View and manage all company holidays
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HolidaysTable holidays={holidays} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Holiday Calendar</CardTitle>
                <CardDescription>
                  View holidays in calendar format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HolidayCalendar holidays={holidays} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
