// API service for fetching data from the backend

export interface DashboardData {
  totalEmployees: number;
  attendanceToday: {
    present: number;
    absent: number;
    total: number;
  };
  pendingLeaves: number;
  upcomingHolidays: {
    count: number;
    next: string;
  };
}

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Fetch employees count
    const employeesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/get-users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!employeesResponse.ok) {
      throw new Error("Failed to fetch employees data");
    }

    const employeesData = await employeesResponse.json();
    const totalEmployees = employeesData.data.users.length;

    // Fetch pending leave requests
    const leavesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/all-leave-forms`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!leavesResponse.ok) {
      throw new Error("Failed to fetch leave requests");
    }

    const leavesData = await leavesResponse.json();
    const pendingLeaves = leavesData.data.filter(
      (leave: any) => leave.status.toLowerCase() === "pending"
    ).length;

    // Fetch holidays
    const holidaysResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/holidays`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!holidaysResponse.ok) {
      throw new Error("Failed to fetch holidays");
    }

    const holidaysData = await holidaysResponse.json();
    const today = new Date();

    // Filter upcoming holidays
    const upcomingHolidaysList = holidaysData.data
      .filter((holiday: any) => {
        const holidayDate = new Date(holiday.startDate);
        return holidayDate >= today;
      })
      .sort((a: any, b: any) => {
        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      });

    const upcomingHolidays = {
      count: upcomingHolidaysList.length,
      next:
        upcomingHolidaysList.length > 0
          ? `${upcomingHolidaysList[0].name} (${new Date(
              upcomingHolidaysList[0].startDate
            ).toLocaleDateString("en-US", { month: "short", day: "numeric" })})`
          : "None",
    };

    // For attendance, we would need an API endpoint to get today's attendance
    // Since we don't have that endpoint in the provided routes, we'll use a placeholder
    // In a real implementation, you would fetch this from an appropriate endpoint
    const attendanceToday = {
      present: Math.floor(totalEmployees * 0.9), // Assuming 90% attendance as placeholder
      absent: Math.ceil(totalEmployees * 0.1),
      total: totalEmployees,
    };

    return {
      totalEmployees,
      attendanceToday,
      pendingLeaves,
      upcomingHolidays,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return default values in case of error
    return {
      totalEmployees: 0,
      attendanceToday: {
        present: 0,
        absent: 0,
        total: 0,
      },
      pendingLeaves: 0,
      upcomingHolidays: {
        count: 0,
        next: "None",
      },
    };
  }
}
