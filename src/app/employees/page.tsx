import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getEmployeesData } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"
import { EmployeesTable } from "@/components/dashboard/employees-table"
import { Input } from "@/components/ui/input"
import { AddEmployeeDialog } from "@/components/dashboard/add-employee-dialog"

export default function EmployeesPage() {
  const employees = getEmployeesData()

  // Count employees by department
  const departmentCounts = employees.reduce(
    (acc, employee) => {
      acc[employee.department] = (acc[employee.department] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Get top 3 departments
  const topDepartments = Object.entries(departmentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">Manage employee profiles and information</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search employees..." className="w-full pl-8 md:w-[300px]" />
            </div>
            <AddEmployeeDialog>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Employee
              </Button>
            </AddEmployeeDialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
              <p className="text-xs text-muted-foreground">Active employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(departmentCounts).length}</div>
              <p className="text-xs text-muted-foreground">Across the organization</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Largest Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topDepartments[0]?.[0] || "None"}</div>
              <p className="text-xs text-muted-foreground">{topDepartments[0]?.[1] || 0} employees</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee Directory</CardTitle>
            <CardDescription>View and manage all employees</CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeesTable employees={employees} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
