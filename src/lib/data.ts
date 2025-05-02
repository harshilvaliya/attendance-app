// Sample data for the HR dashboard

export function getDashboardData() {
  return {
    totalEmployees: 124,
    attendanceToday: {
      present: 112,
      absent: 12,
      total: 124,
    },
    pendingLeaves: 8,
    upcomingHolidays: {
      count: 3,
      next: "Memorial Day (May 27)",
    },
  };
}

export function getAttendanceData() {
  return {
    today: {
      date: new Date().toLocaleDateString(),
      present: 112,
      absent: 12,
      late: 5,
      total: 124,
    },
    history: [
      { date: "2023-05-01", present: 110, absent: 14, late: 3 },
      { date: "2023-05-02", present: 115, absent: 9, late: 2 },
      { date: "2023-05-03", present: 118, absent: 6, late: 4 },
      { date: "2023-05-04", present: 112, absent: 12, late: 5 },
    ],
  };
}

export function getLeaveRequestsData() {
  return {
    pending: [
      {
        id: 1,
        employee: "John Doe",
        type: "Sick Leave",
        from: "2023-05-10",
        to: "2023-05-12",
        status: "pending",
      },
      {
        id: 2,
        employee: "Jane Smith",
        type: "Vacation",
        from: "2023-05-15",
        to: "2023-05-20",
        status: "pending",
      },
      {
        id: 3,
        employee: "Robert Johnson",
        type: "Personal Leave",
        from: "2023-05-18",
        to: "2023-05-19",
        status: "pending",
      },
      {
        id: 4,
        employee: "Emily Davis",
        type: "Sick Leave",
        from: "2023-05-22",
        to: "2023-05-23",
        status: "pending",
      },
      {
        id: 5,
        employee: "Michael Wilson",
        type: "Vacation",
        from: "2023-06-01",
        to: "2023-06-10",
        status: "pending",
      },
      {
        id: 6,
        employee: "Sarah Brown",
        type: "Personal Leave",
        from: "2023-05-25",
        to: "2023-05-26",
        status: "pending",
      },
      {
        id: 7,
        employee: "David Miller",
        type: "Sick Leave",
        from: "2023-05-29",
        to: "2023-05-30",
        status: "pending",
      },
      {
        id: 8,
        employee: "Lisa Anderson",
        type: "Vacation",
        from: "2023-06-05",
        to: "2023-06-09",
        status: "pending",
      },
    ],
    approved: [
      {
        id: 9,
        employee: "Thomas Moore",
        type: "Vacation",
        from: "2023-04-10",
        to: "2023-04-15",
        status: "approved",
      },
      {
        id: 10,
        employee: "Jessica Lee",
        type: "Sick Leave",
        from: "2023-04-20",
        to: "2023-04-21",
        status: "approved",
      },
    ],
    rejected: [
      {
        id: 11,
        employee: "Kevin White",
        type: "Personal Leave",
        from: "2023-04-25",
        to: "2023-04-28",
        status: "rejected",
      },
    ],
  };
}

export function getHolidaysData() {
  return [
    {
      id: 1,
      name: "Memorial Day",
      date: {
        start: "2025-05-27",
        end: "2025-05-27",
      },
      type: "Federal Holiday",
    },
    {
      id: 2,
      name: "Independence Day",
      date: {
        start: "2024-07-04",
        end: "2024-07-04",
      },
      type: "Federal Holiday",
    },
    {
      id: 3,
      name: "Labor Day",
      date: {
        start: "2024-09-04",
        end: "2024-09-04",
      },
      type: "Federal Holiday",
    },
    {
      id: 4,
      name: "Company Anniversary",
      date: {
        start: "2025-06-15",
        end: "2025-06-15",
      },
      type: "Company Holiday",
    },
    {
      id: 5,
      name: "Thanksgiving Day",
      date: {
        start: "2025-11-23",
        end: "2025-11-23",
      },
      type: "Federal Holiday",
    },
    {
      id: 6,
      name: "Day after Thanksgiving",
      date: {
        start: "2025-11-24",
        end: "2025-11-24",
      },
      type: "Company Holiday",
    },
    {
      id: 7,
      name: "Winter Break",
      date: {
        start: "2025-12-24",
        end: "2026-01-01",
      },
      type: "Company Holiday",
    },
  ];
}

export function getEmployeesData() {
  return [
    {
      id: 1,
      name: "John Doe",
      position: "Software Engineer",
      department: "Engineering",
      joinDate: "2020-03-15",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "Product Manager",
      department: "Product",
      joinDate: "2019-07-22",
      status: "Active",
    },
    {
      id: 3,
      name: "Robert Johnson",
      position: "UX Designer",
      department: "Design",
      joinDate: "2021-01-10",
      status: "Active",
    },
    {
      id: 4,
      name: "Emily Davis",
      position: "Marketing Specialist",
      department: "Marketing",
      joinDate: "2020-11-05",
      status: "Active",
    },
    {
      id: 5,
      name: "Michael Wilson",
      position: "Sales Representative",
      department: "Sales",
      joinDate: "2018-05-18",
      status: "Active",
    },
    {
      id: 6,
      name: "Sarah Brown",
      position: "HR Coordinator",
      department: "Human Resources",
      joinDate: "2019-09-30",
      status: "Active",
    },
    {
      id: 7,
      name: "David Miller",
      position: "Financial Analyst",
      department: "Finance",
      joinDate: "2020-06-12",
      status: "Active",
    },
    {
      id: 8,
      name: "Lisa Anderson",
      position: "Customer Support",
      department: "Support",
      joinDate: "2021-03-22",
      status: "Active",
    },
    {
      id: 9,
      name: "Thomas Moore",
      position: "DevOps Engineer",
      department: "Engineering",
      joinDate: "2019-11-15",
      status: "Active",
    },
    {
      id: 10,
      name: "Jessica Lee",
      position: "Content Writer",
      department: "Marketing",
      joinDate: "2020-08-07",
      status: "Active",
    },
  ];
}
