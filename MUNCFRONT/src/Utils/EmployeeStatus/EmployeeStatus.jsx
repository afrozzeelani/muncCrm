import React, { useEffect, useState } from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { MdKeyboardArrowRight } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { LuUserMinus } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendanceData } from "../../redux/slices/attendanceSlice";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { GoClock } from "react-icons/go";
import { Link } from "react-router-dom";

const EmployeeStatus = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();
  const { attendanceData, status } = useSelector((state) => state.attendance);
  const { userData } = useSelector((state) => state.user);
  const [showAllAbsent, setShowAllAbsent] = useState(false);
  const [showAllHalfDay, setShowAllHalfDay] = useState(false);
  const [showAllBreak, setShowAllBreak] = useState(false);
  const usertype = userData?.Account;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAttendanceData());
    }
  }, [status, dispatch]);

  const handleToggleShowAllAbsent = () => {
    setShowAllAbsent((prevState) => !prevState);
  };

  const handleToggleShowAllHalfDay = () => {
    setShowAllHalfDay((prevState) => !prevState);
  };

  const handleToggleShowAllBreak = () => {
    setShowAllBreak((prevState) => !prevState);
  };

  // Separate Absent, Half Day, and Break data
  const absentData = attendanceData.filter(
    (attn) =>
      !attn?.attendance?.loginTime[0] ||
      attn?.attendance?.loginTime[0] === "WO" ||
      attn?.attendance === null
  );

  const halfDayData = attendanceData.filter((attn) => {
    const loginTime = attn?.attendance?.loginTime[0];
    if (!loginTime || loginTime === "WO" || attn?.attendance === null) {
      return false; // Exclude Absent data
    }

    const [hours, minutes] = loginTime.split(":").map(Number);
    return hours > 10 || (hours === 10 && minutes > 15);
  });

  const breakData = attendanceData.filter(
    (attn) =>
      attn?.attendance?.status &&
      attn?.attendance?.status.toLowerCase() === "break"
  );

  const displayedAbsentData = showAllAbsent
    ? absentData
    : absentData.slice(0, 2);
  const displayedHalfDayData = showAllHalfDay
    ? halfDayData
    : halfDayData.slice(0, 2);
  const displayedBreakData = showAllBreak ? breakData : breakData.slice(0, 2);
  console.log(displayedBreakData);

  const userType = userData?.Account;
  const paths = {
    1: "/admin/todaysAttendance",
    2: "/hr/todaysAttendance",
  };

  return (
    <div
      style={{
        height: "34rem",
        overflow: "hidden",
        color: darkMode ? "black" : "white",
        background: darkMode ? "#F5F5F6" : "#161515f6",
      }}
      className="p-2 px-3 shadow-sm rounded-2 d-flex flex-column gap-2"
    >
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="my-0 fw-normal d-flex align-items-center gap-2">
          <AiOutlineUser /> Employee Status
        </h5>

        <Link
          to={paths[userType]}
          style={{
            cursor: "pointer",
            minHeight: "1.6rem",
            minWidth: "1.6rem",
            background: darkMode ? "#ededf1d4" : "#252424c3",
          }}
          className="btn btn-light d-flex align-items-center bg-white rounded-5 my-2 px-2 py-0 "
        >
          View All <MdKeyboardArrowRight />
        </Link>
      </div>
      <div style={{ height: "30rem", overflow: "auto" }}>
        <hr
          className="m-0 my-2"
          style={{ border: "1px solid rgba(0,0,0,.3)" }}
        />

        {/* Absent Section */}
        <div className="p-2 px-3 mb-1 rounded-3 shadow-sm">
          <h6 className="text-start">Absent ({absentData.length})</h6>
          {displayedAbsentData.length > 0 ? (
            <div className="d-flex flex-column gap-2">
              {displayedAbsentData.map((attn, index) => (
                <div key={index} className="d-flex align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      style={{
                        height: "30px",
                        width: "30px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#ccc",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      {attn?.profile?.image_url ? (
                        <img
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            overflow: "hidden",
                            borderRadius: "50%",
                          }}
                          src={attn.profile.image_url}
                          alt={`${attn?.FirstName?.toUpperCase()} ${attn?.LastName?.toUpperCase()}`}
                        />
                      ) : (
                        `${attn?.FirstName?.[0]?.toUpperCase()}${attn?.LastName?.[0]?.toUpperCase()}`
                      )}
                    </div>
                    <div className="d-flex flex-column text-start text-capitalize">
                      <p className="m-0">
                        {attn?.FirstName} {attn?.LastName}
                      </p>
                      <p className="m-0">{attn?.department?.DepartmentName}</p>
                    </div>
                  </div>
                  <span className={`badge-danger ms-auto py-1`}>
                    <LuUserMinus className="my-auto" /> Absent
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-start">Great! No one is absent today.</p>
          )}
          {absentData.length > 2 && (
            <div className="d-flex">
              <button
                className="btn py-0 px-2 rounded-0 shadow-sm border my-2 mx-0"
                onClick={handleToggleShowAllAbsent}
              >
                {showAllAbsent ? (
                  <span
                    className="d-flex align-items-center gap-1"
                    style={{ color: darkMode ? "black" : "white" }}
                  >
                    Show Less <IoIosArrowUp />
                  </span>
                ) : (
                  <span
                    className="d-flex align-items-center gap-1"
                    style={{ color: darkMode ? "black" : "white" }}
                  >
                    Show more (+{absentData.length - 2}) <IoIosArrowDown />
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Half Day Section */}
        <div className="p-2 px-3 mb-1 rounded-3 shadow-sm">
          <h6 className="text-start mt-3">Half Day ({halfDayData.length})</h6>
          {displayedHalfDayData.length > 0 ? (
            <div className="d-flex flex-column gap-2">
              {displayedHalfDayData.map((attn, index) => (
                <div key={index} className="d-flex align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      style={{
                        height: "30px",
                        width: "30px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#ccc",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      {attn?.profile?.image_url ? (
                        <img
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            overflow: "hidden",
                            borderRadius: "50%",
                          }}
                          src={attn.profile.image_url}
                          alt={`${attn?.FirstName?.toUpperCase()} ${attn?.LastName?.toUpperCase()}`}
                        />
                      ) : (
                        `${attn?.FirstName?.[0]?.toUpperCase()}${attn?.LastName?.[0]?.toUpperCase()}`
                      )}
                    </div>
                    <div className="d-flex flex-column text-start text-capitalize">
                      <p className="m-0">
                        {attn?.FirstName} {attn?.LastName}
                      </p>
                      <p className="m-0">{attn?.department?.DepartmentName}</p>
                    </div>
                  </div>
                  <span className={`badge-warning ms-auto py-1`}>
                    <GoClock className="my-auto" /> Half Day
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-start">Good! No one is on half day today.</p>
          )}
          {halfDayData.length > 2 && (
            <div className="d-flex">
              <button
                className="btn py-0 px-2 rounded-0 shadow-sm border my-2 mx-0"
                onClick={handleToggleShowAllHalfDay}
              >
                {showAllHalfDay ? (
                  <span
                    className="d-flex align-items-center gap-1"
                    style={{ color: darkMode ? "black" : "white" }}
                  >
                    Show Less <IoIosArrowUp />
                  </span>
                ) : (
                  <span
                    className="d-flex align-items-center gap-1"
                    style={{ color: darkMode ? "black" : "white" }}
                  >
                    Show more (+{halfDayData.length - 2}) <IoIosArrowDown />
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Break Section */}
        <div className="p-2 px-3 mb-1 rounded-3 shadow-sm">
          <h6 className="text-start mt-3">Break ({breakData.length})</h6>
          {displayedBreakData.length > 0 ? (
            <div className="d-flex flex-column gap-2">
              {displayedBreakData.map((attn, index) => (
                <div key={index} className="d-flex align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      style={{
                        height: "30px",
                        width: "30px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#ccc",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      {attn?.profile?.image_url ? (
                        <img
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            overflow: "hidden",
                            borderRadius: "50%",
                          }}
                          src={attn.profile.image_url}
                          alt={`${attn?.FirstName?.toUpperCase()} ${attn?.LastName?.toUpperCase()}`}
                        />
                      ) : (
                        `${attn?.FirstName?.[0]?.toUpperCase()}${attn?.LastName?.[0]?.toUpperCase()}`
                      )}
                    </div>
                    <div className="d-flex flex-column text-start text-capitalize">
                      <p className="m-0">
                        {attn?.FirstName} {attn?.LastName}
                      </p>
                      <p className="m-0">{attn?.department?.DepartmentName}</p>
                    </div>
                  </div>
                  <span className={`badge-info ms-auto py-1`}>On Break</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-start">Nice! No one is on break currently.</p>
          )}
          {breakData.length > 2 && (
            <div className="d-flex">
              <button
                className="btn py-0 px-2 rounded-0 shadow-sm border my-2 mx-0"
                onClick={handleToggleShowAllBreak}
              >
                {showAllBreak ? (
                  <span
                    className="d-flex align-items-center gap-1"
                    style={{ color: darkMode ? "black" : "white" }}
                  >
                    Show Less <IoIosArrowUp />
                  </span>
                ) : (
                  <span
                    className="d-flex align-items-center gap-1"
                    style={{ color: darkMode ? "black" : "white" }}
                  >
                    Show more (+{breakData.length - 2}) <IoIosArrowDown />
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Present Section */}
        {/* <div className="p-2 px-3 mb-1 rounded-3 shadow-sm">
          <h6 className="text-start mt-3">Present</h6>
          {presentData.length > 0 ? (
            <div className="d-flex flex-column gap-2">
              {presentData.map((attn, index) => (
                <div key={index} className="d-flex align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      style={{
                        height: "30px",
                        width: "30px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#ccc",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      {attn?.profile?.image_url ? (
                        <img
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            overflow: "hidden",
                            borderRadius: "50%",
                          }}
                          src={attn.profile.image_url}
                          alt={`${attn?.FirstName?.toUpperCase()} ${attn?.LastName?.toUpperCase()}`}
                        />
                      ) : (
                        `${attn?.FirstName?.[0]?.toUpperCase()}${attn?.LastName?.[0]?.toUpperCase()}`
                      )}
                    </div>
                    <div className="d-flex flex-column text-start text-capitalize">
                      <p className="m-0">
                        {attn?.FirstName} {attn?.LastName}
                      </p>
                      <p className="m-0">{attn?.department?.DepartmentName}</p>
                    </div>
                  </div>
                  <span className={`badge-success ms-auto py-1`}>
                    Present
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-start">Everyone is accounted for.</p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default EmployeeStatus;

// import React, { useEffect, useState } from "react";
// import { useTheme } from "../../Context/TheamContext/ThemeContext";
// import { MdKeyboardArrowRight, MdOutlineArrowForwardIos } from "react-icons/md";
// import { AiOutlineUser } from "react-icons/ai";
// import { LuUserMinus } from "react-icons/lu";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAttendanceData } from "../../redux/slices/attendanceSlice";
// import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
// import { GoClock } from "react-icons/go";
// import { Link } from "react-router-dom";

// const EmployeeStatus = () => {
//   const { darkMode } = useTheme();
//   const dispatch = useDispatch();
//   const { attendanceData, status } = useSelector((state) => state.attendance);
//   const [showAllAbsent, setShowAllAbsent] = useState(false);
//   const [showAllHalfDay, setShowAllHalfDay] = useState(false);
//   const [showAllBreak, setShowAllBreak] = useState(false);

//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(fetchAttendanceData());
//     }
//   }, [status, dispatch]);

//   const handleToggleShowAllAbsent = () => {
//     setShowAllAbsent((prevState) => !prevState);
//   };

//   const handleToggleShowAllHalfDay = () => {
//     setShowAllHalfDay((prevState) => !prevState);
//   };

//   const handleToggleShowAllBreak = () => {
//     setShowAllBreak((prevState) => !prevState);
//   };

//   const getAttendanceMark = (user) => {
//     if (!user || !user.attendance) {
//       return "Absent";
//     }

//     const loginTime = user.attendance.loginTime && user.attendance.loginTime[0];

//     if (typeof loginTime !== "string") {
//       return "Absent";
//     }

//     const [loginHour, loginMinute] = loginTime.split(":").map(Number);

//     if (isNaN(loginHour) || isNaN(loginMinute)) {
//       return "Absent";
//     }

//     if (loginHour > 9 || (loginHour === 9 && loginMinute > 45)) {
//       return "Half Day";
//     } else if (loginHour === 9 && loginMinute > 30) {
//       return "Late";
//     }

//     return "Present";
//   };

//   // Separate Absent, Half Day, and Break data
//   const absentData = attendanceData.filter(
//     (attn) =>
//       !attn?.attendance?.loginTime[0] ||
//       attn?.attendance?.loginTime[0] === "WO" ||
//       attn?.attendance === null
//   );

//   const halfDayData = attendanceData.filter((attn) => {
//     const loginTime = attn?.attendance?.loginTime[0];
//     if (!loginTime || loginTime === "WO" || attn?.attendance === null) {
//       return false; // Exclude Absent data
//     }

//     const [hours, minutes] = loginTime.split(":").map(Number);
//     return hours > 9 || (hours === 9 && minutes > 45);
//   });

//   // Corrected Break Data
//   const breakData = attendanceData.filter(attn =>
//     attn?.attendance?.status && attn?.attendance?.status.toLowerCase() === "break"
//   );

//   // Present data if none of the other categories are populated
//   const presentData = attendanceData.filter(attn =>
//     !absentData.includes(attn) &&
//     !halfDayData.includes(attn) &&
//     !breakData.includes(attn)
//   );

//   const displayedAbsentData = showAllAbsent ? absentData : absentData.slice(0, 2);
//   const displayedHalfDayData = showAllHalfDay ? halfDayData : halfDayData.slice(0, 2);
//   const displayedBreakData = showAllBreak ? breakData : breakData.slice(0, 2);

//   console.log(displayedHalfDayData);

//   const userType = localStorage.getItem("Account");
//   const paths = {
//     1: "/admin/todaysAttendance",
//     2: "/hr/todaysAttendance",
//   };

//   return (
//     <div
//       style={{
//         height: "34rem",
//         overflow: "hidden",
//         color: darkMode ? "black" : "white",
//         background: darkMode ? "#F5F5F6" : "#161515f6",
//       }}
//       className="p-2 px-3 shadow-sm rounded-2 d-flex flex-column gap-2"
//     >
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h5 style={{ color: darkMode ? "black" : "white" }}>
//           Employee Attendance
//         </h5>
//         <Link
//           to={paths[userType]}
//           className="text-decoration-none text-primary"
//         >
//           View Full Report <MdOutlineArrowForwardIos />
//         </Link>
//       </div>

//       {/* Absent Section */}
//       <div>
//         <h6 className="mb-1">
//           Absent ({absentData.length}){" "}
//           {showAllAbsent ? (
//             <IoIosArrowUp onClick={handleToggleShowAllAbsent} />
//           ) : (
//             <IoIosArrowDown onClick={handleToggleShowAllAbsent} />
//           )}
//         </h6>
//         {displayedAbsentData.length > 0 ? (
//           displayedAbsentData.map((attn, idx) => (
//             <div key={idx} className="d-flex align-items-center gap-2">
//               <AiOutlineUser /> {attn.name || "Unknown"}
//             </div>
//           ))
//         ) : (
//           <p>No absent data.</p>
//         )}
//       </div>

//       {/* Half Day Section */}
//       <div>
//         <h6 className="mb-1">
//           Half Day ({halfDayData.length}){" "}
//           {showAllHalfDay ? (
//             <IoIosArrowUp onClick={handleToggleShowAllHalfDay} />
//           ) : (
//             <IoIosArrowDown onClick={handleToggleShowAllHalfDay} />
//           )}
//         </h6>
//         {displayedHalfDayData.length > 0 ? (
//           displayedHalfDayData.map((attn, idx) => (
//             <div key={idx} className="d-flex align-items-center gap-2">
//               <LuUserMinus /> {attn.name || "Unknown"}
//             </div>
//           ))
//         ) : (
//           <p>No half day data.</p>
//         )}
//       </div>

//       {/* Break Section */}
//       <div>
//         <h6 className="mb-1">
//           Break ({breakData.length}){" "}
//           {showAllBreak ? (
//             <IoIosArrowUp onClick={handleToggleShowAllBreak} />
//           ) : (
//             <IoIosArrowDown onClick={handleToggleShowAllBreak} />
//           )}
//         </h6>
//         {displayedBreakData.length > 0 ? (
//           displayedBreakData.map((attn, idx) => (
//             <div key={attn} className="d-flex align-items-center">
//             <div className="d-flex align-items-center gap-2">
//                          <div
//                            style={{
//                              height: "30px",
//                              width: "30px",
//                              borderRadius: "50%",
//                              overflow: "hidden",
//                              display: "flex",
//                              alignItems: "center",
//                              justifyContent: "center",
//                              backgroundColor: "#ccc", // background color for the initials
//                              borderRadius: "50%",
//                              fontSize: "14px",
//                              fontWeight: "bold",
//                              color: "#fff",
//                            }}
//                          >
//                              {attn?.profile?.image_url ? (
//                                  <img
//                                    style={{
//                                      height: "100%",
//                                      width: "100%",
//                                      objectFit: "cover",
//                                      overflow: "hidden",
//                                      borderRadius: "50%",
//                                    }}
//                                    src={attn.profile.image_url}
//                                    alt={`${attn?.FirstName?.toUpperCase()} ${attn?.LastName?.toUpperCase()}`} // Capitalized alt text
//                                    />

//                                ) : (
//                                `${attn?.FirstName?.[0]?.toUpperCase()}${attn?.LastName?.[0]?.toUpperCase()}`
//                                )}
//                          </div>
//                          <div className="d-flex flex-column text-start text-capitalize">
//                            <p className="m-0">
//                              {attn?.FirstName} {attn?.LastName}
//                            </p>
//                            <p className="m-0">{attn?.department?.DepartmentName}</p>
//                          </div>
//                        </div>
//                <span
//                  className={`${
//                    darkMode
//                      ? "badge-warning ms-auto py-1"
//                      : "badge-warning-dark ms-auto py-1"
//                  }`}
//                >
//                  <GoClock /> {attn?.attendance?.status || "Absent"}
//                </span>
//              </div>
//           ))
//         ) : (
//           <p>No break data.</p>
//         )}
//       </div>

//       {/* Present Section */}
//       <div>
//         <h6 className="mb-1">Present ({presentData.length})</h6>
//         {presentData.length > 0 ? (
//           presentData.map((attn, idx) => (
//             <div key={idx} className="d-flex align-items-center gap-2">
//               <AiOutlineUser /> {attn.name || "Unknown"}
//             </div>
//           ))
//         ) : (
//           <p>No present data.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeeStatus;
