import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AiOutlineMore } from "react-icons/ai";
import { RxCaretSort, RxCounterClockwiseClock } from "react-icons/rx";
import SearchLight from "../../img/Attendance/SearchLight.svg";
import {
  HiOutlineLogin,
  HiOutlineLogout,
  HiStatusOnline,
} from "react-icons/hi";
import { FaUserClock } from "react-icons/fa6";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import Pagination from "../../Utils/Pagination";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import Modal from "react-modal";

const TodaysAttendance = () => {
  // const [activeCategory, setActiveCategory] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { darkMode } = useTheme();
  const [selectedFields, setSelectedFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/todays-attendance`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        });
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching today's attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/company`, {
        headers: { authorization: localStorage.getItem("token") || "" },
      })
      .then((response) => {
        setCompanyData(response.data[0]);
      })
      .catch((error) => console.log(error));
  }, []);

  const companyRecords = {
    CompanyName: companyData.CompanyName,
    Address: companyData.Address,
    city: companyData?.city?.CityName,
    PostalCode: companyData.PostalCode,
    PanNo: companyData.PanNo,
    GSTNo: companyData.GSTNo,
    CINNo: companyData.CINNo,
    ContactNo: companyData.ContactNo,
    Email: companyData.Email,
  };

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  let dayCurrent = today.getDay();

  const getAttendanceMark = (user) => {
    // Check if user and attendance are defined
    if (!user || !user.attendance) {
      return "Absent";
    }

    const loginTime = user.attendance.loginTime && user.attendance.loginTime[0];

    // Check if loginTime exists and is a string
    if (typeof loginTime !== "string") {
      return "Absent";
    }

    // Split loginTime only if it exists
    const [loginHour, loginMinute] = loginTime.split(":").map(Number);

    // Check if loginHour and loginMinute are valid numbers
    if (isNaN(loginHour) || isNaN(loginMinute)) {
      return "Absent";
    }

    // Check login time against criteria
    if (loginHour > 9 || (loginHour === 9 && loginMinute > 45)) {
      return "Half Day";
    } else if (loginHour > 9 || (loginHour === 9 && loginMinute > 30)) {
      return "Late";
    }

    // If loginTime exists, consider the user present, otherwise absent
    return loginTime ? "Present" : "Absent";
  };

  const status = (s) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[s];
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) =>
      sortField === field ? (prevOrder === "asc" ? "desc" : "asc") : "asc"
    );
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const renderSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === "asc" ? "▴" : "▾";
    }
    return null;
  };

  // const sortedAndFilteredData = attendanceData
  //   .slice()
  //   .filter((item) =>
  //     item.FirstName.toLowerCase().includes(searchQuery.toLowerCase())
  //   )
  //   .sort((a, b) => {
  //     if (sortField) {
  //       const aValue = a[sortField];
  //       const bValue = b[sortField];

  //       if (typeof aValue === "string" && typeof bValue === "string") {
  //         return sortOrder === "asc"
  //           ? aValue.localeCompare(bValue)
  //           : bValue.localeCompare(aValue);
  //       } else {
  //         return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  //       }
  //     }
  //     return 0;
  //   });
  const sortedAndFilteredData = useMemo(() => {
    return attendanceData
      .filter((item) =>
        item.FirstName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortField) {
          const aValue = a[sortField];
          const bValue = b[sortField];
          return typeof aValue === "string"
            ? sortOrder === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
            : sortOrder === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }
        return 0;
      });
  }, [attendanceData, searchQuery, sortField, sortOrder]);

  function convertMinutesToHoursAndMinutes(minutes) {
    // Calculate hours
    var hours = Math.floor(minutes / 60);
    // Calculate remaining minutes
    var remainingMinutes = minutes % 60;

    return hours + " Hrs " + remainingMinutes + " Min";
  }

  const availableFields = [
    { label: "Employee ID", value: "empID" },
    { label: "Employee Name", value: "employeeName" },
    { label: "Login Time (24Hrs)", value: "loginTime" },
    { label: "Logout Time (24Hrs)", value: "logoutTime" },
    { label: "Total Login Time", value: "totalLoginTime" },
    { label: "Log Count", value: "logCount" },
    { label: "Gross Login", value: "grossLogin" },
    { label: "Total Break", value: "totalBreak" },
    { label: "Net Login", value: "netLogin" },
    { label: "Status", value: "status" },
    { label: "Break Count", value: "breakCount" },
    { label: "Mark", value: "mark" },
  ];

  const handleFieldChange = (field) => {
    setSelectedFields((prevFields) =>
      prevFields.includes(field)
        ? prevFields.filter((f) => f !== field)
        : [...prevFields, field]
    );
  };

  const handleSelectAll = () => {
    if (selectedFields.length === availableFields.length) {
      // Deselect all if all are currently selected
      setSelectedFields([]);
    } else {
      // Select all
      const allFieldValues = availableFields.map((field) => field.value);
      setSelectedFields(allFieldValues);
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const exportToExcel = () => {
    const dataToExport = attendanceData.map((user) => {
      const userData = {};
      selectedFields.forEach((field) => {
        if (field === "empID") {
          userData["Employee ID"] = user.empID.toUpperCase();
        }
        if (field === "employeeName") {
          userData["Employee Name"] =
            user.FirstName.toUpperCase() + " " + user.LastName.toUpperCase();
        }
        if (field === "loginTime") {
          userData["Login Time (24Hrs)"] = user.attendance
            ? user.attendance.loginTime[0]
            : "--";
        }
        if (field === "logoutTime") {
          userData["Logout Time (24Hrs)"] = user.attendance
            ? user.attendance.logoutTime[user.attendance.logoutTime.length - 1]
            : "--";
        }
        if (field === "totalLoginTime") {
          userData["Total Login Time"] = user.attendance
            ? convertMinutesToHoursAndMinutes(
                user.attendance.totalLogAfterBreak
              ).toUpperCase()
            : "--";
        }
        if (field === "logCount") {
          userData["Log Count"] = user.logCount || "--";
        }
        if (field === "grossLogin") {
          userData["Gross Login"] = user.grossLogin || "--";
        }
        if (field === "totalBreak") {
          userData["Total Break"] = user.totalBreak || "--";
        }
        if (field === "netLogin") {
          userData["Net Login"] = user.netLogin || "--";
        }
        if (field === "status") {
          userData["Status"] = user.status || "--";
        }
        if (field === "breakCount") {
          userData["Break Count"] = user.breakCount || "--";
        }
        if (field === "mark") {
          userData["Mark"] = getAttendanceMark(user).toUpperCase();
        }
      });
      return userData;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Add the caption at the top of the worksheet
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          `${companyRecords.CompanyName}`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          `Address : ${companyRecords.Address}`,
          `${companyRecords.city}`,
          `${companyRecords.PostalCode}`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          `CIN NO : ${companyRecords.CINNo}`,
          "",
          `GST NO : ${companyRecords.GSTNo}`,
          "",
          `PAN NO : ${companyRecords.PanNo}`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          `Email : ${companyRecords.Email}`,
          "",
          `Contact : ${companyRecords.ContactNo}`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ["", "", "", "", "", "", "", "", "", "", "", ""],
      ],
      {
        origin: "A1", // Set the origin to A1 for the caption
      }
    );

    // Add the data starting from the next row (now A5)
    XLSX.utils.sheet_add_json(worksheet, dataToExport, {
      header: [],
      skipHeader: false,
      origin: "A6",
    });

    // Add the export time to the last row
    const exportTime = `Exported on ${new Date().toLocaleString()}`;
    XLSX.utils.sheet_add_aoa(worksheet, [[exportTime]], {
      origin: "A" + (dataToExport.length + 8),
    }); // Adjust to the last row

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    XLSX.writeFile(workbook, "attendance.xlsx");
    closeModal(); // Close the modal after export
  };

  const handlePaginationNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePaginationPrev = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAndFilteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(sortedAndFilteredData.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="container-fluid pb-5">
      <div className="d-flex justify-content-between py-3">
        <div>
          <h5
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
            className=" my-auto"
          >
            Today's Attendance
          </h5>
          <span className="p-0 fs-6 d-flex ">
            <span
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--primaryDashMenuColor)",
              }}
              className="m-0 p-0 fs-6 text-center"
            >
              {status(dayCurrent)} , <span>{dd}</span> - <span>{mm}</span> -
              <span>{yyyy}</span>
            </span>
          </span>
        </div>
        <div>
          <div className="d-flex gap-2">
            <input
              value={searchQuery}
              onChange={handleInputChange}
              type="search"
              className="form-control d-none d-sm-flex rounded-5"
              placeholder="Search by employee name"
            />
            <button
              className="btn d-flex gap-2 align-items-center justify-content-center m-auto shadow-sm rounded-5"
              onClick={openModal}
              style={{
                whiteSpace: "pre",
                color: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              <SiMicrosoftexcel className="text-success fs-5" />
              <span className="d-none d-md-flex text-success">Export XLSX</span>
            </button>
          </div>
        </div>
      </div>
      <div className="d-flex d-sm-none">
        <input
          value={searchQuery}
          onChange={handleInputChange}
          type="search"
          className="form-control mb-3 rounded-0"
          placeholder="Search by employee name"
        />
      </div>
      <div>
        {currentItems.length > 0 ? (
          <div>
            <div
              style={{
                // maxHeight: "68vh",
                overflow: "auto",
                position: "relative",
              }}
              className="table-responsive p-2 mb-3"
            >
              <table className="table" style={{ fontSize: ".9rem" }}>
                <thead>
                  <tr style={{ position: "sticky", top: "0", zIndex: "1" }}>
                    <th
                      onClick={() => handleSort("FirstName")}
                      style={rowHeadStyle(darkMode)}
                    >
                      <RxCaretSort /> Employee {renderSortIcon("FirstName")}
                    </th>
                    <th style={rowHeadStyle(darkMode)}>
                      {" "}
                      <HiOutlineLogin /> Login Time{" "}
                    </th>
                    <th style={rowHeadStyle(darkMode)}>
                      {" "}
                      Logout Time <HiOutlineLogout />{" "}
                    </th>

                    <th style={rowHeadStyle(darkMode)}>
                      {" "}
                      <RxCounterClockwiseClock /> Log Count{" "}
                    </th>
                    <th style={rowHeadStyle(darkMode)}>
                      {" "}
                      Gross Login <HiOutlineLogout />{" "}
                    </th>
                    <th style={rowHeadStyle(darkMode)}> Total Break </th>
                    <th style={rowHeadStyle(darkMode)}>
                      {" "}
                      <FaUserClock /> Net Login{" "}
                    </th>
                    <th style={rowHeadStyle(darkMode)}>
                      {" "}
                      Status <HiStatusOnline />
                    </th>
                    <th style={rowHeadStyle(darkMode)}>
                      {" "}
                      <IoCheckmarkDoneOutline /> Mark{" "}
                    </th>
                    <th style={rowHeadStyle(darkMode)} className="text-center">
                      {" "}
                      Break Count
                    </th>
                    <th style={rowHeadStyle(darkMode)}></th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((user) => {
                    const mark = getAttendanceMark(user);
                    return (
                      <tr
                        style={{ position: "sticky", top: "0" }}
                        key={user.userId}
                      >
                        <td style={rowBodyStyle(darkMode)}>
                          <div className="d-flex w-100 align-items-center gap-2">
                            <div
                              style={{
                                height: "35px",
                                width: "35px",
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#ccc", // background color for the initials
                                borderRadius: "50%",
                                fontSize: "14px",
                                fontWeight: "bold",
                                color: "#fff",
                              }}
                            >
                              {user?.profile?.image_url ? (
                                <img
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    objectFit: "cover",
                                    overflow: "hidden",
                                    borderRadius: "50%",
                                  }}
                                  src={user.profile.image_url}
                                  alt={`${user?.FirstName} ${user?.LastName}`}
                                />
                              ) : (
                                `${user?.FirstName?.[0]}${user?.LastName?.[0]}`
                              )}
                            </div>
                            <div>
                              <p
                                style={{ fontSize: ".75rem" }}
                                className="p-0 m-0 w-100"
                              >
                                {user.empID}
                              </p>
                              <p
                                style={{ fontSize: ".80rem" }}
                                className="p-0 m-0 w-100 text-uppercase"
                              >
                                {user.FirstName} {user.LastName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          {user.attendance
                            ? user.attendance.loginTime[0]
                            : "--"}
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          {user.attendance
                            ? user.attendance.logoutTime[
                                user.attendance.logoutTime.length - 1
                              ]
                            : "--"}
                        </td>
                        <td
                          className="text-center"
                          style={rowBodyStyle(darkMode)}
                        >
                          {user.attendance
                            ? user.attendance.loginTime.length
                            : "--"}
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          {user.attendance
                            ? convertMinutesToHoursAndMinutes(
                                user.attendance.TotalLogin
                              )
                            : "--"}
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          {user.attendance
                            ? convertMinutesToHoursAndMinutes(
                                user.attendance.totalBrake
                              )
                            : "--"}
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          {user.attendance
                            ? convertMinutesToHoursAndMinutes(
                                user.attendance.totalLogAfterBreak
                              )
                            : "--"}
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          {user.attendance ? user.attendance.status : "--"}
                        </td>
                        <td style={rowBodyStyle(darkMode)}>
                          <span
                            style={{ fontSize: ".8rem" }}
                            className={`py-0 px-3 rounded-5 ${
                              mark === "Present"
                                ? "border border-success"
                                : mark === "Late"
                                ? "border border-info"
                                : mark === "Half Day"
                                ? "border border-warning"
                                : "border border-danger"
                            }`}
                          >
                            {mark}
                          </span>
                        </td>
                        <td
                          className="text-center"
                          style={rowBodyStyle(darkMode)}
                        >
                          {user.attendance
                            ? user.attendance.breakTime.length
                            : "--"}
                        </td>
                        {/* <td style={rowBodyStyle(darkMode)}>
                          <button
                            onMouseEnter={() => setActiveCategory(user)}
                            onMouseLeave={() => setActiveCategory(null)}
                            className=" btn p-0 fw-bold fs-5 position-relative"
                          >
                            <AiOutlineMore style={rowBodyStyle(darkMode)} />{" "}
                            <span
                              style={{
                                display:
                                  activeCategory === user ? "flex" : "none",
                              }}
                            >
                              <Link
                                to="/hr/viewAttenDance"
                                style={{
                                  position: "absolute",
                                  whiteSpace: "pre",
                                  right: "70%",
                                  bottom: "-50%",
                                  zIndex: "2",
                                }}
                                className="shadow px-2 py-0  fs-6 bg-white rounded-5"
                              >
                                Detailed
                              </Link>
                            </span>
                          </button>{" "}
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              pageNumbers={pageNumbers}
              handlePaginationPrev={handlePaginationPrev}
              handlePaginationNext={handlePaginationNext}
              setCurrentPage={setCurrentPage}
              filteredDataLength={sortedAndFilteredData.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        ) : (
          <div
            style={{
              minHeight: "70vh",
              maxHeight: "70vh",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              wordSpacing: "5px",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            <img
              style={{
                height: "auto",
                width: "20%",
              }}
              src={SearchLight}
              alt="img"
            />
            <p
              className="text-center w-75 mx-auto"
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var( --primaryDashMenuColor)",
              }}
            >
              Sorry records not found or attendance not marked yet.
            </p>
          </div>
        )}
      </div>
      {/* Modal for field selection */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Export Fields"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            height: "auto",
            padding: "13px",
            borderRadius: ".5rem",
            color: !darkMode ? "White" : "black",
            background: darkMode ? "White" : "black",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
        }}
      >
        <h5>Select Fields to Export</h5>
        <hr />
        <div>
          <label className="d-flex gap-3 align-items-center">
            <input
              type="checkbox"
              style={{ height: "1.4rem", width: "1.4rem" }}
              checked={selectedFields.length === availableFields.length}
              onChange={handleSelectAll}
            />
            Select All
          </label>
        </div>
        <hr />
        <div className="row">
          {availableFields.map((field) => (
            <div className="col-12 col-md-6" key={field.value}>
              <label className="d-flex gap-3 align-items-center">
                <input
                  type="checkbox"
                  style={{ height: "1.4rem", width: "1.4rem" }}
                  value={field.value}
                  checked={selectedFields.includes(field.value)}
                  onChange={() => handleFieldChange(field.value)}
                />
                <span>{field.label}</span>
              </label>
            </div>
          ))}
        </div>
        <hr />
        <div className="d-flex align-items-center gap-3 ">
          <button
            onClick={exportToExcel}
            className="btn btn-primary rounded-3 mt-2"
          >
            Export
          </button>
          <button
            onClick={closeModal}
            className="btn btn-danger rounded-3 mt-2 "
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TodaysAttendance;
