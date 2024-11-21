import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import RequestImage from "../../../img/Request/Request.svg";
import { toast } from "react-hot-toast";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { getFormattedDate } from "../../../Utils/GetDayFormatted";
import { IoIosChatboxes, IoMdDoneAll } from "react-icons/io";
import { RiAttachmentLine } from "react-icons/ri";
import profile from "../../../img/profile.jpg";
import AvatarGroup from "../../../Pages/AvatarGroup/AvatarGroup";
import { useDispatch, useSelector } from "react-redux";
import { addDetails } from "../../../redux/slices/messageSlice";
const EmployeeActiveTask = () => {
  const dispatch = useDispatch();
  const { socket } = useContext(AttendanceContext);
  const { userData } = useSelector((state) => state.user);
  const { setMessageData } = useContext(AttendanceContext);
  const [empData, setEmpData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [allImage, setAllImage] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const email = userData?.Email;
  const name = `${userData?.FirstName} ${userData?.LastName}`;
  const [timeinfo, setTimeinfo] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);
  const id = userData?._id;
  useEffect(() => {
    const loadPersonalInfoData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/personal-info/` + id,
          {
            headers: {
              authorization: localStorage.getItem("token") || "",
            },
          }
        );
        setEmpData(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Error fetching personal info. Please try again later.");
      }
    };
    getPdf();
    loadPersonalInfoData();
  }, [id]);

  const calculateRemainingTime = (endDate) => {
    const now = currentTime;
    const endDateTime = new Date(endDate);
    let remainingTime = endDateTime - now;

    if (remainingTime < 0) {
      return { delay: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    } else {
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      return { delay: false, days, hours, minutes, seconds };
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tasks`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      });
      setTasks(response.data);
      let fildata = response.data.filter(
        (task) =>
          task.status === "Pending" &&
          task.employees.some(
            (taskemp) => taskemp.empemail === email && taskemp === "Accepted"
          )
      );
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setError("Error fetching tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const askStatus = async (taskId) => {
    // Implement the logic to ask for task status (e.g., open a modal or show a notification)
  };
  const AcceptTask = async (taskId) => {
    try {
      setIsAccepted(true);

      // Prompt the user for cancellation remarks
      const cancellationRemarks = prompt("Enter remarks for Accept Task:");

      if (cancellationRemarks === null) {
        // If the user clicks Cancel in the prompt, do nothing
        setIsAccepted(false);
        return;
      }

      await axios.put(
        `${BASE_URL}/api/tasks/${taskId}`,
        {
          status: "Pending",
          comment: cancellationRemarks,
        },
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      );

      // Display success notification
      toast.success("Task canceled successfully!");

      // Update the UI by fetching the latest tasks
      fetchData();
    } catch (error) {
      console.error("Error canceling task:", error.message);
      toast.error("Failed to cancel task. Please try again.");
    } finally {
      setIsAccepted(false);
    }
  };

  const RejectTask = async (taskId) => {
    try {
      setIsRejected(true);
      const RejectRemarks = prompt("Enter remarks for Reject Task:");

      if (RejectRemarks === null) {
        setIsRejected(false);
        return;
      }

      await axios.put(
        `${BASE_URL}/api/tasks/${taskId}`,
        {
          status: "Rejected",
          comment: RejectRemarks,
        },
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      );

      toast.success("Task Rejected");

      fetchData();
    } catch (error) {
      console.error("Error Rejecting task:", error.message);
      toast.error("Failed to Reject task. Please try again.");
    } finally {
      setIsRejected(false);
    }
  };
  const completeTask = async (taskId, task) => {
    console.log(taskId);
    try {
      const empRemarks = prompt("Enter remarks for completing the task:");

      if (empRemarks === null) {
        return;
      }
      let empEmail = email;
      await axios.put(`${BASE_URL}/api/tasks/${taskId}/employees/${empEmail}`, {
        empTaskStatus: "Completed",
        empTaskComment: empRemarks,
      });

      toast.success("Task completed successfully!");
      const employeeNotificationArr = task.employees.filter((val) => {
        return (val.empTaskStatus !== "Rejected" && val.employee.Email !== email)
      }).map((val)=> val.employee);
      if (empData.profile) {
        const employeeTaskNotification = {
          senderMail: email,
          employeesEmail: [...employeeNotificationArr, task.managerEmail.Email],
          taskId,
          status: "unseen",
          taskName: task.Taskname,
          taskStatus: "Completed",
          message: `Task Completed`,
          messageBy: name,
          profile: empData.profile.image_url,
          Account: 3,
          path: "activeTask",
        };
        socket.emit("employeeTaskUpdateNotification", employeeTaskNotification);
      } else {
        const employeeTaskNotification = {
          senderMail: email,
          employeesEmail: [...employeeNotificationArr, task.managerEmail.Email],
          taskId,
          status: "unseen",
          taskName: task.Taskname,
          taskStatus: "Completed",
          message: `Task Completed`,
          messageBy: name,
          profile: null,
          Account: 3,
          path: "activeTask",
        };
        socket.emit("employeeTaskUpdateNotification", employeeTaskNotification);
      }
      fetchData();
    } catch (error) {
      console.error("Error completing task:", error.message);
      toast.error("Failed to complete task. Please try again.");
    }
  };

  const navigateEmpHandler = (task) => {
    const taskId = task._id;
    const managerEmail = task.managerEmail.Email;
    const from = task.employees
      .filter((val) => {
        return val.employee.Email === email;
      })
      .map((val) => val.employee.profile);

    let to = task.employees
      .filter((val) => {
        return val.employee.Email !== email;
      })
      .map((val) => val.employee.Email);
    to = [...to, managerEmail];

    if (to.length > 0) {
      setMessageData({ taskId, to });
      dispatch(
        addDetails({
          taskId,
          to,
          profile: from.length > 0 ? from[0] : null,
          name,
          taskName: task.Taskname,
        })
      );
      navigate("/employee/emp_manager");
    }
  };
  const getPdf = async () => {
    const result = await axios.get(`${BASE_URL}/api/getTask`);

    setAllImage(result.data.data);
  };

  const showPdf = (id) => {
    const require = allImage?.find((val) => val._id === id);
    if (require) {
      window.open(`${BASE_URL}/${require.pdf}`, "_blank", "noreferrer");
    }
  };

  const toggleTaskDetails = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  return (
    <div className="container-fluid py-2 h-800px">
      {/* <hr />
      <TittleHeader
        numbers={totalTaskAssigned}
        title={"Assigned Task"}
        message={"You can view all new task here."}
      />
      <hr /> */}
      {loading && (
        <div
          style={{ width: "100%", height: "100%" }}
          className="d-flex align-center gap-2"
        >
          <div
            className="spinner-grow bg-primary"
            style={{ width: "1rem", height: "1rem" }}
            role="status"
          ></div>
          <span className="text-primary fw-bold">Loading...</span>
        </div>
      )}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !tasks.length && (
        <p className="text-danger">Data not available.</p>
      )}
      {email &&
      tasks.filter(
        (task) =>
          task.status === "Pending" &&
          task.employees.some(
            (taskemp) =>
              taskemp.employee.Email === email &&
              taskemp.empTaskStatus === "Accepted"
          )
      ).length > 0 ? (
        <div className="row mx-auto">
          {email &&
            tasks
              .filter(
                (task) =>
                  task.status === "Pending" &&
                  task.employees.some(
                    (taskemp) =>
                      taskemp.employee.Email === email &&
                      taskemp.empTaskStatus === "Accepted"
                  )
              )
              .reverse()
              .map((task, index) => (
                <div
                  key={task._id}
                  style={{
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--secondaryDashMenuColor)",
                  }}
                  className="col-12 p-0 mt-2"
                >
                  <div
                    style={{
                      border: !darkMode
                        ? "1px solid var(--primaryDashMenuColor)"
                        : "1px solid var(--secondaryDashColorDark)",
                      background: !darkMode ? "#323232" : "#FFFFFF",
                    }}
                    className="task-hover-effect p-3  rounded-2 shadow border-0"
                  >
                    <div className="row">
                      <div
                        style={{ borderRight: "1px solid rgba(0,0,0,.1)" }}
                        className="col-12 col-md-6"
                      >
                        <div className="d-flex flex-column">
                          <h6 className="m-0 fw-normal">Assigned By</h6>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              style={{
                                height: "30px",
                                width: "30px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                              src={
                                task.managerEmail.profile
                                  ? task.managerEmail.profile.image_url
                                  : profile
                              }
                              alt=""
                            />{" "}
                            <div className="d-flex align-items-center justify-content-between my-2 w-100">
                              <div className="d-flex flex-column">
                                <span style={{ fontWeight: "500" }}>
                                  {task.managerEmail.FirstName}{" "}
                                  {task.managerEmail.LastName}
                                </span>

                                <span>{task.managerEmail.Email}</span>
                              </div>
                              <span
                                className={`${
                                  darkMode
                                    ? "badge-primary"
                                    : "badge-primary-dark"
                                }`}
                              >
                                {accountAccess(task.managerEmail.Account)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <h5 style={{wordWrap:"anywhere"}}>{task.Taskname}</h5>
                        <span style={{wordWrap:"anywhere"}}>{task.description}</span>
                        <div className="d-flex flex-column my-2">
                          <h6>Remarks</h6>
                          <span>{task.comment}</span>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="my-auto">
                            Duration:{" "}
                            <span className="text-danger ml-2">
                              {task.duration + 1}days
                            </span>
                          </p>{" "}
                          <span className="py-1 px-3 bg-warning rounded-3 text-black">
                            {task.status}
                          </span>
                        </div>
                        <div className="d-flex align-items-center my-3 gap-4">
                          <p
                            className={`${
                              darkMode
                                ? "badge-success my-auto"
                                : "badge-success-dark my-auto"
                            }`}
                          >
                            Start Date{" "}
                            {new Date(task.startDate)
                              .toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                              .replace(",", "")}
                          </p>{" "}
                          <span className="p-2 d-flex align-items-center justify-content-center">
                            <LuArrowRightLeft />
                          </span>
                          <p
                            className={`${
                              darkMode
                                ? "badge-danger my-auto"
                                : "badge-danger-dark my-auto"
                            }`}
                          >
                            End Date{" "}
                            {new Date(task.endDate)
                              .toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                              .replace(",", "")}
                          </p>
                        </div>
                        <div className="bg-light">
                          <span className="d-flex flex-column gap-1">
                            <h6>Remaining Time</h6>
                            <span>
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <div className="d-flex gap-2 justify-content-between">
                                  {calculateRemainingTime(task.endDate)
                                    .delay ? (
                                    <div className="">
                                      <span className=" rounded-5 border border-danger  my-auto  p-1 px-2">
                                        Please finish the task as soon as you
                                        can, as it's running late.
                                      </span>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="text-center">
                                        <div
                                          className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                          style={{
                                            boxShadow: "0 0 5px 2px gray inset",
                                            height: "30px",
                                            minWidth: "30px",
                                          }}
                                        >
                                          {
                                            calculateRemainingTime(task.endDate)
                                              .days
                                          }
                                        </div>
                                        <div>Day</div>
                                      </div>
                                      <div className="text-center">
                                        <div
                                          className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                          style={{
                                            boxShadow: "0 0 5px 2px gray inset",
                                            height: "30px",
                                            minWidth: "30px",
                                          }}
                                        >
                                          {
                                            calculateRemainingTime(task.endDate)
                                              .hours
                                          }
                                        </div>
                                        <div>Hrs</div>
                                      </div>
                                      <div className="text-center">
                                        <div
                                          className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                          style={{
                                            boxShadow: "0 0 5px 2px gray inset",
                                            height: "30px",
                                            minWidth: "30px",
                                          }}
                                        >
                                          {
                                            calculateRemainingTime(task.endDate)
                                              .minutes
                                          }
                                        </div>
                                        <div>Min</div>
                                      </div>
                                      <div className="text-center">
                                        <div
                                          className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                          style={{
                                            boxShadow: "0 0 5px 2px gray inset",
                                            height: "30px",
                                            minWidth: "30px",
                                          }}
                                        >
                                          {
                                            calculateRemainingTime(task.endDate)
                                              .seconds
                                          }
                                        </div>
                                        <div>Sec</div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </span>
                          </span>
                        </div>
                        <div className="d-flex flex-column gap-2 my-2">
                          Action
                          {email &&
                            task.employees
                              .filter(
                                (taskemp) => taskemp.employee.Email === email
                              )
                              .map((taskemp, i) => (
                                <div className="d-flex align-items-center gap-2">
                                  <button
                                    className="btn btn-primary py-1"
                                    onClick={() =>
                                      acceptTask(
                                        task._id,
                                        taskemp.employee.Email,
                                        task
                                      )
                                    }
                                    disabled={
                                      taskemp.empTaskStatus === "Accepted" ||
                                      taskemp.empTaskStatus === "Rejected" ||
                                      taskemp.empTaskStatus === "Completed"
                                    }
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="btn  py-1 btn-danger"
                                    onClick={() =>
                                      rejectTask(
                                        task._id,
                                        taskemp.employee.Email,
                                        task
                                      )
                                    }
                                    disabled={
                                      taskemp.empTaskStatus === "Accepted" ||
                                      taskemp.empTaskStatus === "Rejected" ||
                                      taskemp.empTaskStatus === "Completed"
                                    }
                                  >
                                    Reject
                                  </button>
                                  <button
                                    onClick={() => showPdf(task._id)}
                                    className="btn btn-secondary py-1"
                                  >
                                    <RiAttachmentLine /> Attachment
                                  </button>
                                  <div>
                                    <span
                                      style={{ cursor: "pointer" }}
                                      onMouseEnter={() => setTimeinfo("name")}
                                      onMouseLeave={() => setTimeinfo(false)}
                                      onClick={() =>
                                        toggleTaskDetails(task._id)
                                      }
                                    >
                                      {expandedTaskId === task._id ? (
                                        <span>
                                          View Less{" "}
                                          <MdArrowDropUp className="fs-4" />
                                        </span>
                                      ) : (
                                        <span>
                                          {" "}
                                          View Details{" "}
                                          <MdArrowDropDown className="fs-4" />
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              ))}
                        </div>
                        <div className="d-flex align-items-center mt-4 justify-content-between">
                          <p className="my-auto">
                            Created At: {getTimeAgo(task.createdAt)}
                          </p>
                          <p className="my-auto">
                            Latest Updated At: {getTimeAgo(task.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      {expandedTaskId === task._id && (
                        <div
                          style={{
                            background: darkMode
                              ? "rgba(165, 177, 255, 0.23)"
                              : "white",
                          }}
                          className="p-2 rounded-3"
                        >
                          <div className="d-flex align-items-center justify-content-between my-3">
                            <AvatarGroup images={task.employees} />
                          </div>

                          <div style={{ width: "100%", overflow: "auto" }}>
                            <h6 className="fw-bold">Project Members</h6>
                            <Table>
                              <thead>
                                <tr>
                                  <th style={rowHeadStyle(darkMode)}>Name</th>
                                  <th style={rowHeadStyle(darkMode)}>Email</th>
                                  <th style={rowHeadStyle(darkMode)}>
                                    Designation
                                  </th>

                                  <th style={rowHeadStyle(darkMode)}>
                                    Task Status
                                  </th>
                                  <th style={rowHeadStyle(darkMode)}>
                                    Remarks
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {email &&
                                  task.employees.map((taskemp, i) => (
                                    <tr key={i}>
                                      <td
                                        style={{
                                          verticalAlign: "middle",
                                          whiteSpace: "pre",
                                          background: darkMode
                                            ? "var( --secondaryDashMenuColor)"
                                            : "var(--secondaryDashColorDark)",
                                          color: darkMode
                                            ? "var(--secondaryDashColorDark)"
                                            : "var( --primaryDashMenuColor)",
                                          border: "none",
                                        }}
                                        className="text-capitalize"
                                      >
                                        {`${taskemp.employee.FirstName} ${taskemp.employee.LastName}`}
                                      </td>
                                      <td
                                        style={{
                                          verticalAlign: "middle",
                                          whiteSpace: "pre",
                                          background: darkMode
                                            ? "var( --secondaryDashMenuColor)"
                                            : "var(--secondaryDashColorDark)",
                                          color: darkMode
                                            ? "var(--secondaryDashColorDark)"
                                            : "var( --primaryDashMenuColor)",
                                          border: "none",
                                        }}
                                      >
                                        {taskemp.employee.Email}
                                      </td>
                                      <td
                                        style={{
                                          verticalAlign: "middle",
                                          whiteSpace: "pre",
                                          background: darkMode
                                            ? "var( --secondaryDashMenuColor)"
                                            : "var(--secondaryDashColorDark)",
                                          color: darkMode
                                            ? "var(--secondaryDashColorDark)"
                                            : "var( --primaryDashMenuColor)",
                                          border: "none",
                                        }}
                                      >
                                        {
                                          taskemp.employee.position[0]
                                            .PositionName
                                        }
                                      </td>
                                      <td
                                        style={{
                                          verticalAlign: "middle",
                                          whiteSpace: "pre",
                                          background: darkMode
                                            ? "var( --secondaryDashMenuColor)"
                                            : "var(--secondaryDashColorDark)",
                                          color: darkMode
                                            ? "var(--secondaryDashColorDark)"
                                            : "var( --primaryDashMenuColor)",
                                          border: "none",
                                        }}
                                      >
                                        {taskemp?.empTaskStatus}{" "}
                                      </td>
                                      <td
                                        style={{
                                          maxWidth: "10rem",
                                          overflow: "hidden",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis",
                                          verticalAlign: "middle",
                                          whiteSpace: "pre",
                                          background: darkMode
                                            ? "var( --secondaryDashMenuColor)"
                                            : "var(--secondaryDashColorDark)",
                                          color: darkMode
                                            ? "var(--secondaryDashColorDark)"
                                            : "var( --primaryDashMenuColor)",
                                          border: "none",
                                        }}
                                      >
                                        {taskemp?.empTaskComment}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      ) : (
        <div
          className="d-flex flex-column gap-3 align-items-center justify-content-center"
          style={{ height: "80vh" }}
        >
          <img
            style={{ width: "15rem", height: "auto" }}
            src={RequestImage}
            alt="No task found"
          />
          <p
            style={{
              color: darkMode
                ? "var(--primaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
          >
            There is no task found at this moment.
          </p>
        </div>
      )}
    </div>

   
  );
};

export default EmployeeActiveTask;
