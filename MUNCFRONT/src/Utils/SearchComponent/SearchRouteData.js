export const SearchRouteData = [
  // ===============================
  // Admin Routes (user: "1")
  // ===============================
  { control: "admin", name: "Dashboard", path: "/admin/dashboard" },
  { control: "admin", name: "Employee List", path: "/admin/employee" },
  { control: "admin", name: "Salary", path: "/admin/salary" },

  // Attendance
  { control: "admin", name: "My Attendance", path: "/admin/myAttendance" },
  { control: "admin", name: "Attendance register", path: "/admin/AttendanceRegister" },
  {
    control: "admin",
    name: "TodaysAttendance",
    path: "/admin/todaysAttendance",
  },
  { control: "admin", name: "View Attendance", path: "/admin/viewAttendance" },

  // Leave
  { control: "admin", name: "Leave Request", path: "/admin/leaveApplication" },
  { control: "admin", name: "Approved Leaves", path: "/admin/leaveAccepted" },
  { control: "admin", name: "Rejected Leaves", path: "/admin/leaveRejected" },
  { control: "admin", name: "Leave Register", path: "/admin/leaveRegister" },
  { control: "admin", name: "Leave Assign", path: "/admin/leaveAssign" },
  { control: "admin", name: "Emp Leave Balance", path: "/admin/AllEmpLeave" },

  // Task
  { control: "admin", name: "Create New Task", path: "/admin/task" },
  { control: "admin", name: "Assigned", path: "/admin/taskassign" },
  { control: "admin", name: "Active Task", path: "/admin/taskActive" },
  { control: "admin", name: "Cancelled Task", path: "/admin/taskcancle" },
  { control: "admin", name: "Completed Task", path: "/admin/taskcomplete" },
  { control: "admin", name: "Rejected Task", path: "/admin/taskreject" },

  // Access
  { control: "admin", name: "Role", path: "/admin/role" },
  { control: "admin", name: "Position", path: "/admin/position" },
  { control: "admin", name: "Department", path: "/admin/department" },

  // Company
  { control: "admin", name: "Company List", path: "/admin/company" },

  // Address
  { control: "admin", name: "Country", path: "/admin/country" },
  { control: "admin", name: "State", path: "/admin/state" },
  { control: "admin", name: "City", path: "/admin/city" },

  // Notice
  { control: "admin", name: "Notice", path: "/admin/NoticeManagement" },

  // Request Details
  { control: "admin", name: "Request Open", path: "/admin/requestReceived" },
  { control: "admin", name: "Request Closed", path: "/admin/requestClosed" },

  // Holiday
  { control: "admin", name: "Leave Calendar", path: "/admin/leaveCal" },

  // Project
  { control: "admin", name: "Project Bidding", path: "/admin/project-bid" },
  { control: "admin", name: "Portal Master", path: "/admin/portal-master" },

  // ===============================
  // HR Routes (user: "2")
  // ===============================
  { control: "hr", name: "Dashboard", path: "/hr/dashboard" },
  { control: "hr", name: "Employee List", path: "/hr/employee" },
  { control: "hr", name: "Salary", path: "/hr/salary" },
  { control: "hr", name: "Company", path: "/hr/company" },

  // Access
  { control: "hr", name: "Role", path: "/hr/role" },
  { control: "hr", name: "Position", path: "/hr/position" },
  { control: "hr", name: "Department", path: "/hr/department" },

  // Address
  { control: "hr", name: "Country", path: "/hr/country" },
  { control: "hr", name: "State", path: "/hr/state" },
  { control: "hr", name: "City", path: "/hr/city" },

  // Leave
  { control: "hr", name: "Leave Application", path: "/hr/leaveApplication" },
  { control: "hr", name: "Assign Leave", path: "/hr/assignLeave" },
  { control: "hr", name: "All Employee Leaves", path: "/hr/allEmpLeave" },
  { control: "hr", name: "Create Leave", path: "/hr/createLeave" },
  { control: "hr", name: "Leave Accepted", path: "/hr/leaveAccepted" },
  { control: "hr", name: "Leave Rejected", path: "/hr/leaveRejected" },

  // Task
  { control: "hr", name: "New Task", path: "/hr/newTask" },
  { control: "hr", name: "Active Task", path: "/hr/ActiveTask" },
  { control: "hr", name: "Task Cancel", path: "/hr/taskcancle" },
  { control: "hr", name: "Task Complete", path: "/hr/taskcomplete" },
  { control: "hr", name: "Reject Task", path: "/hr/rejectTask" },

  // Attendance
  { control: "hr", name: "Self Attendance", path: "/hr/attenDance" },
  {
    control: "hr",
    name: "Attendance Register",
    path: "/hr/AttendanceRegister",
  },
  { control: "hr", name: "TodaysAttendance", path: "/hr/todaysAttendance" },
  { control: "hr", name: "View Attendance", path: "/hr/viewAttenDance" },
  { control: "hr", name: "Manual Attendance", path: "/hr/manualAttand" },

  // Notice
  { control: "hr", name: "Notice", path: "/hr/NoticeManagement" },

  // My Request
  { control: "hr", name: "Raise Request", path: "/hr/request" },
  { control: "hr", name: "Open Request", path: "/hr/requestOpen" },
  { control: "hr", name: "Closed Request", path: "/hr/requestClosed" },

  // Team Request
  { control: "hr", name: "Open Team Request", path: "/hr/teamRequestOpen" },
  { control: "hr", name: "Closed Team Request", path: "/hr/teamRequestClosed" },

  // Holiday
  { control: "hr", name: "Holiday", path: "/hr/holiday" },

  // Profile
  { control: "hr", name: "Personal Info", path: "/hr/personal-info" },

  // ===============================
  // Employee Routes (user: "3")
  // ===============================
  { control: "employee", name: "Dashboard", path: "/employee/dashboard" },
  { control: "employee", name: "Education", path: "/employee/:id/education" },
  { control: "employee", name: "Family", path: "/employee/:id/family-info" },
  {
    control: "employee",
    name: "Experience",
    path: "/employee/:id/work-experience",
  },
  { control: "employee", name: "Documents", path: "/employee/document" },
  {
    control: "employee",
    name: "Personal Info",
    path: "/employee/:id/personal-info",
  },
  {
    control: "employee",
    name: "Leave Application",
    path: "/employee/:id/leave-application-emp",
  },
  {
    control: "employee",
    name: "My Attendance",
    path: "/employee/MyAttendance",
  },
  { control: "employee", name: "Active Task", path: "/employee/activeTask" },
  {
    control: "employee",
    name: "Task Complete",
    path: "/employee/taskcomplete",
  },
  { control: "employee", name: "Task Reject", path: "/employee/taskreject" },
  { control: "employee", name: "Birthday", path: "/employee/:id/birthday" },
  { control: "employee", name: "Notification", path: "/employee/notification" },
  { control: "employee", name: "New Task", path: "/employee/newTask" },

  // Request
  { control: "employee", name: "Raise Request", path: "/employee/request" },
  { control: "employee", name: "Open Request", path: "/employee/requestOpen" },
  {
    control: "employee",
    name: "Closed Request",
    path: "/employee/requestClosed",
  },

  // ===============================
  // Manager Routes (user: "4")
  // ===============================
  { control: "manager", name: "Dashboard", path: "/manager/dashboard" },

  // Attendance
  { control: "manager", name: "My Attendance", path: "/manager/myAttendance" },
  {
    control: "manager",
    name: "TodaysAttendance",
    path: "/manager/todaysAttendance",
  },
  {
    control: "manager",
    name: "View Attendance",
    path: "/manager/viewAttenDance",
  },

  // Leave
  { control: "manager", name: "Create Leave", path: "/manager/createLeave" },
  {
    control: "manager",
    name: "Leave Requests",
    path: "/manager/leaveApplication",
  },
  {
    control: "manager",
    name: "Accepted Leave",
    path: "/manager/leaveApplicationAccepted",
  },
  {
    control: "manager",
    name: "Rejected Leave",
    path: "/manager/leaveApplicationRejected",
  },

  // Task
  { control: "manager", name: "Assign New Task", path: "/manager/newTask" },
  { control: "manager", name: "Active Task", path: "/manager/ActiveTask" },
  { control: "manager", name: "Cancelled Task", path: "/manager/taskcancle" },
  { control: "manager", name: "Completed Task", path: "/manager/taskcomplete" },
  { control: "manager", name: "Rejected Task", path: "/manager/rejectTask" },

  // Notice
  { control: "manager", name: "Notice", path: "/manager/NoticeManagement" },

  // My Request
  { control: "manager", name: "Raise Request", path: "/manager/request" },
  { control: "manager", name: "Open Request", path: "/manager/requestOpen" },
  {
    control: "manager",
    name: "Closed Request",
    path: "/manager/requestClosed",
  },

  // Team Request
  {
    control: "manager",
    name: "Open Team Request",
    path: "/manager/teamRequestOpen",
  },
  {
    control: "manager",
    name: "Closed Team Request",
    path: "/manager/teamRequestClosed",
  },

  // Profile
  { control: "manager", name: "Personal Info", path: "/manager/personal-info" },

  // Holiday
  { control: "manager", name: "Holiday Calendar", path: "/manager/holiday" },
];
