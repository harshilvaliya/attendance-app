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
import { Pencil, Trash2 } from "lucide-react";
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
}

export function HolidaysTable({
  holidays: initialHolidays,
}: HolidaysTableProps) {
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [deleteId, setDeleteId] = useState<number | null>(null);
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

  // Sort holidays by date
  const sortedHolidays = [...holidays].sort((a, b) => {
    return new Date(a.date.start).getTime() - new Date(b.date.start).getTime();
  });

  const handleEdit = (id: number) => {
    toast({
      title: "Edit holiday",
      description: "This would open an edit dialog in a real application",
    });
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setHolidays(holidays.filter((holiday) => holiday.id !== deleteId));

      toast({
        title: "Holiday deleted",
        description: "The holiday has been removed from the calendar",
      });

      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Holiday Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
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
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => handleEdit(holiday.id)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
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
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
