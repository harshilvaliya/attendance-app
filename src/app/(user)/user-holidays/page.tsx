"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Holiday {
  id: string;
  name: string;
  date: string;
  startDate?: string;
  endDate?: string;
  isDateRange?: boolean;
  type?: string;
}

export default function HolidayPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/holidays`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch holidays");
        }

        const data = await response.json();
        console.log("API Response:", data);

        // Transform the data to match our interface
        const formattedHolidays = data.data.map((holiday: any) => ({
          id: holiday._id || holiday.id,
          name: holiday.name,
          date: holiday.startDate, // Use startDate as the primary date
          startDate: holiday.startDate,
          endDate: holiday.endDate,
          isDateRange: holiday.isDateRange,
          type: holiday.type
        }));

        setHolidays(formattedHolidays);
        setError(null);
      } catch (err) {
        console.error("Error fetching holidays:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to fetch holidays",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [toast]);

  // Sort holidays by date
  const sortedHolidays = [...holidays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get upcoming holidays (from today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingHolidays = sortedHolidays.filter(
    (holiday) => new Date(holiday.date) >= today
  );
  const pastHolidays = sortedHolidays.filter(
    (holiday) => new Date(holiday.date) < today
  );

  // Helper function to format date display
  const formatDate = (holiday: Holiday) => {
    if (holiday.isDateRange && holiday.startDate && holiday.endDate) {
      return `${new Date(holiday.startDate).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
      })} - ${new Date(holiday.endDate).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`;
    }
    
    return new Date(holiday.date).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 space-y-8 max-w-7xl min-h-screen">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Holidays
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          View upcoming and past holiday schedules
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Holidays
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingHolidays.length}</div>
            <p className="text-xs text-muted-foreground">
              Holidays remaining this year
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Holidays</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastHolidays.length}</div>
            <p className="text-xs text-muted-foreground">Holidays this year</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="py-6">
            <p className="text-center text-red-500">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Upcoming Holidays</h2>
          <div className="space-y-4">
            {upcomingHolidays.length === 0 ? (
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="py-6">
                  <p className="text-center text-muted-foreground">
                    No upcoming holidays
                  </p>
                </CardContent>
              </Card>
            ) : (
              upcomingHolidays.map((holiday) => (
                <Card
                  key={holiday.id}
                  className="shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <CardHeader className="py-3 flex flex-row items-center space-y-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base font-medium">
                        {holiday.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(holiday)}
                      </p>
                      {holiday.type && (
                        <span className="inline-block px-2 py-0.5 mt-1 text-xs rounded-full bg-muted">
                          {holiday.type}
                        </span>
                      )}
                    </div>
                    <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {Math.ceil(
                        (new Date(holiday.date).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>

          <h2 className="text-lg font-semibold pt-4">Past Holidays</h2>
          <div className="space-y-4">
            {pastHolidays.length === 0 ? (
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="py-6">
                  <p className="text-center text-muted-foreground">
                    No past holidays
                  </p>
                </CardContent>
              </Card>
            ) : (
              pastHolidays.map((holiday) => (
                <Card
                  key={holiday.id}
                  className="shadow-sm hover:shadow-md transition-shadow overflow-hidden opacity-80"
                >
                  <CardHeader className="py-3 flex flex-row items-center space-y-0">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-medium">
                        {holiday.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(holiday)}
                      </p>
                      {holiday.type && (
                        <span className="inline-block px-2 py-0.5 mt-1 text-xs rounded-full bg-muted">
                          {holiday.type}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function HolidayCard({
  holiday,
  isPast = false,
}: {
  holiday: any;
  isPast?: boolean;
}) {
  const holidayDate = new Date(holiday.date);
  const formattedDate = holidayDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate days remaining
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysRemaining = Math.ceil(
    (holidayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card
      className={`card-hover overflow-hidden border-border/40 ${
        isPast ? "opacity-80" : ""
      }`}
    >
      <CardHeader className="py-3 flex flex-row items-center space-y-0">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div>
          <CardTitle className="text-base font-medium">
            {holiday.name}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formattedDate}
          </p>
        </div>
      </CardHeader>
      <CardContent className="py-2 pt-0 pl-16">
        {!isPast && daysRemaining > 0 && (
          <p
            className={`text-xs font-medium ${
              daysRemaining <= 7 ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {daysRemaining === 1
              ? "Tomorrow"
              : `${daysRemaining} days remaining`}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
