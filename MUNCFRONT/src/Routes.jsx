//Hr routes
import DashboardHR from "./Component/HrManager/DashboardHR";
import Dashboard from "./Component/HrManager/Dashboard/HRDash";
import React, { useEffect } from "react";
import Role from "./Pages/Department/Role.jsx";
import Position from "./Pages/Department/Position.jsx";
import Department from "./Pages/Department/Department.jsx";
import Country from "./Pages/Location/Country.jsx";
import State from "./Pages/Location/State.jsx";
import City from "./Pages/Location/City.jsx";
import Company from "./Pages/Company/Company.jsx";
import Employee from "./Pages/AddEmployee/Employee.jsx";
import Salary from "./Pages/Salary/Salary.jsx";
import LeaveApplicationHR from "./Component/HrManager/LeaveApplicationHR.jsx";
import NotFound404 from "./Pages/PageNot/NotFound404.jsx";
import ViewAttendance from "./Component/HrManager/attendance/ViewAttendance.jsx";
import Attendance from "./Component/HrManager/attendance/SelfAttendance.jsx";
import LeaveCalendar from "./Pages/LeaveCalendar/LeaveCalendar.jsx";
import TodaysAttendance from "./Pages/DailyAttendance/TodaysAttendance.jsx";
import LeaveApplication from "./Pages/ApplyLeave/LeaveApplication.jsx";
import LeaveApplicationHRAccept from "./Component/HrManager/LeaveStatus/LeaveApplicationHRAccept.jsx";
import LeaveApplicationHRReject from "./Component/HrManager/LeaveStatus/LeaveApplicationHRReject.jsx";
import AttendanceRegister from "./Component/HrManager/attendance/AttendanceRegister.jsx";
import Notification from "./Component/HrManager/Notification/Notification.jsx";
import ManualAttendance from "./Component/HrManager/attendance/ManualAttendance.jsx";
import PersonalInfo from "./Component/Employee/EmpPresonal/PersonalInfo.jsx";
import LeaveAssign from "./Component/HrManager/LeaveStatus/LeaveAssign.jsx";
import AllEmpLeaves from "./Component/HrManager/LeaveStatus/AllEmpLeaves.jsx";
import LeaveBalance from "./Component/HrManager/LeaveStatus/LeaveBalance.jsx";

import NoticeManagement from "./Component/Admin/Notification/NoticeManagement.jsx";
import AttendanceUpdateForm from "./Pages/AttendanceUpdateForm.jsx";

import NoticeBoard from "./Utils/NoticeBoard/NoticeBoard.jsx";
import RequestForm from "./Pages/RequestTicket/RequestForm.jsx";
import RequestRaised from "./Pages/RequestTicket/RequestRaised.jsx";
import RequestRaisedClosed from "./Pages/RequestTicket/RequestRaisedClosed.jsx";
import RequestDetailsPending from "./Pages/RequestTicket/RequestDetailsPending.jsx";
import RequestDetails from "./Pages/RequestTicket/RequestDetails.jsx";
import LeaveRegister from "./Utils/LeaveComponentHrDash/LeaveRegister.jsx";
import Login from "./Pages/Login/Login.jsx";

