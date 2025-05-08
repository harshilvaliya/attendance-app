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
import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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
import { EditHolidayDialog } from "./edit-holiday-dialog";

interface Holiday {
  id: number;
  name: string;
  date: {
    start: string;
    end: string;
  };
  type: string;
}

interface HolidaysTableProps {
  holidays: Holiday[];
  onHolidaysChange?: () => void;
}

type SortField = "name" | "date" | "type";
type SortDirection = "asc" | "desc" | "default";

export function HolidaysTable({
  holidays: initialHolidays,
  onHolidaysChange,
}: HolidaysTableProps) {
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("default");
  const { toast } = useToast();

  const formatDate = (date: { start: string; end: string }) => {
    const startDate = new Date(date.start);
    const endDate = new Date(date.end);

    if (startDate.getTime() === endDate.getTime()) {
      return startDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }

    return `${startDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })} - ${endDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  const isUpcoming = (date: { start: string; end: string }) => {
    const today = new Date();
    const holidayStartDate = new Date(date.start);
    return holidayStartDate >= today;
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

  // Sort holidays based on current sort field and direction
  const sortedHolidays = [...holidays].sort((a, b) => {
    // If default sorting, return holidays as is (sorted by ID or original order)
    if (sortDirection === "default") {
      return 0; // No sorting applied
    }
    
    const multiplier = sortDirection === "asc" ? 1 : -1;

    switch (sortField) {
      case "name":
        return multiplier * a.name.localeCompare(b.name);
      case "type":
        return multiplier * a.type.localeCompare(b.type);
      case "date":
      default:
        return (
          multiplier *
          (new Date(a.date.start).getTime() - new Date(b.date.start).getTime())
        );
    }
  });

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      setIsDeleting(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/holiday/${deleteId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to delete holiday");
        }

        // Update local state
        setHolidays(holidays.filter((holiday) => holiday.id !== deleteId));

        toast({
          title: "Holiday deleted",
          description: "The holiday has been removed from the calendar",
        });

        // Call the parent callback if provided
        if (onHolidaysChange) {
          onHolidaysChange();
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to delete holiday",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
        setDeleteId(null);
      }
    }
  };

  const handleHolidayUpdated = () => {
    // Call the parent callback if provided
    if (onHolidaysChange) {
      onHolidaysChange();
    }
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
                  Holiday Name
                  {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("date")}
                  className="flex items-center p-0 font-medium"
                >
                  Date
                  {getSortIcon("date")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("type")}
                  className="flex items-center p-0 font-medium"
                >
                  Type
                  {getSortIcon("type")}
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedHolidays.map((holiday) => (
              <TableRow key={holiday.id}>
                <TableCell className="font-medium">{holiday.name}</TableCell>
                <TableCell>{formatDate(holiday.date)}</TableCell>
                <TableCell>{holiday.type}</TableCell>
                <TableCell>
                  {isUpcoming(holiday.date) ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400"
                    >
                      Upcoming
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
                    >
                      Past
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditHolidayDialog
                      holiday={holiday}
                      onHolidayUpdated={handleHolidayUpdated}
                    >
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </EditHolidayDialog>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 text-red-600"
                      onClick={() => handleDelete(holiday.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              holiday from the calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
