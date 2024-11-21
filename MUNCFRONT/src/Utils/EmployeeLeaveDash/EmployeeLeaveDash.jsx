import React, { useEffect, useState } from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoTimerOutline } from "react-icons/io5";
import { LiaCapsulesSolid } from "react-icons/lia";
import { BsCurrencyRupee } from "react-icons/bs";
import { MdBabyChangingStation, MdOutlineSick } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { fetchPersonalInfo } from "../../redux/slices/personalInfoSlice";
import BASE_URL from "../../Pages/config/config";
import LeavePlaceHolder from "../../img/Leave/LeavePlaceHolder.svg";

const EmployeeLeaveDash = () => {
  const [leaveBalance, setLeaveBalance] = useState([]);
  const { userData } = useSelector((state) => state.user);
  const id = userData?._id;
  const { darkMode } = useTheme();
  const { empData } = useSelector((state) => state.personalInfo);

  const dispatch = useDispatch();

  useEffect(() => {
    const employeeId = userData?._id;
    dispatch(fetchPersonalInfo(employeeId));
  }, [dispatch]);

  // useEffect(() => {
  //   // Assuming empData contains the gender information
  //   const gender = empData?.Gender; // Fetch gender from empData
  //   axios
  //     .post(`${BASE_URL}/api/getLeave`, { id })
  //     .then((response) => {
  //       const formattedData = response.data
  //         .map((item) => {
  //           const leaveType = Object.keys(item)[0];
  //           const totalLeaveType = Object.keys(item)[1];

  //           return {
  //             leaveType: leaveType.replace(/([A-Z])/g, " $1").trim(),
  //             balance: item[leaveType],
  //             totalBalance: item[totalLeaveType],
  //             leaveTaken: item[totalLeaveType] - item[leaveType],
  //           };
  //         })
  //         .filter((leave) => {
  //           if (
  //             gender === "male" &&
  //             leave.leaveType.includes("maternity Leave")
  //           ) {
  //             return false;
  //           } else if (
  //             gender === "female" &&
  //             leave.leaveType.includes("paternity Leave")
  //           ) {
  //             return false;
  //           }
  //           return true;
  //         });

  //       setLeaveBalance(formattedData);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, [empData]); // Ensure empData is available before running this effect

  useEffect(() => {
    // Assuming empData contains the gender information
    const gender = empData?.Gender; // Fetch gender from empData

    axios
      .post(
        `${BASE_URL}/api/getLeave`,
        { id },
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      )
      .then((response) => {
        const formattedData = response.data
          .map((item) => {
            const leaveType = Object.keys(item)[0];
            const totalLeaveType = Object.keys(item)[1];

            return {
              leaveType: leaveType.replace(/([A-Z])/g, " $1").trim(),
              balance: item[leaveType],
              totalBalance: item[totalLeaveType],
              leaveTaken: item[totalLeaveType] - item[leaveType],
            };
          })
          .filter((leave) => {
            if (
              gender === "male" &&
              leave.leaveType.includes("maternity Leave")
            ) {
              return false;
            } else if (
              gender === "female" &&
              leave.leaveType.includes("paternity Leave")
            ) {
              return false;
            }
            return true;
          });

        setLeaveBalance(formattedData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [empData]);

  const setIcons = (key) => {
    switch (key) {
      case "paid Leave":
        return (
          <span
            style={{
              height: "1.3rem",
              width: "1.3rem",
              borderRadius: "50%",
              background: "#8ff18031",
              color: "#3ab927",
            }}
            className="d-flex  align-items-center justify-content-center"
          >
            <BsCurrencyRupee className="fs-6" />
          </span>
        );
      case "casual Leave":
        return (
          <span
            style={{
              height: "1.3rem",
              width: "1.3rem",
              borderRadius: "50%",
              background: "#ff5f3f2f",
              color: "#ff5f3f",
            }}
            className="d-flex  align-items-center justify-content-center"
          >
            <IoTimerOutline className="fs-5" />
          </span>
        );
      case "paternity Leave":
        return (
          <span
            style={{
              height: "1.3rem",
              width: "1.3rem",
              borderRadius: "50%",
              background: "#423fff2e",
              color: "#423fff",
            }}
            className="d-flex  align-items-center justify-content-center"
          >
            <MdBabyChangingStation className="fs-5" />
          </span>
        );
      case "maternity Leave":
        return (
          <span
            style={{
              height: "1.3rem",
              width: "1.3rem",
              borderRadius: "50%",
              background: "#423fff51",
              color: "#423fff",
            }}
            className="d-flex  align-items-center justify-content-center"
          >
            <MdBabyChangingStation className="fs-5" />
          </span>
        );

      default:
        return (
          <span
            style={{
              height: "1.3rem",
              width: "1.3rem",
              borderRadius: "50%",
              background: "#f3bf5d33",
              color: "#b37c16",
            }}
            className="d-flex  align-items-center justify-content-center"
          >
            <LiaCapsulesSolid />
          </span>
        );
    }
  };

  const removeLeaveText = (text) => {
    return text.replace(/Leave|leave/g, "").trim();
  };

  const userType = userData?.Account;

  const paths = {
    1: "/admin/todaysAttendance",
    2: "/hr/createLeave",
    3: "/employee/leaveApplication",
    4: "/manager/createLeave",
  };

  return (
    <div
      style={{
        height: "17rem",
        overflow: "hidden",
        color: darkMode ? "black" : "White",
        background: darkMode ? "#F5F5F6" : "#161515f6",
      }}
      className="p-2 px-3 shadow-sm rounded-2 d-flex flex-column gap-2"
    >
      <h5 className="my-0 fw-normal  d-flex align-items-center gap-2">
        <MdOutlineSick className="fs-4" /> Leave
      </h5>
      <div
        style={{ height: "calc(100% - 3rem)", overflow: "auto " }}
        className="row m-0 row-gap-2 pt-0"
      >
        {leaveBalance.length > 0 ? (
          <>
            {leaveBalance.map((leave, index) => (
              <div key={index} className="col-6 h-50 mb-1 mx-0 p-1">
                <div
                  style={{
                    background: !darkMode ? "#252424c3" : "white",
                    color: !darkMode ? "white" : "black",
                  }}
                  className="py-2 px-2 shadow-sm rounded-2"
                >
                  <h6 className="d-flex align-items-center text-capitalize gap-2">
                    {removeLeaveText(leave.leaveType)}{" "}
                    <span>{setIcons(leave.leaveType)} </span>
                  </h6>

                  <div className="d-flex align-items-center justify-content-between gap-2">
                    {" "}
                    <div>
                      Balance:{" "}
                      <span className="text-primary mx-2 text-success fw-bold">
                        {leave.balance}
                      </span>
                    </div>
                    <span style={{ color: "#dadada" }}>|</span>
                    <div>
                      Taken:{" "}
                      <span className="text-primary mx-2 text-danger  fw-bold">
                        {leave.leaveTaken}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div
            className="d-flex flex-column justify-content-center align-items-center gap-3"
            style={{ height: "100%", width: "100%" }}
          >
            <img
              style={{ height: "100px", width: "100px" }}
              className="mx-auto"
              src={LeavePlaceHolder}
              alt="Leave"
            />
            <p
              style={{ opacity: "60%", fontSize: "13px" }}
              className="text-center w-100 mx-auto"
            >
              You do not have any leave at this moment.
            </p>
          </div>
        )}
      </div>
      <Link
        // to={`/hr/createLeave`}
        to={paths[userType]}
        style={{ cursor: "pointer" }}
        className="btn bg-primary rounded-2 text-white w-100"
      >
        Apply Leave
      </Link>
    </div>
  );
};

export default EmployeeLeaveDash;
