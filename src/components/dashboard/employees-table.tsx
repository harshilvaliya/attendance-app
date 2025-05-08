"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2, UserCircle, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  joinDate: string;
  status: string;
}

interface EmployeesTableProps {
  employees: Employee[];
  onDelete?: (id: string) => void;
}

type SortField = "name" | "position" | "department" | "joinDate" | "tenure" | "status";
type SortDirection = "asc" | "desc" | "default";

export function EmployeesTable({ employees: initialEmployees, onDelete }: EmployeesTableProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("default");
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const calculateTenure = (joinDateString: string) => {
    const joinDate = new Date(joinDateString);
    const today = new Date();

    let years = today.getFullYear() - joinDate.getFullYear();
    const months = today.getMonth() - joinDate.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < joinDate.getDate())) {
      years--;
    }

    return years;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: default -> asc -> desc -> default
      if (sortDirection === "default") {
        setSortDirection("asc");
      } else if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortDirection("default");
      }
    } else {
      // Set new field and default to default sorting
      setSortField(field);
      setSortDirection("default");
    }
  };

  // Get sort icon based on current sort state
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    
    if (sortDirection === "default") {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  // Sort employees based on current sort field and direction
  const sortedEmployees = [...employees].sort((a, b) => {
    // If default sorting, return employees as is
    if (sortDirection === "default") {
      return 0; // No sorting applied
    }
    
    const multiplier = sortDirection === "asc" ? 1 : -1;

    switch (sortField) {
      case "name":
        return multiplier * a.name.localeCompare(b.name);
      case "position":
        return multiplier * a.position.localeCompare(b.position);
      case "department":
        return multiplier * a.department.localeCompare(b.department);
      case "status":
        return multiplier * a.status.localeCompare(b.status);
      case "joinDate":
        return (
          multiplier *
          (new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime())
        );
      case "tenure":
        return (
          multiplier *
          (calculateTenure(a.joinDate) - calculateTenure(b.joinDate))
        );
      default:
        return 0;
    }
  });

  const handleEdit = (id: string) => {
    toast({
      title: "Edit employee",
      description: "This would open an edit dialog in a real application",
    });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      if (onDelete) {
        // Use the provided onDelete function if available
        onDelete(deleteId);
      } else {
        // Otherwise, just update the local state
        setEmployees(employees.filter((employee) => employee.id !== deleteId));
        
        toast({
          title: "Employee deleted",
          description: "The employee has been removed from the directory",
        });
      }

      setDeleteId(null);
    }
  };

  const handleViewProfile = (employee: Employee) => {
    setViewEmployee(employee);
  };

  const handleViewAttendance = (id: string) => {
    toast({
      title: "View attendance",
      description: "This would navigate to the employee's attendance records",
    });
  };

  const handleViewLeaveHistory = (id: string) => {
    toast({
      title: "View leave history",
      description: "This would navigate to the employee's leave history",
    });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="flex items-center p-0 font-medium"
                >
                  Name
                  {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("position")}
                  className="flex items-center p-0 font-medium"
                >
                  Position
                  {getSortIcon("position")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("department")}
                  className="flex items-center p-0 font-medium"
                >
                  Department
                  {getSortIcon("department")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("joinDate")}
                  className="flex items-center p-0 font-medium"
                >
                  Join Date
                  {getSortIcon("joinDate")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("tenure")}
                  className="flex items-center p-0 font-medium"
                >
                  Tenure
                  {getSortIcon("tenure")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="flex items-center p-0 font-medium"
                >
                  Status
                  {getSortIcon("status")}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              sortedEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{formatDate(employee.joinDate)}</TableCell>
                  <TableCell>{calculateTenure(employee.joinDate)} years</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        employee.status === "Active"
                          ? "bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-50 text-red-700 hover:bg-red-50 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(employee.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewProfile(employee)}>
                          <UserCircle className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewAttendance(employee.id)}>
                          View Attendance
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewLeaveHistory(employee.id)}>
                          View Leave History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(employee.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the employee from the directory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={viewEmployee !== null} onOpenChange={(open) => !open && setViewEmployee(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Employee Profile</DialogTitle>
            <DialogDescription>Detailed information about the employee</DialogDescription>
          </DialogHeader>
          {viewEmployee && (
            <div className="py-4 space-y-4">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                  <UserCircle className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-base">{viewEmployee.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Position</p>
                  <p className="text-base">{viewEmployee.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="text-base">{viewEmployee.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                  <p className="text-base">{formatDate(viewEmployee.joinDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tenure</p>
                  <p className="text-base">{calculateTenure(viewEmployee.joinDate)} years</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge
                    variant="outline"
                    className={`${
                      viewEmployee.status === "Active"
                        ? "bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-50 text-red-700 hover:bg-red-50 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    {viewEmployee.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
