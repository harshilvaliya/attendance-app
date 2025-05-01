"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AttendanceChart() {
  // Sample data for the attendance chart
  const data = [
    { month: "Jan", present: 92, absent: 8, late: 4 },
    { month: "Feb", present: 90, absent: 10, late: 5 },
    { month: "Mar", present: 94, absent: 6, late: 3 },
    { month: "Apr", present: 91, absent: 9, late: 6 },
    { month: "May", present: 89, absent: 11, late: 7 },
    { month: "Jun", present: 95, absent: 5, late: 2 },
    { month: "Jul", present: 93, absent: 7, late: 4 },
    { month: "Aug", present: 90, absent: 10, late: 5 },
    { month: "Sep", present: 92, absent: 8, late: 3 },
    { month: "Oct", present: 94, absent: 6, late: 2 },
    { month: "Nov", present: 91, absent: 9, late: 4 },
    { month: "Dec", present: 88, absent: 12, late: 6 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="present" name="Present %" fill="#22c55e" />
        <Bar dataKey="absent" name="Absent %" fill="#ef4444" />
        <Bar dataKey="late" name="Late %" fill="#f97316" />
      </BarChart>
    </ResponsiveContainer>
  );
}
