import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FamilyInfoTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import BASE_URL from "../../../Pages/config/config";
import SearchLight from "../../../img/Attendance/SearchLight.svg";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import OverLayToolTip from "../../../Utils/OverLayToolTip";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa6";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const FamilyInfoTable = (props) => {
  const { userData } = useSelector((state) => state.user);

  const id = props.data ? props.data["_id"] : userData?._id;
  const [familyInfoData, setFamilyInfoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const { darkMode } = useTheme();

  const loadFamilyInfoData = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/family-info/${id}`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setFamilyInfoData(response.data);
        setLoading(false);

        const tempRowData = response.data.familyInfo.map((data) => ({
          data,
          Name: data["Name"],
          Relationship: data["Relationship"],
          DOB: data["DOB"].slice(0, 10),
          Occupation: data["Occupation"],
          parentMobile: data["parentMobile"],
        }));
        setRowData(tempRowData);
      })
      .catch((error) => {
        console.error("Error loading family info:", error);
        setLoading(false);
      });
  };

  const onFamilyInfoDelete = (familyId, memberId) => {
    if (window.confirm("Are you sure to delete this record?")) {
      axios
        .delete(`${BASE_URL}/api/family-info/${familyId}/${memberId}`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then((res) => {
          loadFamilyInfoData();
        })
        .catch((error) => {
          console.error("Error deleting family info:", error);
        });
    }
  };

  useEffect(() => {
    loadFamilyInfoData();
  }, []);

  const rowHeadStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--primaryDashMenuColor)"
      : "var(--primaryDashColorDark)",
    color: darkMode
      ? "var(--primaryDashColorDark)"
      : "var(--secondaryDashMenuColor)",
    border: "none",
    position: "sticky",
    top: "0rem",
    zIndex: "100",
  };

  const rowBodyStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--secondaryDashMenuColor)"
      : "var(--secondaryDashColorDark)",
    color: darkMode
      ? "var(--secondaryDashColorDark)"
      : "var(--primaryDashMenuColor)",
    border: "none",
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between mb-2">
        <TittleHeader
          title={" Family Details"}
          numbers={rowData.length}
          message={"You can view family details here."}
        />

        <div className="py-1">
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
            onClick={props.onAddFamilyInfo}
          >
            <FaPlus />
            <span className="d-none d-md-flex">Add Member</span>
          </button>
        </div>
      </div>
      <div id="clear-both" />

      {loading ? (
        <div id="loading-bar">
          <RingLoader
            css={override}
            size={50}
            color={"#0000ff"}
            loading={true}
          />
        </div>
      ) : (
        <div>
          {rowData.length > 0 ? (
            <table className="table" style={{ fontSize: ".9rem" }}>
              <thead>
                <tr>
                  <th style={rowHeadStyle}>Name</th>
                  <th style={rowHeadStyle}>Relationship</th>
                  <th style={rowHeadStyle}>DOB</th>
                  <th style={rowHeadStyle}>Contact</th>
                  <th style={rowHeadStyle}>Occupation</th>
                  <th style={rowHeadStyle} className="text-end">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rowData.map((items, index) => (
                  <tr key={index}>
                    <td style={rowBodyStyle} className="text-capitalize">
                      {items.Name}
                    </td>
                    <td style={rowBodyStyle} className="text-capitalize">
                      {items.Relationship}
                    </td>
                    <td style={rowBodyStyle}>{items.DOB}</td>
                    <td style={rowBodyStyle}>{items.parentMobile}</td>
                    <td style={rowBodyStyle}>{items.Occupation}</td>
                    <td style={rowBodyStyle} className="text-end">
                      <OverLayToolTip
                        onClick={() => props.onEditFamilyInfo(items.data)}
                        tooltip={"Edit"}
                        icon={<FaRegEdit className="text-primary fs-5" />}
                      />
                      <OverLayToolTip
                        onClick={() => onFamilyInfoDelete(id, items.data._id)}
                        tooltip={"Delete"}
                        icon={<FaTrash className="text-danger fs-6" />}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                height: "65vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "2rem",
              }}
            >
              <img style={{ width: "30%" }} src={SearchLight} alt="No data" />
              <p
                className="text-center"
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                }}
              >
                Member's details not available, please add member.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FamilyInfoTable;
