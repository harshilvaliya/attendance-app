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
                      {new Date(holiday.date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
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
                      {new Date(holiday.date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
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
