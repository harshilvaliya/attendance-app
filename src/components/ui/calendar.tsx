"use client";

import { useState } from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { DateRange } from "react-aria-components";

import { RangeCalendar } from "@/components/ui/calendar-rac";

interface CalendarProps {
  value?: DateRange | null;
  onChange?: (date: DateRange | null) => void;
  mode?: "single" | "range";
}

export default function Calendar({
  value,
  onChange,
  mode = "single",
}: CalendarProps) {
  const now = today(getLocalTimeZone());
  const [date, setDate] = useState<DateRange | null>(
    value || {
      start: now,
      end: mode === "range" ? now.add({ days: 3 }) : now,
    }
  );

  const handleDateChange = (newDate: DateRange | null) => {
    setDate(newDate);
    if (onChange) {
      onChange(newDate);
    }
  };

  return (
    <div>
      <RangeCalendar
        className="rounded-md border p-2"
        value={date}
        onChange={handleDateChange}
      />
    </div>
  );
}
