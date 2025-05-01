"use client";

import type React from "react";

import { useState } from "react";
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
import { getEmployeesData } from "@/lib/data";
import { Check, Search, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

export function MarkAttendanceDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Record<number, string>>(
    {}
  );
  const { toast } = useToast();

  const employees = getEmployeesData();

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Count statuses
    const statusCounts = Object.values(selectedStatus).reduce((acc, status) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    toast({
      title: "Attendance marked successfully",
      description: `Present: ${statusCounts.present || 0}, Absent: ${
        statusCounts.absent || 0
      }, Late: ${statusCounts.late || 0}`,
    });

    setOpen(false);
    setSelectedStatus({});
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
            <DialogDescription>
              Mark attendance for employees for{" "}
              {new Date().toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex flex-col space-y-2 border-b pb-4"
                  >
                    <Label className="font-medium">{employee.name}</Label>
                    <div className="text-sm text-muted-foreground">
                      {employee.department}
                    </div>
                    <RadioGroup
                      value={selectedStatus[employee.id] || ""}
                      onValueChange={(value) =>
                        setSelectedStatus((prev) => ({
                          ...prev,
                          [employee.id]: value,
                        }))
                      }
                    >
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="present"
                            id={`present-${employee.id}`}
                          />
                          <Label
                            htmlFor={`present-${employee.id}`}
                            className="flex items-center"
                          >
                            <Check className="mr-1 h-3 w-3 text-green-500" />
                            Present
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="absent"
                            id={`absent-${employee.id}`}
                          />
                          <Label
                            htmlFor={`absent-${employee.id}`}
                            className="flex items-center"
                          >
                            <X className="mr-1 h-3 w-3 text-red-500" />
                            Absent
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="late"
                            id={`late-${employee.id}`}
                          />
                          <Label
                            htmlFor={`late-${employee.id}`}
                            className="flex items-center"
                          >
                            <Search className="mr-1 h-3 w-3 text-orange-500" />
                            Late
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Attendance</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
