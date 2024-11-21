import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ImBin } from "react-icons/im";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import "./notification.css";
import BASE_URL from "../../../Pages/config/config";
import { useSelector } from "react-redux";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const Notification = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState([]);
  const [notification, setNotification] = useState(null);
  const { socket } = useContext(AttendanceContext);
  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();

  const id = userData?._id;
  const email = userData?.Email;

  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/particularEmployee/${id}`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setNotification(response.data.Notification);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    loadEmployeeData();
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on("taskNotificationReceived", () => {
        loadEmployeeData();
      });
    }
  }, [socket]);

  useEffect(() => {
    // Check if all notifications are selected and update the "Select All" checkbox accordingly
    setSelectAll(
      notification && selectedNotification.length === notification.length
    );
  }, [selectedNotification, notification]);

  const addSelectedNotification = (val) => {
    const isChecked = selectedNotification.some(
      (noti) => noti.taskId === val.taskId
    );

    if (isChecked) {
      setSelectedNotification((prevNotification) =>
        prevNotification.filter((noti) => noti.taskId !== val.taskId)
      );
    } else {
      setSelectedNotification([...selectedNotification, val]);
    }
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedNotification(selectAll ? [] : [...notification]);
  };
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
          socket.emit("notificationPageUpdate", true);
        })
        .catch((error) => {});
    }
  };
  const multiNotificationDeleteHandler = () => {
    if (selectedNotification.length > 0) {
      const taskIDArray = selectedNotification.map((val) => val.taskId);
      const data = {
        employeeMail: email,
        tasks: taskIDArray,
      };
      if (selectAll) {
        clearAllHandler();
      } else {
        axios
          .post(`${BASE_URL}/api/multiSelectedNotificationDelete`, data, {
            headers: {
              authorization: localStorage.getItem("token") || "",
            },
          })
          .then((response) => {
            setNotification(response.data.result.Notification);
            setSelectedNotification([]);

            socket.emit("notificationPageUpdate", true);
          })
          .catch((error) => {});
      }
    }
  };
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
        setNotification(response.data.result.Notification);
        setSelectedNotification([]);

        socket.emit("notificationPageUpdate", true);
      })
      .catch((error) => {});
  };

  const truncateText = (data) => {
    if (!data) return "";
    return data.toString().slice(0, 60) + "...";
  };

  return (
    <>
      <div className="row container-fluid">
        <form className="d-flex col-8 flex-column gap-3 w-100">
          <div>
            <div className="p-2 d-flex align-items-center gap-2">
              {" "}
              <input
                type="checkbox"
                name=""
                id=""
                onChange={toggleSelectAll}
                checked={selectAll}
              />{" "}
              <span className={`${darkMode ? "text-black" : "text-white"}`}>
                Select All
              </span>
            </div>
            <div
              style={{
                // maxHeight: "68vh",
                overflow: "auto",
                position: "relative",
              }}
              className="table-responsive p-2 mb-3"
            >
              <table className="table">
                <thead>
                  <tr>
                    <th style={rowHeadStyle(darkMode)}>Select</th>
                    <th style={rowHeadStyle(darkMode)}>task Name</th>
                    <th style={rowHeadStyle(darkMode)}>Sender</th>
                    <th style={rowHeadStyle(darkMode)}>Status</th>
                    <th className="text-end" style={rowHeadStyle(darkMode)}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {notification &&
                    notification.map((val, index) => (
                      <tr key={index}>
                        <th style={rowBodyStyle(darkMode)}>
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            onChange={() => addSelectedNotification(val)}
                            checked={selectedNotification.some(
                              (noti) => noti.taskId === val.taskId
                            )}
                          />
                        </th>
                        <td style={rowBodyStyle(darkMode)}>
                          {truncateText(val.taskName)}
                        </td>
                        <td style={rowBodyStyle(darkMode)}>{val.senderMail}</td>
                        {val.status === "unseen" ? (
                          <td style={rowBodyStyle(darkMode)}>Unread</td>
                        ) : (
                          <td style={rowBodyStyle(darkMode)}>read</td>
                        )}
                        <td style={rowBodyStyle(darkMode)}>
                          <button
                            onClick={() =>
                              notificationDeleteHandler(val.taskId)
                            }
                            className="btn btn-danger ms-auto d-flex align-items-center gap-2"
                          >
                            <ImBin /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>

      {selectedNotification.length > 0 && (
        <button
          className="btn btn-danger ml-3"
          onClick={multiNotificationDeleteHandler}
        >
          Delete Selected
        </button>
      )}
    </>
  );
};

export default Notification;
