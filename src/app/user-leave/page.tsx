"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Calendar from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, FileText, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface Leave {
  id: number;
  type: string;
  from: string;
  to: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  document?: string;
}

// Mock data for leave requests
const pendingLeaves: Leave[] = [
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

const leaveHistory: Leave[] = [
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
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [reason, setReason] = useState("");
  const [document, setDocument] = useState<File>();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !leaveType || !fromDate || !toDate || !reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Leave request submitted",
      description: "Your leave request has been submitted for approval",
    });

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setLeaveType("");
    setFromDate(undefined);
    setToDate(undefined);
    setReason("");
    setDocument(undefined);
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Leave Management
          </h1>
          <p className="text-muted-foreground">
            Manage your leave requests and view history
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Leaves
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingLeaves.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Used Leaves</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  leaveHistory.filter((leave) => leave.status === "approved")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">Approved requests</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Apply for Leave</DialogTitle>
                  <DialogDescription>
                    Submit a new leave request for approval
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="type">Leave Type</Label>
                    <Select value={leaveType} onValueChange={setLeaveType}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="vacation">Vacation</SelectItem>
                        <SelectItem value="personal">Personal Leave</SelectItem>
                        <SelectItem value="maternity">
                          Maternity Leave
                        </SelectItem>
                        <SelectItem value="paternity">
                          Paternity Leave
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>From Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !fromDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fromDate ? (
                            format(fromDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={fromDate}
                          onSelect={setFromDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid gap-2">
                    <Label>To Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !toDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {toDate ? (
                            format(toDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={toDate}
                          onSelect={setToDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason for Leave</Label>
                    <Textarea
                      id="reason"
                      placeholder="Enter the reason for your leave"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="document">Upload Document</Label>
                    <Input
                      id="document"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setDocument(e.target.files?.[0])}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Submit Request</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Leave History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveHistory.map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{leave.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(leave.from).toLocaleDateString()} -{" "}
                      {new Date(leave.to).toLocaleDateString()}
                    </div>
                    <div className="text-sm">{leave.reason}</div>
                  </div>
                  <div
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      leave.status === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : leave.status === "rejected"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    )}
                  >
                    {leave.status.charAt(0).toUpperCase() +
                      leave.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
