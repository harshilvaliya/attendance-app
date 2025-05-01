"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { getEmployeesData } from "@/lib/data"

export function DepartmentDistribution() {
  const employees = getEmployeesData()

  // Count employees by department
  const departmentCounts = employees.reduce(
    (acc, employee) => {
      acc[employee.department] = (acc[employee.department] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Convert to array for chart
  const data = Object.entries(departmentCounts).map(([name, value]) => ({
    name,
    value,
  }))

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} employees`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
