"use client"

import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"

interface Holiday {
  id: number
  name: string
  date: string
  type: string
}

interface HolidayCalendarProps {
  holidays: Holiday[]
}

export function HolidayCalendar({ holidays }: HolidayCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Create a map of dates to holiday names for easy lookup
  const holidayMap = holidays.reduce(
    (acc, holiday) => {
      const date = new Date(holiday.date).toDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(holiday)
      return acc
    },
    {} as Record<string, Holiday[]>,
  )

  // Function to render the day cell with holiday indicator
  const renderDay = (day: Date) => {
    const date = day.toDateString()
    const holidaysOnDay = holidayMap[date] || []
    const isHoliday = holidaysOnDay.length > 0

    return (
      <div className="relative h-9 w-9 p-0 flex items-center justify-center">
        <span>{day.getDate()}</span>
        {isHoliday && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
            <div className="h-1 w-1 rounded-full bg-primary"></div>
          </div>
        )}
      </div>
    )
  }

  // Get holidays for the selected date
  const selectedDateStr = date?.toDateString() || ""
  const selectedDateHolidays = holidayMap[selectedDateStr] || []

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[1fr_300px]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          components={{
            Day: ({ day, ...props }) => <button {...props}>{renderDay(day)}</button>,
          }}
        />

        <div className="rounded-md border p-4">
          <div className="flex items-center gap-2 font-medium">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {date?.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
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
