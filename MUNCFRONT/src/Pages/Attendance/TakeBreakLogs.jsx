import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import Moment from "moment";
import BASE_URL from "../config/config";
import toast from "react-hot-toast";
import { FaComputerMouse } from "react-icons/fa6";
import { PiCoffeeFill } from "react-icons/pi";
import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";
import { useSelector } from "react-redux";

function TakeBreakLogs(props) {
  const [todayData, setTodayData] = useState(null);
  const [breakTimer, setBreakTimer] = useState(0); // Timer state for break
  const [intervalId, setIntervalId] = useState(null); // Interval ID to clear the timer
  const { userData } = useSelector((state) => state.user);
  const id = userData?._id;
  const { setMessage } = useContext(AttendanceContext);

  // Load personal data
  const loadPersonalInfoData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/attendances/` + id, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      });
      setTodayData(response.data);
    } catch (error) {
      console.error("Error fetching personal info:", error);
    }
  };

  useEffect(() => {
    loadPersonalInfoData();
    const storedBreakStart = localStorage.getItem("breakStartTime");
    if (storedBreakStart) {
      const breakStartTime = parseInt(storedBreakStart, 10);
      const elapsedSeconds = Math.floor((Date.now() - breakStartTime) / 1000);
      startTimer(elapsedSeconds); // Start timer with the elapsed time
    }
  }, [props.data]);

  // Handle different actions (login, break, resume)
  const handleAction = async (action) => {
    const attendanceID = todayData.attendanceID;
    const currentTime = Moment().format("HH:mm:ss");
    const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);
  
    // Define a mapping for valid actions and their corresponding status
    const statusMapping = {
      login: {
        status: "login",
        loginTime: [currentTime],
      },
      logout: {
        status: "logout",
        logoutTime: [currentTime],
      },
      break: {
        status: "break",
        breakTime: [currentTime],
        breakTimeMs: [currentTimeMs],
      },
      resume: {
        status: "login",
        ResumeTime: [currentTime],
        resumeTimeMS: [currentTimeMs],
      },
    };
  
    if (!statusMapping[action]) {
      setMessage(`Invalid action: ${action}`);
      toast.error(`Invalid action: ${action}`);
      return;
    }
  
    try {
      // Send a POST request to the server
      await axios.post(
        `${BASE_URL}/api/attendance/${attendanceID}`, 
        {
          employeeId: id,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          date: new Date().getDate(),
          ...statusMapping[action],
        },
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      );
  
      // Display success message
      const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1);
      setMessage(`${capitalizedAction} time recorded successfully`);
      toast.success(`${capitalizedAction} time recorded successfully`);
  
      // Handle specific actions for break and resume
      if (action === "break") {
        const breakStartTime = Date.now();
        localStorage.setItem("breakStartTime", breakStartTime); // Store break start time
        startTimer(); // Start the timer
      } else if (action === "resume") {
        stopTimer(); // Stop the timer
        localStorage.removeItem("breakStartTime"); // Remove break start time from storage
      }
  
      // Refresh personal info data after the action is recorded
      loadPersonalInfoData();
    } catch (error) {
      setMessage(`Error recording ${action} time`);
      toast.error(`Error recording ${action} time`);
    }
  };

  // Start the break timer
  const startTimer = (initialTime = 0) => {
    setBreakTimer(initialTime); // Set initial time if passed (used after refresh)
    const interval = setInterval(() => {
      setBreakTimer((prevTimer) => prevTimer + 1);
    }, 1000);
    setIntervalId(interval); // Store the interval ID so we can clear it later
  };

  // Stop the break timer
  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId); // Stop the timer
      setIntervalId(null); // Reset the intervalId
    }
    setBreakTimer(0); // Reset the timer
  };

  // Convert timer seconds to HH:MM:SS format
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="App row gap-2">
      <div style={{ alignItems: "center" }} className="d-flex gap-2">
        {todayData && todayData?.today?.status === "break" ? (
          <>
            <button
              className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
              onClick={() => handleAction("resume")}
            >
              <FaComputerMouse className="my-auto fs-5" /> Break Over (
              {formatTime(breakTimer)})
            </button>
          </>
        ) : (
          <button
            className="btn btn-warning d-flex align-items-center justify-content-center gap-2"
            onClick={() => handleAction("break")}
          >
            <PiCoffeeFill className="my-auto fs-5" /> Take a Break
          </button>
        )}
      </div>
    </div>
  );
}

export default TakeBreakLogs;
