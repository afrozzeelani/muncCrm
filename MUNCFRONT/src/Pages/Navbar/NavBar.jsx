import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Logo from "../../img/logo.webp";
import { BsArrowRight } from "react-icons/bs";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";
import { useNavigate } from "react-router-dom";
import addNotification from "react-push-notification";
import { useLocation } from "react-router-dom";
import DarkModeToggle from "../TheamChanger/DarkModeToggle";
import { LuMenu } from "react-icons/lu";
import { useSidebar } from "../../Context/AttendanceContext/smallSidebarcontext";
import profile from "../../img/profile.jpg";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import SearchComponent from "../../Utils/SearchComponent/SearchComponent";
import { TbBell } from "react-icons/tb";
import GoBack from "../../Utils/GoBack/GoBack";
import { useSelector, useDispatch } from "react-redux";
import { persistStore } from "redux-persist";
import { store } from "../../redux/store";
import { jwtDecode } from "jwt-decode";
import { attendanceInfo } from "../../redux/slices/loginSlice";
import BreakIndicator from "../../Utils/BreakIndicator/BreakIndicator";
import { addDetails } from "../../redux/slices/messageSlice";

const NavBar = (props, data) => {
  const persistor = persistStore(store);
  const isonBreak = localStorage.getItem("breakStartTime");
  const [activeProfile, setActiveProfile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const location = useLocation().pathname.split("/")[1];
  const pathname = useLocation().pathname;
  const goBackToggle = useLocation().pathname.split("/")[2];

  const { userData } = useSelector((state) => state.user);
  const decodeToken = (token) => {
    // Check if token structure is valid
    const parts = token.split(".");
    if (parts.length !== 3) {
      localStorage.clear();
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      localStorage.clear();
      navigate("/");
      return null;
    }
  };

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const decodedToken = decodeToken(token);

        if (!decodedToken || !decodedToken.Account) {
          navigate("/");
          return;
        }

        // Compare token account with Redux userData
        if (userData?.Account !== decodedToken.Account) {
          localStorage.clear();
          await persistor.purge();
          navigate("/"); // Redirect to login if accounts mismatch
          return;
        }

        // Prepare request body
        const body = {
          _id: userData?._id,
          Account: userData?.Account,
        };

        // API request to verify account
        await axios.post(`${BASE_URL}/api/verifyAccount`, body, {
          headers: {
            authorization: token,
          },
        });
      } catch (error) {
        console.error("Error during verification:", error);
        // Handle Unauthorized Access or other errors
        if (error.response?.data?.error === "Unauthorized Access") {
          localStorage.clear();
          await persistor.purge(); // Clear persisted Redux store
          navigate("/"); // Redirect to login
        } else {
          // Other error handling, if necessary
          console.error("Account verification failed:", error);
        }
      }
    };

    verifyAccount(); // Call the async function

    // No need for cleanup function here, so just return undefined
  }, [pathname, userData]);

  const handleLogout = async () => {
    try {
      dispatch(attendanceInfo({ employeeId: userData._id, status: "logout" }));

      localStorage.clear();
      await persistor.purge();

      window.location.href = "/";

      if (userData) {
        socket.emit("logoutUser", {
          manager: userData.reportHr || userData.reportManager,
          user: userData.Email,
        });

        if (!userData.Email) {
          alert("Please select an employee");
          return;
        }

        alert("Logout time recorded successfully");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const [notification, setNotification] = useState([]);
  const [employeeData, setEmployeeData] = useState("");
  const [notiToggle, setNotiToggle] = useState(false);
  const { socket } = useContext(AttendanceContext);
  const { toggleSidebar } = useSidebar();
  const [loginNoti, setLoginNoti] = useState(true);

  const id = userData?._id;

  const email = userData?.Email;
  const pushNotification = (taskName) => {
    addNotification({
      title: "Kasper",
      subtitle: taskName,
      duration: 4000,
      icon: Logo,
      native: true,
    });
  };
  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/particularEmployee/${id}`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setEmployeeData(response.data);
        setNotification(response.data.Notification);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    loadEmployeeData();
  }, []);
  const notificationDeleteHandler = (id) => {
    axios
      .post(
        `${BASE_URL}/api/notificationDeleteHandler/${id}`,
        { email },
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      )
      .then((response) => {
        setEmployeeData(response.data.result);
        setNotification(response.data.result.Notification);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const notificationHandler = (id, path, val) => {
    axios
      .post(
        `${BASE_URL}/api/notificationStatusUpdate/${id}`,
        { email },
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      )
      .then((response) => {
        setEmployeeData(response.data.result);
        setNotification(response.data.result.Notification);
        if (path === "emp_manager" || path === "admin_manager") {
          dispatch(
            addDetails({
              taskId: val.taskIden,
              to: val.to,
              profile: employeeData.profile,
              name: `${employeeData.FirstName} ${employeeData.LastName}`,
            })
          );
        }
        navigate(`/${location}/${path}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleNotificationRequest = () => {
    // Check if the browser supports notifications
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // Permission granted, you can now trigger notifications
        }
      });
    }
  };
  useEffect(() => {
    // console.log('Socket:', socket.id);
    socket.emit("userConnected", { email });
    handleNotificationRequest();
    if (socket) {
      socket.on("taskNotificationReceived", (data) => {
        if (data.Account === 4) {
          if (data.managerEmail === email) {
            setNotification((prev) => [data, ...prev]);
            pushNotification(data.message);
          }
        } else if (data.Account === 2 || data.Account === 3) {
          let emp = data.employeesEmail.filter((val) => {
            return val === email && val !== data.senderMail;
          });
          if (emp.length > 0) {
            setNotification((prev) => [data, ...prev]);
            pushNotification(data.message);
          }
        } else if (data.Account === 1) {
          if (data.adminMail === email) {
            setNotification((prev) => [data, ...prev]);
            pushNotification(data.message);
          }
        }
      });
      socket.on("notificationPageUpdate", (data) => {
        if (data) {
          loadEmployeeData();
        }
      });
      socket.on("leaveNotificationReceived", (data) => {
        const {
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile,
        } = data;

        const data1 = {
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile,
        };
        setNotification((prev) => [data1, ...prev]);
        pushNotification(data1.message);
      });
      socket.on("leaveManagerStatusNotificationReceived", (data) => {
        const {
          message,
          status,
          path,
          taskId,
          employeeEmail,
          hrEmail,
          managerEmail,
          messageBy,
          profile,
        } = data;
        if (location === "employee") {
          const data1 = {
            message,
            status,
            path,
            taskId,
            employeeEmail,
            hrEmail,
            messageBy,
            profile,
          };
          setNotification((prev) => [data1, ...prev]);
          pushNotification(data1.message);
        } else if (location === "hr") {
          const data1 = {
            message,
            status,
            path,
            taskId,
            employeeEmail,
            hrEmail,
            messageBy,
            profile,
          };
          setNotification((prev) => [data1, ...prev]);
          pushNotification(data1.message);
        } else if (location === "manager") {
          const data1 = {
            message,
            status,
            path,
            taskId,
            employeeEmail,
            managerEmail,
            messageBy,
            profile,
          };
          setNotification((prev) => [data1, ...prev]);
          pushNotification(data1.message);
        }
      });
      socket.on("updateNoitification", (data) => {
        const {
          message,
          status,
          path,
          taskId,
          taskIden,
          to,
          messageBy,
          profile,
        } = data;

        const data1 = {
          message,
          status,
          path,
          taskId,
          taskIden,
          to,
          messageBy,
          profile,
        };
        setNotification((prev) => [data1, ...prev]);
        pushNotification(data1.message);
      });
    }
  }, [socket]);
  const clearAllHandler = () => {
    if (notification.length > 0) {
      axios
        .post(
          `${BASE_URL}/api/selectedNotificationDelete`,
          { email },
          {
            headers: {
              authorization: localStorage.getItem("token") || "",
            },
          }
        )
        .then((response) => {
          setNotification(response.data.result.Notification);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  let uniqueNotification = notification.filter((val, index, arr) => {
    return (
      val.status === "unseen" &&
      arr.findIndex((item) => item.taskId === val.taskId) === index
    );
  });

  const handleClick = () => {
    toggleSidebar();
  };

  const handleUserLogin = (data) => {
    const showNotification = (data) => {
      if (data) {
        const { message } = data;

        toast.success(message, {
          duration: 2000,
          position: "top-right",
          style: {
            color: "green",
            backgroundColor: "white",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
            zIndex: "9999",
          },
          toastClassName: "custom-toast",
        });
      }
    };
    if (loginNoti) {
      showNotification(data);
    }
  };
  const handleUserLogout = (data) => {
    const showNotification = (data) => {
      if (data) {
        const { message } = data;

        toast.error(message, {
          duration: 2000,
          position: "top-right",
          style: {
            color: "white",
            backgroundColor: "red",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
            zIndex: "9999",
          },
          toastClassName: "custom-toast",
        });
      }
    };

    if (loginNoti) {
      showNotification(data);
    }
  };
  const navigationHandler = (path, data) => {
    console.log(data);
    if (data.path === "emp_manager" || data.path === "admin_manager") {
      dispatch(
        addDetails({
          taskId: data.taskIden,
          to: data.to,
          profile: employeeData.profile,
          name: `${employeeData.FirstName} ${employeeData.LastName}`,
        })
      );
    }

    navigate(path);
  };
  useEffect(() => {
    socket.on("userLogin", handleUserLogin);
    socket.on("userLogout", handleUserLogout);
    return () => {
      socket.off("userLogin", handleUserLogin);
      socket.off("userLogout", handleUserLogout);
    };
  }, []);

  const renderInfoButton = (params) => {
    if (params.data && params.data.data) {
      return (
        <div>
          <FontAwesomeIcon
            icon={faInfoCircle}
            onClick={() => props.onEmpInfo(params.data.data)}
          />
        </div>
      );
    }
    return null;
  };

  function truncateMessage(message) {
    if (message.length > 15) {
      return message.substring(0, 15) + "...";
    }
    return message;
  }

  const UserType = (Account) => {
    switch (Account) {
      case 1:
        return "Admin";
      case 2:
        return "Hr";
      case 4:
        return "Manager";

      default:
        return "Employee";
    }
  };
  const ShortedText = (text) => {
    if (text.length > 20) {
      return text.toString().slice(0, 20) + "...";
    } else {
      return text;
    }
  };

  const routeBasedOnUserType = () => {
    const userType = userData?.Account;
    switch (userType) {
      case 3:
        return "/employee/notification";
      case 4:
        return "/manager/notification";
      case 1:
        return "/admin/notification";
      case 2:
        return "/hr/notification";
      default:
        return "/employee/notification";
    }
  };

  return (
    <nav
      style={{ height: "100%" }}
      className="d-flex align-items-center justify-content-between"
    >
      <button
        onClick={handleClick}
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--primaryDashMenuColor)",
          fontSize: "2.2rem",
        }}
        className="btn d-flex d-sm-none align-iems-center"
      >
        <LuMenu />
      </button>
      <div className="d-flex align-items-center justify-content-between w-100">
        {goBackToggle !== "dashboard" ? <GoBack /> : <></>}
        <div className="ms-auto gap-2 d-flex align-items-center ">
          <BreakIndicator isonBreak={isonBreak} />
          <SearchComponent />
          <DarkModeToggle />
          <div
            className="position-relative"
            onMouseEnter={() => setNotiToggle("name")}
            onMouseLeave={() => setNotiToggle(false)}
          >
            {notification.length > 0 && (
              <div
                className="notilenghth text-muted"
                style={{
                  display: uniqueNotification.length <= 0 ? "none" : "flex",
                  height: "fit-content",
                  width: "fit-content",
                  minWidth: "18px",
                  minHeight: "18px",
                  position: "absolute",
                  top: "-30%",
                  right: "-35%",
                  borderRadius: "50% 50% 50% 0",
                  objectFit: "cover",
                  fontSize: ".8rem",
                  padding: "0 .1rem",
                  background: "#e2cd12f1",
                }}
              >
                <span className="m-auto">{uniqueNotification.length}</span>
              </div>
            )}
            <TbBell
              style={{ fontSize: "22px", color: !darkMode ? "white" : "black" }}
              className=""
            />{" "}
            {notification.length > 0 && (
              <div className="position-relative">
                <div
                  style={{
                    position: "absolute",
                    zIndex: "2001",
                    right: ".5rem",
                    top: "100%",
                    minWidth: "230px",
                    maxWidth: "250px",
                    display: notiToggle == "name" ? "flex" : "none",
                  }}
                  className="border border-muted border-1 flex-column w-100 bg-white align-items-center gap-1 justify-content-between  p-1 rounded-2  shadow"
                >
                  {notiToggle &&
                    notification.length > 0 &&
                    notification
                      .filter(
                        (val, i, ar) =>
                          ar.findIndex((item) => item.taskId === val.taskId) ===
                          i
                      )
                      .slice(0, 10)
                      .map((val, i) => {
                        return (
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={
                              val.status === "unseen"
                                ? () =>
                                    notificationHandler(
                                      val.taskId,
                                      val.path,
                                      val
                                    )
                                : () =>
                                    navigationHandler(
                                      `/${location}/${val.path}`,
                                      val
                                    )
                            }
                            className={
                              val.status === "unseen"
                                ? "d-flex align-items-center justify-content-between p-1 w-100 back"
                                : "d-flex align-items-center justify-content-between p-1 w-100"
                            }
                          >
                            <div className="d-flex align-items-center gap-2 cursor-pointer ">
                              <div
                                style={{
                                  height: "25px",
                                  width: "25px",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    objectFit: "cover",
                                    overflow: "hidden",
                                    borderRadius: "50%",
                                  }}
                                  src={val.profile ? val.profile : profile}
                                  alt=""
                                />
                              </div>
                              <div>
                                <p
                                  style={{ fontSize: ".75rem" }}
                                  className="p-0 m-0 w-100 text-muted"
                                >
                                  {truncateMessage(val.message)}
                                </p>
                                <p
                                  style={{ fontSize: ".80rem" }}
                                  className="p-0 m-0 w-100"
                                >
                                  {val.messageBy}
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <span
                                style={{
                                  fontSize: "1rem",
                                  height: "1.2rem",
                                  width: "1.2rem",
                                  borderRadius: "50%",
                                }}
                                className="d-flex align-items-center text-danger  fw-bold justify-content-center"
                                onClick={(e) => (
                                  notificationDeleteHandler(val.taskId),
                                  e.stopPropagation()
                                )}
                              >
                                x
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  {notiToggle && notification.length > 2 && (
                    <button
                      className="text-decoration-none p-1 text-black"
                      onClick={() => navigate(routeBasedOnUserType())}
                    >
                      View All <BsArrowRight />
                    </button>
                  )}
                </div>
              </div>
            )}
            {/* profile section */}
          </div>
          <span className="navbar-right-content my-auto d-flex">
            <div
              onMouseEnter={() => setActiveProfile("name")}
              onMouseLeave={() => setActiveProfile(null)}
              style={{
                height: "30px",
                width: "30px",
                // outline: "3px solid blue",
                borderRadius: "50%",
                position: "relative",
                // animation: "glowing 1.5s infinite",
              }}
            >
              <img
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  border: "1px solid red",
                  borderRadius: "50%",
                }}
                src={
                  employeeData.profile
                    ? employeeData.profile.image_url
                    : profile
                }
                alt=""
              />

              <div
                className="bg-white shadow pb-3 pt-1 px-3 flex-column gap-3"
                style={{
                  position: "absolute",
                  zIndex: "1000",
                  width: "fit-content",
                  right: "0",
                  top: "90%",

                  display: activeProfile === "name" ? "flex" : "none",
                }}
              >
                <span>
                  <p
                    style={{ width: "fit-content", fontSize: ".8rem" }}
                    className="m-0"
                  >
                    {UserType(userData?.Account)}
                  </p>
                  {/* <hr className="m-0 my-1" /> */}
                  <p className="m-0 p-0">
                    <span className="text-capitalize m-0 p-0">
                      {`${userData?.FirstName} ${userData?.LastName}`}
                    </span>{" "}
                  </p>
                  <p title={userData?.Email} className="m-0 text-muted p-0">
                    {ShortedText(userData?.Email)}
                  </p>
                </span>

                {location === "admin" ? (
                  <></>
                ) : (
                  <Link
                    className="text-decoration-none text-black"
                    to={
                      location === "employee"
                        ? `/employee/${id}/personal-info`
                        : `/${location}/personal-info`
                    }
                  >
                    <span> My Profile</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                  className="btn btn-danger d-flex align-items-center justify-content-between"
                >
                  Logout
                  <FontAwesomeIcon
                    className="my-auto fs-6"
                    icon={faSignOutAlt}
                  />
                </button>
              </div>
            </div>
            <span className="text-muted"></span>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
