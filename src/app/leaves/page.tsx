"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaveRequestsTable } from "@/components/dashboard/leave-requests-table";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface LeaveRequest {
  id: string;
  employee: string;
  type: string;
  description: string;
  document: string | null;
  from: string;
  to: string;
  status: string;
}

interface LeaveData {
  pending: LeaveRequest[];
  approved: LeaveRequest[];
  rejected: LeaveRequest[];
}

interface SortParams {
  sortBy: string;
  order: "asc" | "desc";
}

const mapLeaveData = (data: any[]): LeaveRequest[] =>
  data.map((l: any) => ({
    id: l._id,
    employee: l.user?.email ?? "N/A",
    type: l.leaveType,
    description: l.reason,
    document: l.document ?? null,
    from: l.fromDate,
    to: l.toDate,
    status: l.status?.toLowerCase() ?? "pending",
  }));

export default function LeavesPage() {
  const [leaveData, setLeaveData] = useState<LeaveData>({
    pending: [],
    approved: [],
    rejected: [],
  });
  const [loading, setLoading] = useState(false);
  const [sortParams, setSortParams] = useState<SortParams>({
    sortBy: "createdAt",
    order: "desc",
  });
  const { toast } = useToast();

  const fetchLeaveRequests = useCallback(async () => {
    // setLoading(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";

      // Add sort parameters to the API request
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/all-leave-forms?sortBy=${sortParams.sortBy}&order=${sortParams.order}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data.data ?? [];

      const mappedData = mapLeaveData(data);

      setLeaveData({
        pending: mappedData.filter((l) => l.status === "pending"),
        approved: mappedData.filter((l) => l.status === "approved"),
        rejected: mappedData.filter((l) => l.status === "rejected"),
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch leave requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, sortParams]);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  // Handle sorting from the table component
  const handleSort = (field: string, direction: string) => {
    setSortParams({
      sortBy: field,
      order: direction as "asc" | "desc",
    });
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Leave Requests
            </h1>
            <p className="text-muted-foreground">
              Manage employee leave requests
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaveData.pending.length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaveData.approved.length}
              </div>
              <p className="text-xs text-muted-foreground">
                In the last 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaveData.rejected.length}
              </div>
              <p className="text-xs text-muted-foreground">
                In the last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>
                  Review and manage pending leave requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LeaveRequestsTable
                  requests={leaveData.pending}
                  loading={loading}
                  onAction={fetchLeaveRequests}
                  onSort={handleSort}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="approved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Approved Requests</CardTitle>
                <CardDescription>
                  View previously approved leave requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LeaveRequestsTable
                  requests={leaveData.approved}
                  loading={loading}
                  onSort={handleSort}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="rejected" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Requests</CardTitle>
                <CardDescription>
                  View previously rejected leave requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LeaveRequestsTable
                  requests={leaveData.rejected}
                  loading={loading}
                  onSort={handleSort}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
