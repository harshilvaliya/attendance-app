import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

// Mock data for holidays
const holidays = [
  { id: 1, name: "New Year's Day", date: "2024-01-01" },
  { id: 2, name: "Martin Luther King Jr. Day", date: "2024-01-15" },
  { id: 3, name: "Memorial Day", date: "2024-05-27" },
  { id: 4, name: "Independence Day", date: "2024-07-04" },
  { id: 5, name: "Labor Day", date: "2024-09-02" },
  { id: 6, name: "Thanksgiving Day", date: "2024-11-28" },
  { id: 7, name: "Christmas Day", date: "2024-12-25" },
];

export default function HolidayPage() {
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

  return (
    <div className="container p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 tracking-tight">Holidays</h1>

      <h2 className="text-lg font-semibold mb-4">Upcoming Holidays</h2>
      <div className="space-y-3 mb-8">
        {upcomingHolidays.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            No upcoming holidays
          </p>
        ) : (
          upcomingHolidays.map((holiday, index) => (
            <div
              key={holiday.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <HolidayCard holiday={holiday} />
            </div>
          ))
        )}
      </div>

      <h2 className="text-lg font-semibold mb-4">Past Holidays</h2>
      <div className="space-y-3">
        {pastHolidays.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            No past holidays
          </p>
        ) : (
          pastHolidays.map((holiday, index) => (
            <div
              key={holiday.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <HolidayCard holiday={holiday} isPast />
            </div>
          ))
        )}
      </div>
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
