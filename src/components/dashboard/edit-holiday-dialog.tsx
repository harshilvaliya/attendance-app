"use client";
import { useState, FormEvent, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HolidayFormData {
  name: string;
  startDate: string;
  endDate?: string;
  isDateRange: boolean;
  type: "National" | "Religious" | "Regional" | "Corporate" | "Other";
}

const holidayTypes: HolidayFormData["type"][] = [
  "National",
  "Religious",
  "Regional",
  "Corporate",
  "Other",
];

interface EditHolidayDialogProps {
  children: React.ReactNode;
  holiday: {
    id: number | string;
    name: string;
    date: {
      start: string;
      end: string;
    };
    type: string;
  };
  onHolidayUpdated: () => void;
}

export function EditHolidayDialog({ 
  children, 
  holiday,
  onHolidayUpdated 
}: EditHolidayDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<HolidayFormData>({
    name: "",
    startDate: "",
    endDate: "",
    isDateRange: false,
    type: "Other",
  });
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  // Initialize form data when holiday prop changes
  useEffect(() => {
    if (holiday) {
      const isDateRange = holiday.date.start !== holiday.date.end;
      setFormData({
        name: holiday.name,
        startDate: holiday.date.start,
        endDate: holiday.date.end || "",
        isDateRange,
        type: (holiday.type as HolidayFormData["type"]) || "Other",
      });
    }
  }, [holiday]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const { name, startDate, endDate, isDateRange } = formData;
    const sDate = new Date(startDate);
    const eDate = endDate ? new Date(endDate) : null;
    
    // Validation
    if (name.length < 3 || name.length > 50)
      return setMessage({
        type: "error",
        text: "Name must be 3–50 characters",
      });
    if (isNaN(sDate.getTime()))
      return setMessage({ type: "error", text: "Invalid start date" });
    if (
      isDateRange &&
      (!endDate || isNaN(eDate!.getTime()) || eDate! < sDate)
    ) {
      return setMessage({ type: "error", text: "Invalid or earlier end date" });
    }
    
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/holiday/${holiday.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify(formData),
        }
      );
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to update holiday");
      
      setMessage({ type: "success", text: "Holiday updated successfully" });
      
      // Call the callback to refresh the holidays list
      onHolidayUpdated();
      
      // Close the dialog after a short delay
      setTimeout(() => {
        setOpen(false);
      }, 1500);
      
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] w-[calc(100%-2rem)] p-4 sm:p-6 rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Holiday</DialogTitle>
        </DialogHeader>
        <Card className="shadow-none border-none">
          <CardContent>
            {message && (
              <div
                className={`mb-4 px-4 py-3 rounded ${
                  message.type === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Holiday Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium">
                  Holiday Type
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {holidayTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium"
                  >
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                {formData.isDateRange && (
                  <div className="space-y-2">
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium"
                    >
                      End Date
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <input
                  id="isDateRange"
                  type="checkbox"
                  checked={formData.isDateRange}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isDateRange" className="ml-2 text-sm">
                  Is Date Range?
                </label>
              </div>
              <Button type="submit" className="w-full">
                Update Holiday
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}