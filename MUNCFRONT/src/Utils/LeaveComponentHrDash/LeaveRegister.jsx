import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../../Pages/config/config";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import TittleHeader from "../../Pages/TittleHeader/TittleHeader";
import "./LeaveComponentHrDash.css";
import { BsArrowRight } from "react-icons/bs";

const LeaveRegister = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [popover, setPopover] = useState({
    visible: false,
    leaveDetails: [],
    type: "",
  });
  const { darkMode } = useTheme();

  const loadLeaveData = () => {
    axios
      .post(`${BASE_URL}/api/leave-application-hr/`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setLeaveData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadLeaveData();
  }, []);

  const calculateLeaveDays = (fromDate, toDate) => {
    if (!toDate || toDate === "Invalid Date") {
      return 0.5; // Half day if no valid end date
    }
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const timeDiff = to - from;
    const daysDiff = timeDiff / (1000 * 3600 * 24) + 1;
    return daysDiff > 0 ? daysDiff : 0;
  };

  const filterByMonthYear = (data) => {
    return data.filter((leave) => {
      const fromDate = new Date(leave.FromDate);
      return (
        fromDate.getMonth() + 1 === month && fromDate.getFullYear() === year
      );
    });
  };

  const groupedData = filterByMonthYear(leaveData).reduce((acc, leave) => {
    const { FirstName, LastName, Leavetype, FromDate, ToDate, empID } = leave;
    const employeeName = `${empID} - ${FirstName} ${LastName}`;
    const leaveDays = calculateLeaveDays(FromDate, ToDate);

    if (!acc[employeeName]) {
      acc[employeeName] = {
        paidLeave: 0,
        sickLeave: 0,
        casualLeave: 0,
        unpaidLeave: 0,
        paternityLeave: 0,
        maternityLeave: 0,
        totalDeductable: 0,
        totalNonDeductable: 0,
        leaveDetails: {},
      };
    }

    // Initialize leave details for each type
    if (!acc[employeeName].leaveDetails[Leavetype]) {
      acc[employeeName].leaveDetails[Leavetype] = [];
    }

    // Store leave details for the popover
    acc[employeeName].leaveDetails[Leavetype].push({
      fromDate: FromDate,
      toDate: ToDate,
    });

    switch (Leavetype.toLowerCase()) {
      case "paid leave":
        acc[employeeName].paidLeave += leaveDays;
        acc[employeeName].totalNonDeductable += leaveDays;
        break;
      case "sick leave":
        acc[employeeName].sickLeave += leaveDays;
        acc[employeeName].totalDeductable += leaveDays;
        break;
      case "casual leave":
        acc[employeeName].casualLeave += leaveDays;
        acc[employeeName].totalDeductable += leaveDays;
        break;
      case "unpaid leave":
        acc[employeeName].unpaidLeave += leaveDays;
        acc[employeeName].totalDeductable += leaveDays;
        break;
      case "paternity leave":
        acc[employeeName].paternityLeave += leaveDays;
        acc[employeeName].totalNonDeductable += leaveDays;
        break;
      case "maternity leave":
        acc[employeeName].maternityLeave += leaveDays;
        acc[employeeName].totalNonDeductable += leaveDays;
        break;
      default:
        break;
    }

    return acc;
  }, {});

  const handleMouseEnter = (leaveDetails, type) => {
    setPopover({ visible: true, leaveDetails, type });
  };

  const handleMouseLeave = () => {
    setPopover({ visible: false, leaveDetails: [], type: "" });
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 my-2 mb-3">
        <TittleHeader
          title={"Leave Register"}
          message={"You can view employee's monthly leave here."}
        />

        <div className="d-flex gap-2">
          <div className="me-2 d-flex flex-column">
            <select
              value={month}
              className="form-select"
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: new Date().getMonth() + 1 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <div className="me-2 d-flex flex-column">
            <select
              value={year}
              className="form-select"
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {Array.from(
                { length: 10 },
                (_, i) => new Date().getFullYear() - i
              ).map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxHeight: "55vh", overflow: "scroll" }}>
        <table className="table position-relative">
          <thead>
            <tr>
              <th style={rowHeadStyle(darkMode)}>Employee Name</th>
              <th className="text-center" style={rowHeadStyle(darkMode)}>
                Paid Leave
              </th>
              <th className="text-center" style={rowHeadStyle(darkMode)}>
                Sick Leave
              </th>
              <th className="text-center" style={rowHeadStyle(darkMode)}>
                Casual Leave
              </th>
              <th className="text-center" style={rowHeadStyle(darkMode)}>
                Unpaid Leave
              </th>
              <th className="text-center" style={rowHeadStyle(darkMode)}>
                Paternity Leave
              </th>
              <th className="text-center" style={rowHeadStyle(darkMode)}>
                Maternity Leave
              </th>
              <th className="text-center" style={rowHeadStyle(darkMode)}>
                Non-Deductibles
              </th>
              <th className="text-center" style={rowHeadStyle(darkMode)}>
                Deductibles
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).length > 0 ? (
              Object.entries(groupedData).map(([employee, leaves]) => (
                <tr key={employee}>
                  <td
                    className="text-capitalize"
                    style={rowBodyStyle(darkMode)}
                  >
                    {employee}
                  </td>
                  <td
                    className="text-center"
                    style={rowBodyStyle(darkMode)}
                    onMouseEnter={() => {
                      if (leaves.leaveDetails["Paid Leave"]?.length) {
                        handleMouseEnter(
                          leaves.leaveDetails["Paid Leave"],
                          "Paid Leave"
                        );
                      }
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span style={{ cursor: "pointer", width: "100%" }}>
                      {leaves.paidLeave}
                    </span>

                    {popover.visible &&
                      popover.type === "Paid Leave" &&
                      leaves.leaveDetails["Paid Leave"]?.length > 0 && (
                        <div
                          style={{
                            background: !darkMode ? "black" : "white",
                            color: darkMode ? "black" : "white",
                          }}
                          className="popover border-0 shadow"
                        >
                          {popover.leaveDetails.map((detail, index) => {
                            const fromDate = new Date(detail.fromDate);
                            const toDate = new Date(detail.toDate);
                            const daysDifference = calculateLeaveDays(
                              detail.fromDate,
                              detail.toDate
                            );

                            return (
                              <div key={index}>
                                {`From: ${fromDate.toLocaleDateString()} To: ${
                                  !detail.toDate ||
                                  toDate.getTime() === new Date(0).getTime()
                                    ? "Half Day"
                                    : `${toDate.toLocaleDateString()} (${daysDifference} day${
                                        daysDifference > 1 ? "s" : ""
                                      })`
                                }`}
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </td>
                  <td
                    className="text-center"
                    style={rowBodyStyle(darkMode)}
                    onMouseEnter={() => {
                      if (leaves.leaveDetails["Sick Leave"]?.length) {
                        handleMouseEnter(
                          leaves.leaveDetails["Sick Leave"],
                          "Sick Leave"
                        );
                      }
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span style={{ cursor: "pointer", width: "100%" }}>
                      {leaves.sickLeave}
                    </span>

                    {popover.visible &&
                      popover.type === "Sick Leave" &&
                      leaves.leaveDetails["Sick Leave"]?.length > 0 && (
                        <div
                          style={{
                            background: !darkMode ? "black" : "white",
                            color: darkMode ? "black" : "white",
                          }}
                          className="popover border-0 shadow-sm"
                        >
                          {popover.leaveDetails.map((detail, index) => {
                            const fromDate = new Date(detail.fromDate);
                            const toDate = new Date(detail.toDate);
                            const daysDifference = calculateLeaveDays(
                              detail.fromDate,
                              detail.toDate
                            );

                            return (
                              <div key={index}>
                                {`From: ${fromDate.toLocaleDateString()} To: ${
                                  !detail.toDate ||
                                  toDate.getTime() === new Date(0).getTime()
                                    ? "Half Day"
                                    : `${toDate.toLocaleDateString()} (${daysDifference} day${
                                        daysDifference > 1 ? "s" : ""
                                      })`
                                }`}
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </td>

                  <td
                    className="text-center"
                    style={rowBodyStyle(darkMode)}
                    onMouseEnter={() => {
                      if (leaves.leaveDetails["Casual Leave"]?.length) {
                        handleMouseEnter(
                          leaves.leaveDetails["Casual Leave"],
                          "Casual Leave"
                        );
                      }
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span style={{ cursor: "pointer", width: "100%" }}>
                      {leaves.casualLeave}
                    </span>

                    {popover.visible &&
                      popover.type === "Casual Leave" &&
                      leaves.leaveDetails["Casual Leave"]?.length > 0 && (
                        <div
                          style={{
                            background: !darkMode ? "black" : "white",
                            color: darkMode ? "black" : "white",
                          }}
                          className="popover border-0 shadow-sm"
                        >
                          {popover.leaveDetails.map((detail, index) => {
                            const fromDate = new Date(detail.fromDate);
                            const toDate = new Date(detail.toDate);
                            const daysDifference = calculateLeaveDays(
                              detail.fromDate,
                              detail.toDate
                            );

                            return (
                              <div key={index}>
                                {`From: ${fromDate.toLocaleDateString()} To: ${
                                  !detail.toDate ||
                                  toDate.getTime() === new Date(0).getTime()
                                    ? "Half Day"
                                    : `${toDate.toLocaleDateString()} (${daysDifference} day${
                                        daysDifference > 1 ? "s" : ""
                                      })`
                                }`}
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </td>

                  <td
                    className="text-center"
                    style={rowBodyStyle(darkMode)}
                    onMouseEnter={() => {
                      if (leaves.leaveDetails["Unpaid Leave"]?.length) {
                        handleMouseEnter(
                          leaves.leaveDetails["Unpaid Leave"],
                          "Unpaid Leave"
                        );
                      }
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span style={{ cursor: "pointer", width: "100%" }}>
                      {leaves.unpaidLeave}
                    </span>

                    {popover.visible &&
                      popover.type === "Unpaid Leave" &&
                      leaves.leaveDetails["Unpaid Leave"]?.length > 0 && (
                        <div
                          style={{
                            background: !darkMode ? "black" : "white",
                            color: darkMode ? "black" : "white",
                          }}
                          className="popover border-0 shadow-sm"
                        >
                          {popover.leaveDetails.map((detail, index) => {
                            const fromDate = new Date(detail.fromDate);
                            const toDate = new Date(detail.toDate);
                            const daysDifference = calculateLeaveDays(
                              detail.fromDate,
                              detail.toDate
                            );

                            return (
                              <div key={index}>
                                {`From: ${fromDate.toLocaleDateString()} To: ${
                                  !detail.toDate ||
                                  toDate.getTime() === new Date(0).getTime()
                                    ? "Half Day"
                                    : `${toDate.toLocaleDateString()} (${daysDifference} day${
                                        daysDifference > 1 ? "s" : ""
                                      })`
                                }`}
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </td>
                  <td
                    className="text-center"
                    style={rowBodyStyle(darkMode)}
                    onMouseEnter={() => {
                      if (leaves.leaveDetails["Paternity Leave"]?.length) {
                        handleMouseEnter(
                          leaves.leaveDetails["Paternity Leave"],
                          "Paternity Leave"
                        );
                      }
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span style={{ cursor: "pointer", width: "100%" }}>
                      {leaves.paternityLeave}
                    </span>

                    {popover.visible &&
                      popover.type === "Paternity Leave" &&
                      leaves.leaveDetails["Paternity Leave"]?.length > 0 && (
                        <div
                          style={{
                            background: !darkMode ? "black" : "white",
                            color: darkMode ? "black" : "white",
                          }}
                          className="popover border-0 shadow-sm"
                        >
                          {popover.leaveDetails.map((detail, index) => {
                            const fromDate = new Date(detail.fromDate);
                            const toDate = new Date(detail.toDate);
                            const daysDifference = calculateLeaveDays(
                              detail.fromDate,
                              detail.toDate
                            );

                            return (
                              <div key={index}>
                                {`From: ${fromDate.toLocaleDateString()} To: ${
                                  !detail.toDate ||
                                  toDate.getTime() === new Date(0).getTime()
                                    ? "Half Day"
                                    : `${toDate.toLocaleDateString()} (${daysDifference} day${
                                        daysDifference > 1 ? "s" : ""
                                      })`
                                }`}
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </td>

                  <td
                    className="text-center"
                    style={rowBodyStyle(darkMode)}
                    onMouseEnter={() => {
                      if (leaves.leaveDetails["Maternity Leave"]?.length) {
                        handleMouseEnter(
                          leaves.leaveDetails["Maternity Leave"],
                          "Maternity Leave"
                        );
                      }
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span style={{ cursor: "pointer", width: "100%" }}>
                      {leaves.maternityLeave}
                    </span>

                    {popover.visible &&
                      popover.type === "Maternity Leave" &&
                      leaves.leaveDetails["Maternity Leave"]?.length > 0 && (
                        <div
                          style={{
                            background: !darkMode ? "black" : "white",
                            color: darkMode ? "black" : "white",
                          }}
                          className="popover border-0 shadow-sm"
                        >
                          {popover.leaveDetails.map((detail, index) => {
                            const fromDate = new Date(detail.fromDate);
                            const toDate = new Date(detail.toDate);
                            const daysDifference = calculateLeaveDays(
                              detail.fromDate,
                              detail.toDate
                            );

                            return (
                              <div key={index}>
                                {`From: ${fromDate.toLocaleDateString()} To: ${
                                  !detail.toDate ||
                                  toDate.getTime() === new Date(0).getTime()
                                    ? "Half Day"
                                    : `${toDate.toLocaleDateString()} (${daysDifference} day${
                                        daysDifference > 1 ? "s" : ""
                                      })`
                                }`}
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </td>

                  <td className="text-center" style={rowBodyStyle(darkMode)}>
                    <span style={{ cursor: "pointer", width: "100%" }}>
                      {leaves.totalNonDeductable}
                    </span>
                  </td>
                  <td
                    className="text-center text-danger fw-bold"
                    style={rowBodyStyle(darkMode)}
                  >
                    <span style={{ cursor: "pointer", width: "100%" }}>
                      {leaves.totalDeductable}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-3"
                  style={rowBodyStyle(darkMode)}
                >
                  No leave data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div
        style={{ color: darkMode ? "black" : "white" }}
        className="notes-section my-4"
      >
        <h5>Notes:</h5>
        <ul>
          <li>
            Paid Leave:
            <BsArrowRight className="mx-3" /> Non-deductible
          </li>
          <li>
            Sick Leave:
            <BsArrowRight className="mx-3" /> Deductible
          </li>
          <li>
            Casual Leave:
            <BsArrowRight className="mx-3" /> Non-deductible for the first
            leave; subsequent leaves are deductible.
          </li>
          <li>
            Unpaid Leave:
            <BsArrowRight className="mx-3" /> Deductible
          </li>
          <li>
            Paternity Leave:
            <BsArrowRight className="mx-3" /> Non-deductible
          </li>
          <li>
            Maternity Leave:
            <BsArrowRight className="mx-3" /> Non-deductible
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeaveRegister;
