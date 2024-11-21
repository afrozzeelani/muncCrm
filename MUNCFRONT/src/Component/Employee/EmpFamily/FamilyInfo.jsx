import React, { useState } from "react";
import axios from "axios";
import FamilyInfoTable from "./FamilyInfoTable.jsx";
import FamilyInfoForm from "./FamilyInfoForm.jsx";
import FamilyInfoFormEdit from "./FamilyInfoFormEdit.jsx";
import BASE_URL from "../../../Pages/config/config.js";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const FamilyInfo = (props) => {
  const { userData } = useSelector((state) => state.user);

  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});
  const route = useLocation().pathname.split("/")[1];
  const history = useNavigate();
  const handleFamilyInfoSubmit = (event, id) => {
    event.preventDefault();

    setTable(true);

    let body = {
      Name: event.target[0].value,
      Relationship: event.target[1].value,
      DOB: event.target[2].value,
      Occupation: event.target[3].value,
      parentMobile: event.target[4].value,
    };

    axios
      .post(
        `${BASE_URL}/api/family-info/` + userData?._id,
        body,

        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      )
      .then((res) => {
        toast.success("Family information added successfully!");
        setTable(false);
        setTable(true);
      })
      .catch((err) => {
        toast.error("Failed to add family information.");
      });
  };

  const handleAddFamilyInfo = () => {
    setTable(false);
  };

  const handleEditFamilyInfo = (e) => {
    setEditForm(true);
    setEditData(e);
  };

  const handleFormClose = () => {
    setTable(true);
  };

  const handleEditFormClose = () => {
    setEditForm(false);
  };

  const handleFamilyInfoEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();

    let body = {
      Name: newInfo.target[0].value,
      Relationship: newInfo.target[1].value,
      DOB: newInfo.target[2].value,
      Occupation: newInfo.target[3].value,
      parentMobile: newInfo.target[4].value,
    };

    axios
      .put(`${BASE_URL}/api/family-info/` + info["_id"], body, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((res) => {
        toast.success("Family information updated successfully!");
        setTable(false);
        setTable(true);
      })
      .catch((err) => {
        toast.error("Failed to update family information.");
      });

    setEditForm(false);
  };
  const handleAddFormGenderChange = () => {};

  return (
    <>
      {table ? (
        editForm ? (
          <FamilyInfoFormEdit
            onFamilyInfoEditUpdate={handleFamilyInfoEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <FamilyInfoTable
            onAddFamilyInfo={handleAddFamilyInfo}
            onEditFamilyInfo={handleEditFamilyInfo}
            data={props.data}
            back={props.back}
          />
        )
      ) : (
        <FamilyInfoForm
          onFamilyInfoSubmit={handleFamilyInfoSubmit}
          onFormClose={handleFormClose}
          onGenderChange={handleAddFormGenderChange}
          data={props.data}
        />
      )}
    </>
  );
};

export default FamilyInfo;
