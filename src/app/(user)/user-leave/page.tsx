"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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

import { FileText, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Leave {
  id: string;
  type: string;
  from: string;
  to: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  document?: string;
}

interface LeaveFormData {
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  document?: File;
}

function LeaveFormDialogContent({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();
  const [formData, setFormData] = useState<LeaveFormData>({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const leaveTypes = [
    "Annual",
    "Sick",
    "Maternity",
    "Paternity",
    "Unpaid",
    "Other",
  ];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        document: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("leaveType", formData.leaveType);
      formDataToSend.append("fromDate", formData.fromDate);
      formDataToSend.append("toDate", formData.toDate);
      formDataToSend.append("reason", formData.reason);
      if (formData.document) {
        formDataToSend.append("document", formData.document);
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/leave-form`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formDataToSend,
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit leave form");
      }
      setLoading(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="leaveType">Leave Type</Label>
        <Select
          value={formData.leaveType}
          onValueChange={(val) =>
            setFormData((f) => ({ ...f, leaveType: val }))
          }
        >
          <SelectTrigger id="leaveType" className="w-full">
            <SelectValue placeholder="Select leave type" />
          </SelectTrigger>
          <SelectContent>
            {leaveTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fromDate">From Date</Label>
          <Input
            id="fromDate"
            name="fromDate"
            type="date"
            value={formData.fromDate}
            onChange={handleInputChange}
            required
            min={(() => {
              const date = new Date();
              date.setDate(date.getDate() + 2);
              return date.toISOString().split("T")[0];
            })()}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="toDate">To Date</Label>
          <Input
            id="toDate"
            name="toDate"
            type="date"
            value={formData.toDate}
            onChange={handleInputChange}
            required
            min={formData.fromDate}
            className="w-full"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleInputChange}
          required
          minLength={10}
          maxLength={500}
          rows={4}
          placeholder="Enter your reason (10-500 characters)"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="document">Supporting Document (Optional)</Label>
        <Input
          id="document"
          name="document"
          type="file"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.webp, .pdf"
          className="w-full"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Accepted formats: JPG, PNG, WebP & PDF
        </p>
      </div>
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit Leave Request"}
      </Button>
    </form>
  );
}

export default function LeavePage() {
  const [open, setOpen] = useState(false);
  const [pendingLeaves, setPendingLeaves] = useState<Leave[]>([]);
  const [leaveHistory, setLeaveHistory] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLeaveData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/leave-forms`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch leave data");
      }

      const data = await response.json();

      // Transform the data to match our interface
      const formattedLeaves = data.data.map((leave: any) => ({
        id: leave._id,
        type: leave.leaveType,
        from: leave.fromDate,
        to: leave.toDate,
        status: leave.status.toLowerCase(),
        reason: leave.reason,
        document: leave.document,
      }));

      // Separate pending leaves from leave history
      const pending = formattedLeaves.filter(
        (leave: Leave) => leave.status === "pending"
      );
      const history = formattedLeaves.filter(
        (leave: Leave) => leave.status !== "pending"
      );

      setPendingLeaves(pending);
      setLeaveHistory(history);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to fetch leave data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const handleLeaveSubmitSuccess = () => {
    setOpen(false);
    fetchLeaveData(); // Refresh data after successful submission
    toast({
      title: "Success",
      description: "Your leave request has been submitted for approval",
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 space-y-8 max-w-7xl min-h-screen">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Leave Management
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your leave requests and view history
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
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

        <Card className="shadow-sm hover:shadow-md transition-shadow">
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

      <div className="flex justify-center sm:justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Apply for Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] w-[calc(100%-2rem)] p-4 sm:p-6 rounded-lg max-h-[90vh] overflow-y-auto">
            <LeaveFormDialogContent onSuccess={handleLeaveSubmitSuccess} />
          </DialogContent>
        </Dialog>
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
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Leave History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No leave history found
                </p>
              ) : (
                leaveHistory.map((leave) => (
                  <div
                    key={leave.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg space-y-2 sm:space-y-0"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{leave.type}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(leave.from).toLocaleDateString()} -{" "}
                        {new Date(leave.to).toLocaleDateString()}
                      </div>
                      <div className="text-sm">{leave.reason}</div>
                    </div>
                    <div
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium self-start sm:self-center",
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
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {pendingLeaves.length > 0 && (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg space-y-2 sm:space-y-0"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{leave.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(leave.from).toLocaleDateString()} -{" "}
                      {new Date(leave.to).toLocaleDateString()}
                    </div>
                    <div className="text-sm">{leave.reason}</div>
                  </div>
                  <div
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium self-start sm:self-center",
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    )}
                  >
                    Pending
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
