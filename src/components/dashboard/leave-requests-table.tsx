"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import axios from "axios";

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

interface LeaveRequestsTableProps {
  requests: LeaveRequest[];
  loading?: boolean;
  onAction?: () => void;
}

export function LeaveRequestsTable({
  requests: initialRequests,
  loading = false,
  onAction,
}: LeaveRequestsTableProps) {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 hover:bg-red-50 dark:bg-red-900/20 dark:text-red-400"
          >
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);
      const token = localStorage.getItem("token");

      axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/leave-form/${id}`,
        { status: "approved" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setRequests(
        requests.map((request) =>
          request.id === id ? { ...request, status: "approved" } : request
        )
      );

      toast({
        title: "Request approved",
        description: "The leave request has been approved successfully",
      });

      // Refresh data from parent component
      if (onAction) {
        onAction();
      }
    } catch (error) {
      console.error("Error approving leave request:", error);
      toast({
        title: "Error",
        description: "Failed to approve leave request",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessingId(id);
      const token = localStorage.getItem("token");

      axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/leave-form/${id}`,
        { status: "rejected" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setRequests(
        requests.map((request) =>
          request.id === id ? { ...request, status: "rejected" } : request
        )
      );

      toast({
        title: "Request rejected",
        description: "The leave request has been rejected",
      });

      // Refresh data from parent component
      if (onAction) {
        onAction();
      }
    } catch (error) {
      console.error("Error rejecting leave request:", error);
      toast({
        title: "Error",
        description: "Failed to reject leave request",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Status</TableHead>
            {requests[0]?.status === "pending" && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Loading leave requests...
              </TableCell>
            </TableRow>
          ) : requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No leave requests found
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.employee}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0 h-auto">
                        {request.type}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Leave Request Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Type</h4>
                          <p>{request.type}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Description</h4>
                          <p className="text-muted-foreground">
                            {request.description}
                          </p>
                        </div>
                        {request.document && (
                          <div>
                            <Button asChild variant="outline" className="gap-2">
                              <Link href={`/leaves/document/${request.id}`}>
                                <FileText className="h-4 w-4" />
                                View Document
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>{formatDate(request.from)}</TableCell>
                <TableCell>{formatDate(request.to)}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                {request.status === "pending" && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-green-600"
                        onClick={() => handleApprove(request.id)}
                        disabled={processingId === request.id}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleReject(request.id)}
                        disabled={processingId === request.id}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
