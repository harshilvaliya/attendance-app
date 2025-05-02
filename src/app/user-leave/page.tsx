import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for leave requests
const pendingLeaves = [
  {
    id: 1,
    type: "Sick Leave",
    from: "2023-05-10",
    to: "2023-05-12",
    status: "pending",
    reason: "Medical appointment",
  },
  {
    id: 2,
    type: "Vacation",
    from: "2023-06-15",
    to: "2023-06-20",
    status: "pending",
    reason: "Family vacation",
  },
];

const leaveHistory = [
  {
    id: 3,
    type: "Sick Leave",
    from: "2023-03-05",
    to: "2023-03-07",
    status: "approved",
    reason: "Fever",
  },
  {
    id: 4,
    type: "Personal Leave",
    from: "2023-04-10",
    to: "2023-04-10",
    status: "rejected",
    reason: "Personal work",
  },
  {
    id: 5,
    type: "Vacation",
    from: "2023-02-15",
    to: "2023-02-20",
    status: "approved",
    reason: "Annual vacation",
  },
];

export default function LeavePage() {
  return (
    <div className="container p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 tracking-tight">
        Leave Management
      </h1>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 rounded-full p-1">
          <TabsTrigger value="pending" className="rounded-full">
            Pending
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-full">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 tab-transition">
          {pendingLeaves.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No pending leave requests
            </p>
          ) : (
            pendingLeaves.map((leave, index) => (
              <div
                key={leave.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <LeaveCard leave={leave} />
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 tab-transition">
          {leaveHistory.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No leave history
            </p>
          ) : (
            leaveHistory.map((leave, index) => (
              <div
                key={leave.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <LeaveCard leave={leave} />
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LeaveCard({ leave }: { leave: any }) {
  return (
    <Card className="overflow-hidden card-hover border-border/40">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{leave.type}</CardTitle>
          <Badge
            className={
              leave.status === "pending"
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400"
                : leave.status === "approved"
                ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
            }
          >
            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="text-sm">
          {new Date(leave.from).toLocaleDateString()} -{" "}
          {new Date(leave.to).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{leave.reason}</p>
      </CardContent>
    </Card>
  );
}
