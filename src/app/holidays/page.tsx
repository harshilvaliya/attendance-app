"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { HolidaysTable } from "@/components/dashboard/holidays-table";
import { HolidayCalendar } from "@/components/dashboard/holiday-calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddHolidayDialog } from "@/components/dashboard/add-holiday-dialog";

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      // Get the token from localStorage or wherever you store it
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/holidays`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch holidays");
      }

      const data = await response.json();

      // Transform the data to match the expected format
      const formattedHolidays = data.data.map((holiday) => ({
        id: holiday._id,
        name: holiday.name,
        date: {
          start: holiday.startDate,
          end: holiday.endDate || holiday.startDate,
        },
        type: holiday.type,
      }));

      setHolidays(formattedHolidays);
    } catch (err) {
      console.error("Error fetching holidays:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // Count upcoming holidays (from today)
  const today = new Date();
  const upcomingHolidays = holidays.filter((holiday) => {
    const holidayStartDate = new Date(holiday.date.start);
    return holidayStartDate >= today;
  });

  // Get next holiday
  const nextHoliday = upcomingHolidays.length > 0 ? upcomingHolidays[0] : null;

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 px-2 sm:px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Holidays</h1>
            <p className="text-muted-foreground">
              Manage company holidays and events
            </p>
          </div>
          <AddHolidayDialog>
            <Button className="gap-2 w-full md:w-auto">
              <PlusCircle className="h-4 w-4" />
              Add Holiday
            </Button>
          </AddHolidayDialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p>Loading holidays...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
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
                      ? new Date(nextHoliday.date.start).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "No upcoming holidays"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="list" className="space-y-4">
              <TabsList className="w-full flex flex-col sm:flex-row">
                <TabsTrigger value="list" className="flex-1">
                  List View
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex-1">
                  Calendar View
                </TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Holidays</CardTitle>
                    <CardDescription>
                      View and manage all company holidays
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto p-0">
                    <div className="min-w-[320px]">
                      <HolidaysTable
                        holidays={holidays}
                        onHolidaysChange={fetchHolidays}
                      />
                    </div>
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
                  <CardContent className="overflow-x-auto p-0">
                    <div className="min-w-[320px]">
                      <HolidayCalendar holidays={holidays} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