import { createBrowserRouter, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

//Employee
import DashboardEmployee from "./Component/Employee/DashboardEmployee.jsx";
import Education from "./Component/Employee/EmpEducation/Education.jsx";

import FamilyInfo from "./Component/Employee/EmpFamily/FamilyInfo.jsx";
import WorkExperience from "./Component/Employee/EmpWorkExp/WorkExperience.jsx";
import LeaveApplicationEmp from "./Component/Employee/EmpLeave/LeaveApplicationEmp.jsx";
import EmployeeNewTask from "./Component/Employee/EmployeeTaskManagement/EmployeeNewTask.jsx";
import EmployeeActiveTask from "./Component/Employee/EmployeeTaskManagement/EmployeeActiveTask.jsx";
import EmployeeCompleteTask from "./Component/Employee/EmployeeTaskManagement/EmployeeCompleteTask.jsx";
import EmployeeRejectTask from "./Component/Employee/EmployeeTaskManagement/EmployeeRejectTask.jsx";
import EmpAttendance from "./Component/Employee/attendance/Attendance.jsx";
import AttendanceList from "./Component/Employee/attendance/AttendanceList.jsx";
import EmpDash from "./Component/Employee/Dashboard/EmpDash.jsx";

import DepartmentChart from "./Component/Employee/Dashboard/EmpChart.jsx/DepartmentChart.jsx";
import UpcomingBirthdays from "./Component/Employee/Dashboard/CountData/UpcomingBirthdays.jsx";
import EmpNotification from "./Component/Employee/Notification/Notification.jsx";
import Document from "./Component/Employee/Document/Document.jsx";

import AttendanceDetails from "./Component/Employee/attendance/AttendanceDetails.jsx";

import UpdateTaskEmpManager from "./Pages/UpdateTaskEmpManager.jsx";
import TaskContainer from "./Component/Employee/EmployeeTaskManagement/TaskContainer/TaskContainer.jsx";
import { jwtDecode } from "jwt-decode";

//Admin

import DashboardAdmin from "./Component/Admin/DashboardAdmin.jsx";
import AdminDasd from "./Component/Admin/Dashboard/AdminDash.jsx";
import AdminPortal from "./Component/Admin/AdminPortal.jsx";
import AdminProjectBid from "./Component/Admin/AdminProjectBid.jsx";
import AdminLeaveApplicationHR from "./Component/Manager/LeaveApplicationHR.jsx";
import AdminEmployee from "./Component/Admin/EmployeeList/AdminEmployee.jsx";

// ********************task management***************//
import AdminAsignTask from "./Component/Admin/TaskManagement/AdminAsignTask.jsx";
import AdminTaskStatus from "./Component/Admin/TaskManagement/AdminTaskStatus.jsx";
import AdminCancleTask from "./Component/Admin/TaskManagement/AdminCancleTask.jsx";
import AdminCompleteTask from "./Component/Admin/TaskManagement/AdminCompleteTask.jsx";
import RejectedTask from "./Component/Admin/TaskManagement/RejectedTask.jsx";
import AdminAssignedTask from "./Component/Admin/TaskManagement/AdminAssignedTask.jsx";
import AdminActive from "./Component/Admin/TaskManagement/AdminActive.jsx";
import AdminAttendance from "./Component/Admin/attendance/Attendance.jsx";

import AdminNotification from "./Component/Admin/Notification/Notification.jsx";
import AllEmpLeave from "./Component/Admin/leave/AllEmpLeave.jsx";
import AdminLeaveAssign from "./Component/Admin/leave/LeaveAssign.jsx";

import UpdateTask from "./Pages/UpdateTask.jsx";

import TeamList from "./Pages/TeamList.jsx";
import Team from "./Pages/Team.jsx";

import MonthlyLeaveRegister from "./Pages/ApplyLeave/MonthlyLeaveRegister/MonthlyLeaveRegister.jsx";

//Manager
import ManagerDashboard from "./Component/Manager/ManagerDashboard.jsx";

import ManagerLeaveApplicationHRAccepted from "./Component/Manager/LeaveApplicationHRAccepted.jsx";
import ManagerLeaveApplicationHRRejected from "./Component/Manager/LeaveApplicationHRRejected.jsx";

import ManagDashboard from "./Component/Manager/Dashboard/ManagerDash.jsx";

import ManagerNewTask from "./Component/HrManager/ManagerTaskManagement/ManagerNewTask.jsx";
import ManagerCencelledTask from "./Component/HrManager/ManagerTaskManagement/ManagerCencelledTask.jsx";
import ManagerCompletedTask from "./Component/HrManager/ManagerTaskManagement/ManagerCompletedTask.jsx";
import ManagerRejectedTask from "./Component/HrManager/ManagerTaskManagement/ManagerRejectedTask.jsx";
import ManagerActiveTask from "./Component/HrManager/ManagerTaskManagement/ManagerActiveTask.jsx";

import ManagerTodaysAttendance from "./Component/HrManager/attendance/TodaysAttendance.jsx";

import ManagerNotification from "./Component/Manager/Notification/Notification.jsx";

import ForgetPass from "./Pages/ForgotPass/ForgetPass.jsx";

import EmpTaskChart from "./Component/Employee/Dashboard/EmpChart.jsx/EmpTaskChart.jsx";
import EmpTaskCount from "./Component/Employee/Dashboard/CountData/EmpTaskCount.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userData } = useSelector((state) => state.user); // Fetch userData from Redux
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!userData || !token) {
      navigate("/");
    } else if (userData.Account === 1 && window.location.pathname === "/") {
      navigate("/admin/dashboard");
    } else if (userData.Account === 2 && window.location.pathname === "/") {
      navigate("/hr/dashboard");
    } else if (userData.Account === 3 && window.location.pathname === "/") {
      navigate("/employee/dashboard");
    } else if (userData.Account === 4 && window.location.pathname === "/") {
      navigate("/manager/dashboard");
    }
    const decodedToken = jwtDecode(token);
    if (!allowedRoles.includes(decodedToken.Account)) {
      navigate("/"); // Role does not match, redirect
    }
  }, [userData, navigate]);

  // If userData is not available, return null than no children will be visible
  if (!userData) {
    return null;
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/hr",
    element: (
      <ProtectedRoute allowedRoles={[2]}>
        <DashboardHR />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "employee/*", element: <Employee /> },
      { path: "salary", element: <Salary /> },
      { path: "company", element: <Company /> },
      { path: "role", element: <Role /> },
      { path: "position", element: <Position /> },
      { path: "department", element: <Department /> },
      { path: "country", element: <Country /> },
      { path: "state", element: <State /> },
      { path: "city", element: <City /> },
      { path: "leaveApplication", element: <LeaveApplicationHR /> },
      { path: "assignLeave", element: <LeaveAssign /> },
      { path: "leaveBalance", element: <LeaveBalance /> },
      { path: "allEmpLeave", element: <AllEmpLeaves /> },
      { path: "attenDance", element: <Attendance /> },
      { path: "viewAttenDance", element: <ViewAttendance /> },
      { path: "AttendanceRegister", element: <AttendanceRegister /> },
      { path: "NoticeManagement", element: <NoticeManagement /> },
      { path: "holiday", element: <LeaveCalendar /> },
      { path: "todaysAttendance", element: <TodaysAttendance /> },
      { path: "createLeave", element: <LeaveApplication /> },
      { path: "leaveRegister", element: <LeaveRegister /> },
      { path: "leaveAccepted", element: <LeaveApplicationHRAccept /> },
      { path: "leaveRejected", element: <LeaveApplicationHRReject /> },
      { path: "notification", element: <Notification /> },
      { path: "manualAttand", element: <ManualAttendance /> },
      { path: "personal-info", element: <PersonalInfo /> },
      { path: "request", element: <RequestForm /> },
      { path: "requestOpen", element: <RequestRaised /> },
      { path: "requestClosed", element: <RequestRaisedClosed /> },
      { path: "teamRequestClosed", element: <RequestDetails /> },
      { path: "teamRequestOpen", element: <RequestDetailsPending /> },
      { path: "updateAttendance", element: <AttendanceUpdateForm /> },
      { path: "NoticeBoard", element: <NoticeBoard /> },
      { path: "*", element: <NotFound404 /> }, // Use `element` instead of `elemnt`
    ],
  },
  {
    path: "/employee",
    element: (
      <ProtectedRoute allowedRoles={[3]}>
        <DashboardEmployee />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <EmpDash /> },
      { path: ":id/education", element: <Education /> },
      { path: ":id/family-info", element: <FamilyInfo /> },
      { path: ":id/personal-info", element: <PersonalInfo /> },
      { path: ":id/work-experience", element: <WorkExperience /> },
      { path: ":id/leave-application-emp", element: <LeaveApplicationEmp /> },
      { path: "leaveApplication", element: <LeaveApplication /> },
      { path: ":id/leave-application-emp", element: <LeaveApplicationEmp /> },
      { path: ":id/attenDance", element: <EmpAttendance /> },
      { path: ":id/attendanceList", element: <AttendanceList /> },
      { path: "MyAttendance", element: <Attendance /> },
      { path: ":id/departmentchart", element: <DepartmentChart /> },
      { path: "newTask", element: <EmployeeNewTask /> },
      { path: "activeTask", element: <EmployeeActiveTask /> },
      { path: "taskcomplete", element: <EmployeeCompleteTask /> },
      { path: "taskreject", element: <EmployeeRejectTask /> },
      { path: ":id/selfAtteend", element: <AttendanceDetails /> },
      { path: ":id/birthDay", element: <UpcomingBirthdays /> },
      { path: "notification", element: <EmpNotification /> },
      { path: "document", element: <Document /> },
      { path: "emp_manager", element: <UpdateTaskEmpManager /> },
      { path: "request", element: <RequestForm /> },
      { path: "requestOpen", element: <RequestRaised /> },
      { path: "requestClosed", element: <RequestRaisedClosed /> },
      { path: "NoticeBoard", element: <NoticeBoard /> },
      { path: "task", element: <TaskContainer /> },
      { path: "chart", element: <EmpTaskChart /> },
      { path: "count", element: <EmpTaskCount /> },

      { path: "*", element: <NotFound404 /> }, // Use `element` instead of `elemnt`
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={[1]}>
        <DashboardAdmin />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDasd /> },
      { path: "role", element: <Role /> },
      { path: "position", element: <Position /> },
      { path: "department", element: <Department /> },
      { path: "portal-master", element: <AdminPortal /> },
      { path: "project-bid", element: <AdminProjectBid /> },
      { path: "salary", element: <Salary /> },

      { path: "employee/*", element: <AdminEmployee /> },
      { path: "task", element: <AdminAsignTask /> },

      { path: "taskassign", element: <AdminAssignedTask /> },
      { path: "taskstatus", element: <AdminTaskStatus /> },
      { path: "taskcancle", element: <AdminCancleTask /> },
      { path: "taskActive", element: <AdminActive /> },

      { path: "leaveCal", element: <LeaveCalendar /> },
      { path: "country", element: <Country /> },
      { path: "state", element: <State /> },
      { path: "city", element: <City /> },
      { path: "company", element: <Company /> },
      { path: "taskcomplete", element: <AdminCompleteTask /> },
      { path: "taskreject", element: <RejectedTask /> },
      { path: "admin_manager", element: <UpdateTask /> },
      {
        path: "adminAttendance",
        element: <AdminAttendance />,
      },
      {
        path: "viewAttendance",
        element: <ViewAttendance />,
      },

      {
        path: "todaysAttendance",
        element: <TodaysAttendance />,
      },

      { path: "myAttendance", element: <Attendance /> },
      {
        path: "updateAttendance",
        element: <AttendanceUpdateForm />,
      },
      { path: "applyLeave", element: <LeaveApplication /> },
      { path: "AllEmpLeave", element: <AllEmpLeave /> },
      { path: "leaveAssign", element: <AdminLeaveAssign /> },
      { path: "leaveRegister", element: <LeaveRegister /> },

      {
        path: "leaveAccepted",
        element: <LeaveApplicationHRAccept />,
      },
      {
        path: "leaveApplication",
        element: <AdminLeaveApplicationHR />,
      },

      {
        path: "leaveRejected",
        element: <LeaveApplicationHRReject />,
      },

      { path: "requestClosed", element: <RequestDetails /> },
      {
        path: "requestReceived",
        element: <RequestDetailsPending />,
      },
      { path: "notification", element: <AdminNotification /> },
      {
        path: "NoticeManagement",
        element: <NoticeManagement />,
      },

      { path: "teamList", element: <TeamList /> },
      { path: "managerTeam", element: <Team /> },
      { path: "NoticeBoard", element: <NoticeBoard /> },
      {
        path: "AttendanceRegister",
        element: <AttendanceRegister />,
      },

      {
        path: "monthlyLeave",
        element: <MonthlyLeaveRegister />,
      },

      { path: "*", element: <NotFound404 /> }, // Use `element` instead of `elemnt`
    ],
  },

  {
    path: "/manager",
    element: (
      <ProtectedRoute allowedRoles={[4]}>
        <ManagerDashboard />
      </ProtectedRoute>
    ),
    children: [
      { path: "employee", element: <Employee /> },
      { path: "salary", element: <Salary /> },
      { path: "company", element: <Company /> },
      { path: "role", element: <Role /> },
      { path: "position", element: <Position /> },
      { path: "department", element: <Department /> },
      { path: "country", element: <Country /> },
      { path: "state", element: <State /> },
      { path: "city", element: <City /> },
      {
        path: "leaveApplication",
        element: <AdminLeaveApplicationHR />,
      },
      {
        path: "leaveApplicationAccepted",
        element: <ManagerLeaveApplicationHRAccepted />,
      },
      {
        path: "leaveApplicationRejected",
        element: <ManagerLeaveApplicationHRRejected />,
      },
      { path: "city", element: <City /> },
      { path: "dashboard", element: <ManagDashboard /> },

      { path: "newTask", element: <ManagerNewTask /> },

      { path: "ActiveTask", element: <ManagerActiveTask /> },
      { path: "admin_manager", element: <UpdateTask /> },
      {
        path: "emp_manager",
        element: <UpdateTaskEmpManager />,
      },

      {
        path: "taskcancle",
        element: <ManagerCencelledTask />,
      },
      {
        path: "taskcomplete",
        element: <ManagerCompletedTask />,
      },
      {
        path: "rejectTask",
        element: <ManagerRejectedTask />,
      },

      {
        path: "viewAttenDance",
        element: <ViewAttendance />,
      },
      {
        path: "NoticeManagement",
        element: <NoticeManagement />,
      },
      { path: "holiday", element: <LeaveCalendar /> },
      {
        path: "todaysAttendance",
        element: <ManagerTodaysAttendance />,
      },
      { path: "myAttendance", element: <Attendance /> },
      { path: "notification", element: <ManagerNotification /> },
      { path: "createLeave", element: <LeaveApplication /> },
      { path: "LeaveBalance", element: <LeaveBalance /> },
      { path: "team", element: <Team /> },
      { path: "request", element: <RequestForm /> },
      { path: "requestOpen", element: <RequestRaised /> },
      {
        path: "requestClosed",
        element: <RequestRaisedClosed />,
      },
      {
        path: "teamRequestClosed",
        element: <RequestDetails />,
      },
      {
        path: "teamRequestOpen",
        element: <RequestDetailsPending />,
      },
      { path: "NoticeBoard", element: <NoticeBoard /> },

      {
        path: "personal-info",
        element: <PersonalInfo />,
      },

      { path: "*", element: <NotFound404 /> }, // Use `element` instead of `elemnt`
    ],
  },

  {
    path: "/forgetPassword",
    element: <ForgetPass />,
  },
  {
    path: "/404",
    element: <NotFound404 />,
  },

  { path: "*", element: <NotFound404 /> }, // Use `element` instead of `elemnt`
]);
