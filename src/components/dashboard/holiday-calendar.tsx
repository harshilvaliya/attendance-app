"use client"

import Calendar from "@/components/ui/calendar"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import { getLocalTimeZone, today } from "@internationalized/date"
import type { DateRange } from "react-aria-components"

interface Holiday {
  id: number
  name: string
  date: {
    start: string
    end: string
  }
  type: string
}

interface HolidayCalendarProps {
  holidays: Holiday[]
}

export function HolidayCalendar({ holidays }: HolidayCalendarProps) {
  const now = today(getLocalTimeZone())
  const [date, setDate] = useState<DateRange | null>({
    start: now,
    end: now,
  })

  // Create a map of dates to holiday names for easy lookup
  const holidayMap = holidays.reduce(
    (acc, holiday) => {
      const startDate = new Date(holiday.date.start)
      const endDate = new Date(holiday.date.end)
      
      // Add all dates in the range to the map
      const currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        const dateStr = currentDate.toDateString()
        if (!acc[dateStr]) {
          acc[dateStr] = []
        }
        acc[dateStr].push(holiday)
        currentDate.setDate(currentDate.getDate() + 1)
      }
      return acc
    },
    {} as Record<string, Holiday[]>,
  )

  // Get holidays for the selected date
  const selectedDateStr = date?.start ? new Date(date.start.toString()).toDateString() : ""
  const selectedDateHolidays = holidayMap[selectedDateStr] || []

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[1fr_300px]">
        <div className="rounded-md border p-2">
          <Calendar
            value={date}
            onChange={setDate}
            mode="single"
          />
        </div>

        <div className="rounded-md border p-4">
          <div className="flex items-center gap-2 font-medium">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {date?.start
                ? new Date(date.start.toString()).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Select a date"}
            </span>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium">Holidays:</h4>
            {selectedDateHolidays.length > 0 ? (
              <div className="mt-2 space-y-2">
                {selectedDateHolidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center justify-between rounded-md border p-2">
                    <span className="font-medium">{holiday.name}</span>
                    <Badge variant="outline">{holiday.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No holidays on this date</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
