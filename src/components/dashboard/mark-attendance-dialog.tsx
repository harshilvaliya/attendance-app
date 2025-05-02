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
import { Check, Clock, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEmployeesData } from "@/lib/data";

export function MarkAttendanceDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    department: "",
    checkInTime: "",
    checkOutTime: "",
    status: "",
  });
  const { toast } = useToast();

  const employees = getEmployeesData();
  const departments = [...new Set(employees.map((emp) => emp.department))];

  const selectedEmployee = employees.find(
    (emp) => emp.id.toString() === formData.employeeId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.employeeId ||
      !formData.department ||
      !formData.checkInTime ||
      !formData.status
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Attendance marked successfully",
      description: `Employee: ${selectedEmployee?.name}, Status: ${formData.status}`,
    });

    setOpen(false);
    setFormData({
      employeeId: "",
      department: "",
      checkInTime: "",
      checkOutTime: "",
      status: "",
    });
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
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">Employee *</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    employeeId: value,
                    department:
                      employees.find((emp) => emp.id.toString() === value)
                        ?.department || "",
                  }));
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem
                      key={employee.id}
                      value={employee.id.toString()}
                    >
                      {employee.name} ({employee.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="checkInTime">Check In Time *</Label>
              <Input
                id="checkInTime"
                type="time"
                value={formData.checkInTime}
                onChange={(e) =>
                  setFormData({ ...formData, checkInTime: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="checkOutTime">Check Out Time</Label>
              <Input
                id="checkOutTime"
                type="time"
                value={formData.checkOutTime}
                onChange={(e) =>
                  setFormData({ ...formData, checkOutTime: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Status *</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
                required
              >
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="present" id="present" />
                    <Label htmlFor="present" className="flex items-center">
                      <Check className="mr-1 h-3 w-3 text-green-500" />
                      Present
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="absent" id="absent" />
                    <Label htmlFor="absent" className="flex items-center">
                      <X className="mr-1 h-3 w-3 text-red-500" />
                      Absent
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="late" id="late" />
                    <Label htmlFor="late" className="flex items-center">
                      <Clock className="mr-1 h-3 w-3 text-orange-500" />
                      Late
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
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
