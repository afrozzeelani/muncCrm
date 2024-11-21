import React, { useState, useRef, useEffect } from "react";
import { Form, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { SearchRouteData } from "./SearchRouteData";
import BASE_URL from "../../Pages/config/config";
import axios from "axios";
import { RiSearch2Line } from "react-icons/ri";
import "./SearchComponent.css";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { useSelector } from "react-redux";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { userData} = useSelector((state)=> state.user);
  const [expanded, setExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const [employeeData, setEmployeeData] = useState({});
  const id = userData?._id;
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/particularEmployee/${id}`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setEmployeeData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setSelectedIndex(-1); // Reset selection when typing
  };

  const handleLinkClick = () => {
    setSearchTerm("");
    setExpanded(false);
  };

  const handleKeyDown = (event) => {
    
    if (event.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, filteredRoutes.length - 1)
      );
    } else if (event.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (event.key === "Enter" && selectedIndex >= 0) {
      // Prevent default behavior (form submission)
      event.preventDefault();
      // Navigate to the selected route
      navigate(filteredRoutes[selectedIndex].path);
      setSearchTerm("");
      setExpanded(false);
    }
  };

  const filteredRoutes = searchTerm
    ? SearchRouteData.filter((route) => {
        const isNameMatch = route.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const isUserTypeMatch = (() => {
          switch (employeeData.Account) {
            case 1: // Admin
              return route.control === "admin";
            case 2: // HR
              return route.control === "hr";
            case 3: // Employee
              return route.control === "employee";
            case 4: // Manager
              return route.control === "manager";
            default:
              return false;
          }
        })();
        return isNameMatch && isUserTypeMatch;
      }).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setSearchTerm("");
        setExpanded(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="mx-2"
      style={{
        width: "210px",
        height: "2.2rem",
        position: "relative",
      }}
      ref={inputRef}
    >
      <Form.Control
        className={`border-0 outline-0 borderless-input ${
          darkMode ? "dark-placeholder" : "light-placeholder"
        }`}
        placeholder="Search"
        style={{
          height: "2.3rem",
          paddingLeft: "2.3rem",
          borderRadius: filteredRoutes.length > 0 ? "8px 8px 0 0" : "8px",
          background: darkMode ? "white" : "black",
          color: !darkMode ? "white" : "black",
        }}
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
      <RiSearch2Line
        style={{
          position: "absolute",
          top: ".5rem",
          left: ".4rem",
          fontSize: "1.2rem",
          opacity: "60%",
          color: !darkMode ? "white" : "black",
        }}
      />

      {filteredRoutes.length > 0 ? (
        <ListGroup
          className="py-2 px-1"
          style={{
            position: "absolute",
            width: "100%",
            borderRadius: "0 0 8px 8px",
            zIndex: "2000",
            background: darkMode ? "white" : "black",
          }}
        >
          {filteredRoutes.map((route, index) => (
            <Link
              style={{ textDecorationLine: "none", width: "100%" }}
              to={route.path}
              key={index}
              onClick={handleLinkClick}
            >
              <div
                style={{
                  textDecorationLine: "none",
                  backgroundColor:
                    index === selectedIndex ? "#abcdf56f" : "transparent",
                  boxShadow:
                    index === selectedIndex
                      ? "0 2px 3px 2px rgba(0,0,0,.2)"
                      : "none",

                  padding: "5px",
                  color: !darkMode ? "white" : "black",
                }}
                className="search-hoverable-text"
              >
                {route.name}
              </div>
            </Link>
          ))}
        </ListGroup>
      ) : (
        <div>
          {searchTerm && expanded && (
            <span
              style={{
                position: "absolute",
                width: "210px",
                textAlign: "start",
              }}
              className="bg-white shadow-sm border rounded-0 py-1 px-3"
            >
              No result found
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
