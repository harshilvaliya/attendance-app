"use client";

import Calendar from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { DateValue } from "react-aria-components";

interface Holiday {
  id: number | string;
  name: string;
  date: {
    start: string;
    end: string;
  };
  type: string;
}

interface HolidayCalendarProps {
  holidays: Holiday[];
}

export function HolidayCalendar({ holidays }: HolidayCalendarProps) {
  const now = today(getLocalTimeZone());
  const todayDate = new Date();
  
  // Format today's date to match the API date format (YYYY-MM-DD)
  const todayFormatted = todayDate.toISOString().split('T')[0];
  
  // Filter holidays that are active today
  const todayHolidays = holidays.filter(holiday => {
    const startDate = new Date(holiday.date.start);
    const endDate = holiday.date.end ? new Date(holiday.date.end) : startDate;
    
    // Reset hours to compare dates only
    const start = new Date(startDate.setHours(0, 0, 0, 0));
    const end = new Date(endDate.setHours(0, 0, 0, 0));
    const today = new Date(todayDate.setHours(0, 0, 0, 0));
    
    // Check if today is between start and end dates (inclusive)
    return today >= start && today <= end;
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[1fr_300px]">
        <div className="rounded-md border p-2">
          <Calendar
            value={now}
            mode="single"
            disabled={true} // Disable date selection
            className="opacity-80" // Make it look disabled
          />
        </div>

        <div className="rounded-md border p-4">
          <div className="flex items-center gap-2 font-medium">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {todayDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium">Today's Holidays:</h4>
            {todayHolidays.length > 0 ? (
              <div className="mt-2 space-y-2">
                {todayHolidays.map((holiday) => (
                  <div
                    key={holiday.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <span className="font-medium">{holiday.name}</span>
                    <Badge variant="outline">{holiday.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                No holidays today
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
