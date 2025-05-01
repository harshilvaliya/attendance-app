"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getEmployeesData } from "@/lib/data"
import { CheckCircle2, Clock, XCircle } from "lucide-react"

interface AttendanceTableProps {
  showDate?: boolean
}

export function AttendanceTable({ showDate = false }: AttendanceTableProps) {
  const employees = getEmployeesData().slice(0, 8)

  // Generate random attendance data for demo purposes
  const getRandomStatus = () => {
    const random = Math.random()
    if (random < 0.8) return "present"
    if (random < 0.9) return "late"
    return "absent"
  }

  const getRandomTime = (status: string) => {
    if (status === "absent") return "-"
    if (status === "late") {
      const hour = Math.floor(Math.random() * 3) + 10 // 10 AM to 12 PM
      const minute = Math.floor(Math.random() * 60)
      return `${hour}:${minute.toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`
    }
    const hour = Math.floor(Math.random() * 2) + 8 // 8 AM to 9 AM
    const minute = Math.floor(Math.random() * 60)
    return `${hour}:${minute.toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`
  }

  const getRandomDate = () => {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 7))
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            {showDate && <TableHead>Date</TableHead>}
            <TableHead>Check In</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => {
            const status = getRandomStatus()
            return (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.department}</TableCell>
                {showDate && <TableCell>{getRandomDate()}</TableCell>}
                <TableCell>{getRandomTime(status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {status === "present" && (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400"
                        >
                          Present
                        </Badge>
                      </>
                    )}
                    {status === "late" && (
                      <>
                        <Clock className="h-4 w-4 text-orange-500" />
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-700 hover:bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400"
                        >
                          Late
                        </Badge>
                      </>
                    )}
                    {status === "absent" && (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 hover:bg-red-50 dark:bg-red-900/20 dark:text-red-400"
                        >
                          Absent
                        </Badge>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
