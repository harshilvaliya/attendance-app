"use client";

import type React from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  PieChart,
  LineChart,
  Calendar,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { DepartmentDistribution } from "@/components/dashboard/department-distribution";
import { useToast } from "@/components/ui/use-toast";

export default function ReportsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              View and generate HR reports
            </p>
          </div>
          <ExportReportsButton />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <ReportCard
            title="Attendance Report"
            description="Daily and monthly attendance statistics"
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          />
          <ReportCard
            title="Leave Report"
            description="Employee leave patterns and statistics"
            icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          />
          <ReportCard
            title="Department Report"
            description="Employee distribution by department"
            icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
          />
          <ReportCard
            title="Employee Turnover"
            description="Employee retention and turnover rates"
            icon={<LineChart className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
          </TabsList>
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>
                  Monthly attendance statistics for the current year
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <AttendanceChart />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="departments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>
                  Employee distribution across departments
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <DepartmentDistribution />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}

function ReportCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: `${title} selected`,
      description:
        "This would navigate to a detailed report view in a real application",
    });
  };

  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ExportReportsButton() {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Reports exported",
      description: "All reports have been exported to Excel format",
    });
  };

  return (
    <Button className="gap-2" onClick={handleExport}>
      <Download className="h-4 w-4" />
      Export Reports
    </Button>
  );
}
