import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { SiMicrosoftexcel } from "react-icons/si";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import BASE_URL from "../../../Pages/config/config";

function AttendanceRegister() {
  const [companyData, setCompanyData] = useState([]);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const [filterYear, setFilterYear] = useState(currentYear);
  const [attendance, setAttendance] = useState([]);
  const { darkMode } = useTheme();
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/company`, {
        headers: { authorization: localStorage.getItem("token") || "" },
      })
      .then((response) => {
        console.log(response.data)
        setCompanyData(response.data);
        
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetchAttendanceData();
  }, [filterYear, filterMonth]);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/attendance`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      });
      setAttendance(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();

 

  const markAttendance = (loginTime, day) => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Check if the date is before the current date
    if (
      filterYear < currentYear ||
      (filterYear === currentYear && filterMonth < currentMonth) ||
      (filterYear === currentYear &&
        filterMonth === currentMonth &&
        day < currentDay)
    ) {
      if (!loginTime || loginTime.length === 0) {
        return { status: "A", color: "#EF4040", title: "Absent" }; // Mark as absent
      }
    } else if (!loginTime || loginTime.length === 0) {
      return { status: "--", color: "#c1bdbd", title: "No Data" }; // For future dates
    }

    if (loginTime[0] === "") {
      return { status: "A", color: "#EF4040", title: "Absent" };
    }

    if (loginTime === "WO") {
      return { status: "WO", color: "#6e99de", title: "Work Off" };
    }

    const loginHour = parseInt(loginTime.split(":")[0]);
    const loginMinute = parseInt(loginTime.split(":")[1]);

    if (loginHour < 10 || (loginHour === 10 && loginMinute < 1)) {
      return { status: "P", color: "#6BCB77", title: "Present" };
    } else if (loginHour === 10 && loginMinute < 16) {
      return { status: "L", color: "#41C9E2", title: "Late" };
    } else if (loginHour < 14 || (loginHour === 14 && loginMinute === 0)) {
      return { status: "H", color: "#FDA403", title: "Half Day" };
    } else {
      return { status: "A", color: "#EF4040", title: "Absent" };
    }
  };
  const uniqueYears = Array.from(
    new Set(
      attendance.flatMap((employee) => employee.years.map((year) => year.year))
    )
  );

  const uniqueMonths = Array.from(
    new Set(
      attendance.flatMap((employee) =>
        employee.years
          .filter((year) => year.year === filterYear)
          .flatMap((year) => year.months.map((month) => month.month))
      )
    )
  );

  const getUserStatusColor = (month) => {
    switch (month) {
      case 1:
        return "January";
      case 2:
        return "February";
      case 3:
        return "March";
      case 4:
        return "April";
      case 5:
        return "May";
      case 6:
        return "June";
      case 7:
        return "July";
      case 8:
        return "August";
      case 9:
        return "September";
      case 10:
        return "October";
      case 11:
        return "November";
      case 12:
        return "December";
      default:
        return "";
    }
  };

  const calculateTotal = (status, employee) => {
    let total = 0;
    const yearIndex = employee.years.findIndex(
      (year) => year.year === filterYear
    );
    const monthIndex = employee.years[yearIndex]?.months.findIndex(
      (month) => month.month === filterMonth
    );

    // Get the dates for the specified month and year
    const dates = employee.years[yearIndex]?.months[monthIndex]?.dates || [];

    // Loop through each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObject = dates.find((date) => date.date === day);

      // If no attendance data for the date, mark as absent until the current date
      const loginTime = dateObject ? dateObject.loginTime[0] : "";

      // Mark attendance based on loginTime or lack of data
      const attendanceStatus = markAttendance(loginTime).status;

      if (
        attendanceStatus === status ||
        (status === "P" &&
          (attendanceStatus === "WO" || attendanceStatus === "L")) ||
        (status === "A" && attendanceStatus === "--") // Handle "--" as absent
      ) {
        total++;
      }
    }

    return total;
  };

  const handleExport = () => {
    const wsData = [];
    const monthYear = `${getUserStatusColor(filterMonth)} ${filterYear}`;
    const companyName = companyData[0]?.CompanyName;
    const companyAddressLine1 = companyData[0]?.CompanyName.Address;
    const companyAddressLine2 = `${companyData[0]?.city[0]?.CityName} ${companyData[0]?.city[0]?.state[0]?.StateName} ${companyData[0]?.city[0]?.state[0]?.country[0]?.CountryName}`;

    // Add company details and report title to the worksheet data
    wsData.push([companyName]);
    wsData.push([companyAddressLine1]);
    wsData.push([companyAddressLine2]);
    wsData.push([]); // Blank row for spacing
    wsData.push([`Attendance Summary for ${monthYear}`]);
    wsData.push([]); // Blank row for spacing

    // Define headers for the worksheet
    const headers = [
      "S.No",
      "Employee ID",
      "Employee Name",
      ...[...Array(daysInMonth)].map((_, day) =>
        (day + 1).toString().padStart(2, "0")
      ), // Columns for each day of the month (01, 02, 03, ..., 30)
      "Total Absent",
      "Total Present",
      "Total Halfday",
    ];
    wsData.push(headers);

    // Loop through each employee's attendance data and construct rows for export
    attendance.forEach((employee, index) => {
      const yearIndex = employee.years.findIndex(
        (year) => year.year === filterYear
      );
      const monthIndex = employee.years[yearIndex]?.months.findIndex(
        (month) => month.month === filterMonth
      );
      const dates = employee.years[yearIndex]?.months[monthIndex]?.dates || [];

      // Construct the row for the employee
      const row = [
        (index + 1).toString().padStart(2, "0"), // Serial number (e.g., 01, 02, ...)
        employee.employeeObjID?.empID || "NA", // Employee ID
        employee.employeeObjID?.FirstName || "NA", // Employee Name
        ...[...Array(daysInMonth)].map((_, day) => {
          const dateObject = dates.find((date) => date.date === day + 1); // Find attendance for the day
          const loginTimeForDay = dateObject
            ? dateObject.loginTime[0] // If attendance data exists for that day, get the login time
            : "A";
          return markAttendance(loginTimeForDay).status === "A"
            ? "A"
            : markAttendance(loginTimeForDay).status;
        }),
        calculateTotal("A", employee), // Calculate total absent days
        calculateTotal("P", employee), // Calculate total present days
        calculateTotal("H", employee), // Calculate total half-days
      ];

      // Add the row to the worksheet data
      wsData.push(row);
    });

    // Create the worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();

    // Append the worksheet to the workbook and export it as a file
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Summary");
    XLSX.writeFile(wb, "Attendance_Summary.xlsx");
  };

  // scrool start
  const scrollContainerRef = useRef(null); // Reference for the scrollable container
  const [isScrollable, setIsScrollable] = useState(false); // Track if content is scrollable

  // Detect if the table is scrollable horizontally
  const checkScrollable = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setIsScrollable(container.scrollWidth > container.clientWidth);
    }
  };

  // Handle horizontal scrolling on mouse move
  const handleMouseMove = (e) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const mouseX = e.clientX;

    // Detect if mouse is near the left or right edge
    const scrollSpeed = 10; // Speed of the scroll

    if (mouseX < containerRect.left + 50) {
      // Scroll left
      container.scrollLeft -= scrollSpeed;
    } else if (mouseX > containerRect.right - 50) {
      // Scroll right
      container.scrollLeft += scrollSpeed;
    }
  };

  useEffect(() => {
    checkScrollable(); // Check on mount and when data changes
    window.addEventListener("resize", checkScrollable); // Recheck on window resize
    return () => window.removeEventListener("resize", checkScrollable);
  }, [attendance]);

  return (
    <div
      style={{ height: "93vh", overflow: "auto" }}
      className="container-fluid pb-5"
    >
      <div className="d-flex justify-content-between py-3">
        <div
          style={{ color: darkMode ? "black" : "white" }}
          className="d-flex gap-2"
        >
          <h6 className="my-auto ">Attendance Summary</h6>
          <button
            style={{ whiteSpace: "pre" }}
            onClick={handleExport}
            className="btn py-0 px-2 btn-outline-success d-flex align-items-center  gap-2 my-auto shadow-sm rounded-5"
          >
            {" "}
            <SiMicrosoftexcel />{" "}
            <span className="d-none d-md-flex">Export XLSX</span>
          </button>
        </div>
        <div
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark:)"
              : "var(--secondaryDashMenuColor)",
          }}
          className="d-flex gap-3"
        >
          <div className="d-flex align-items-center gap-2">
            <label className="my-auto">Year</label>
            <select
              className="form-select py-1 rounded-0 "
              value={filterYear}
              onChange={(e) => setFilterYear(parseInt(e.target.value))}
            >
              <option value="">--Select Year--</option>
              {uniqueYears
                .sort(function (a, b) {
                  return a - b;
                })
                .map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </div>
          <div className="d-flex align-items-center gap-2">
            <label className="my-auto">Month</label>
            <select
              className="form-select py-1 rounded-0  "
              value={filterMonth}
              onChange={(e) => setFilterMonth(parseInt(e.target.value))}
            >
              <option value="">--Select Month--</option>
              {uniqueMonths
                .sort(function (a, b) {
                  return a - b;
                })
                .map((month, index) => (
                  <option key={index} value={month}>
                    {getUserStatusColor(month)}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      <div
        style={{
          overflow: "scroll auto",
          maxHeight: "64vh",
          position: "relative",
          overflowX: "auto",
          overflowY: "auto",
        }}
        className="employee-attendence-table mt-0"
      >
        <div
          ref={scrollContainerRef}
          style={{
            overflowX: "auto",
            position: "relative",
            cursor: isScrollable ? "ew-resize" : "default",
          }}
          className="table-responsive p-2 mb-3"
          onMouseMove={handleMouseMove}
        >
          <table
            className="table table-bordered table-striped"
            style={{ fontSize: ".9rem", fontWeight: "normal" }}
          >
            <thead>
              <tr style={{ position: "sticky", top: "-2px", zIndex: "5" }}>
                <th
                  style={{
                    whiteSpace: "pre",
                    backgroundColor: "var(--primaryDashColorDark)",
                    color: "var(--primaryDashMenuColor)",
                    position: "sticky",
                    left: "0",
                    top: "0",
                  }}
                >
                  S.No
                </th>
                <th
                  style={{
                    whiteSpace: "pre",
                    backgroundColor: "var(--primaryDashColorDark)",
                    color: "var(--primaryDashMenuColor)",
                    position: "sticky",
                    left: "0",
                    top: "0",
                  }}
                >
                  Employee ID
                </th>
                <th
                  style={{
                    whiteSpace: "pre",
                    backgroundColor: "var(--primaryDashColorDark)",
                    color: "var(--primaryDashMenuColor)",
                    position: "sticky",
                    left: "-1px",
                    top: "0",
                  }}
                >
                  Employee Name
                </th>
                {/* Render days of the month */}
                {[...Array(daysInMonth)].map((_, day) => (
                  <th
                    style={{
                      background: "var(--primaryDashColorDark)",
                      color: "var(--primaryDashMenuColor)",
                    }}
                    className="text-center"
                    key={day}
                  >
                    {(day + 1).toString().padStart(2, "0")}
                  </th>
                ))}
                <th
                  className="text-white"
                  style={{ whiteSpace: "pre", backgroundColor: "#EF4040" }}
                >
                  Total Absent
                </th>
                <th
                  className="text-white"
                  style={{ whiteSpace: "pre", backgroundColor: "#6BCB77" }}
                >
                  Total Present
                </th>
                {/* <th className='text-white' style={{ whiteSpace: 'pre', backgroundColor: "#41C9E2" }}>Total Late</th> */}
                <th
                  className="text-white"
                  style={{ whiteSpace: "pre", backgroundColor: "#FDA403" }}
                >
                  Total Halfday
                </th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((employee, index) => {
                const yearIndex = employee.years.findIndex(
                  (year) => year.year === filterYear
                );
                const monthIndex = employee.years[yearIndex]?.months.findIndex(
                  (month) => month.month === filterMonth
                );
                const dates =
                  employee.years[yearIndex]?.months[monthIndex]?.dates || [];
                return (
                  <tr key={employee._id}>
                    <td className="text-center">
                      {(index + 1).toString().padStart(2, 0)}
                    </td>
                    <td>{employee.employeeObjID?.empID || "N/A"}</td>
                    <td
                      style={{
                        whiteSpace: "pre",
                        textTransform: "capitalize",
                        position: "sticky",
                        left: "-1px",
                        top: "0",
                      }}
                    >
                      {employee.employeeObjID?.FirstName}{" "}
                      {employee.employeeObjID?.LastName}
                    </td>
                    {[...Array(daysInMonth)].map((_, day) => {
                      const dateObject = dates.find(
                        (date) => date.date === day + 1
                      );
                      const loginTimeForDay = dateObject
                        ? dateObject.loginTime[0]
                        : undefined;
                      const { status, color } = markAttendance(
                        loginTimeForDay,
                        day + 1
                      ); // Pass day to markAttendance
                      return (
                        <td
                          style={{
                            whiteSpace: "pre",
                            backgroundColor: color,
                            color: "white",
                          }}
                          key={day}
                        >
                          {status}
                        </td>
                      );
                    })}
                    <td className="text-center">
                      {calculateTotal("A", employee)}
                    </td>
                    <td className="text-center">
                      {calculateTotal("P", employee)}
                    </td>
                    <td className="text-center">
                      {calculateTotal("H", employee)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pt-3 d-flex align-items-center gap-2">
        <h6
          style={{
            textAlign: "start",
            color: darkMode
              ? "var( --secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            fontWeight: "normal",
            fontSize: ".9rem",
          }}
          className="my-auto"
        >
          Abbreviation
        </h6>
        <table
          className="table-bordered table-striped"
          style={{
            textAlign: "start",
            color: darkMode
              ? "var( --secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            fontWeight: "normal",
            fontSize: ".9rem",
          }}
        >
          <tr>
            <td
              className="px-3"
              style={{
                backgroundColor: "#EF4040",
                color: "white",
                textAlign: "center",
              }}
            >
              A
            </td>
            <td className="px-2" style={{ textAlign: "start" }}>
              Absent
            </td>

            <td
              className="px-3"
              style={{
                backgroundColor: "#6BCB77",
                color: "white",
                textAlign: "center",
              }}
            >
              P
            </td>
            <td className="px-2" style={{ textAlign: "start" }}>
              Present
            </td>

            <td
              className="px-3"
              style={{
                backgroundColor: "#41C9E2",
                color: "white",
                textAlign: "center",
              }}
            >
              L
            </td>
            <td className="px-2" style={{ textAlign: "start" }}>
              Late
            </td>

            <td
              className="px-3"
              style={{
                backgroundColor: "#FDA403",
                color: "white",
                textAlign: "center",
              }}
            >
              H
            </td>
            <td className="px-2" style={{ textAlign: "start" }}>
              Halfday
            </td>
            <td
              className="px-3"
              style={{
                backgroundColor: "#6e99de",
                color: "white",
                textAlign: "center",
              }}
            >
              WO
            </td>
            <td className="px-2">Week Off</td>
          </tr>
        </table>
      </div>
      <div
        style={{
          textAlign: "start",
          color: darkMode
            ? "var( --secondaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
          fontWeight: "normal",
          fontSize: ".9rem",
        }}
        className="py-3"
      >
        <h6>Notes</h6>
        <p style={{ fontSize: ".8rem" }} className="m-0 p-0">
          Weekly off (WO) is considered part of an employee's present status,
          meaning it is not deducted from their attendance.
        </p>
        <p style={{ fontSize: ".8rem" }} className="m-0 p-0">
          Being late mark (L) is used to identify whether employees are arriving
          on time, but it is still counted as part of their present status.
        </p>
      </div>
    </div>
  );
}

export default AttendanceRegister;
