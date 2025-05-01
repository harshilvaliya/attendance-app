"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface LeaveRequest {
  id: number
  employee: string
  type: string
  from: string
  to: string
  status: string
}

interface LeaveRequestsTableProps {
  requests: LeaveRequest[]
}

export function LeaveRequestsTable({ requests: initialRequests }: LeaveRequestsTableProps) {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests)
  const { toast } = useToast()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

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
        )
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400"
          >
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 hover:bg-red-50 dark:bg-red-900/20 dark:text-red-400"
          >
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  const handleApprove = (id: number) => {
    setRequests(requests.map((request) => (request.id === id ? { ...request, status: "approved" } : request)))

    toast({
      title: "Request approved",
      description: "The leave request has been approved successfully",
    })
  }

  const handleReject = (id: number) => {
    setRequests(requests.map((request) => (request.id === id ? { ...request, status: "rejected" } : request)))

    toast({
      title: "Request rejected",
      description: "The leave request has been rejected",
    })
  }

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
            {requests[0]?.status === "pending" && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.employee}</TableCell>
              <TableCell>{request.type}</TableCell>
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
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Approve</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 text-red-600"
                      onClick={() => handleReject(request.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Reject</span>
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
