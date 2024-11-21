
// import React from "react";
// import { Form, Button, Col, Row } from "react-bootstrap";
// import axios from "axios";
// import "./WorkExperienceForm.css";

// const WorkExperienceForm = (props) => {
//   let id;
//   if (props.data) {
//     id = props.data["_id"];
//   } else {
//     id = localStorage.getItem("_id");
//   }
//   return (
//     <div className="container-fluid">
//       <h5 className="my-3">+ Add Experience</h5>
//       <div>
//         <form onSubmit={(e) => props.onWorkExperienceSubmit(e, id)}>
//           <div>
//             <label>Company Name</label>
//             <div className="form-input">
//               <Form.Control
//                 type="Text"
//                 placeholder="Please enter companie's name"
//                 required
//               />
//             </div>
//           </div>
//           <div>
//             <lable>Designation</lable>
//             <div sm={10} className="form-input">
//               <Form.Control
//                 type="Text"
//                 placeholder="Enter your designation"
//                 required
//               />
//             </div>
//           </div>
//           <div>
//             <lable>From</lable>
//             <div sm={10} className="form-input">
//               <Form.Control type="date" required />
//             </div>
//           </div>
//           <div>
//             <lable>To</lable>
//             <div sm={10} className="form-input">
//               <Form.Control type="date" placeholder="ToDate" required />
//             </div>
//           </div>

//           <div className="d-flex gap-3 mt-3">
//             <button className="btn btn-primary" type="submit">
//               Submit
//             </button>

//             <button
//               className="btn btn-danger"
//               type="reset"
//               onClick={props.onFormClose}
//             >
//               cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
  
//   );
// };

// export default WorkExperienceForm;
import React from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./WorkExperienceForm.css";
import { useSelector } from "react-redux";

const WorkExperienceForm = (props) => {
  const { userData} = useSelector((state)=> state.user);
  let id = props.data ? props.data["_id"] : userData?._id;
  const today = new Date().toISOString().split("T")[0];

  const formik = useFormik({
    initialValues: {
      companyName: "",
      designation: "",
      fromDate: "",
      toDate: "",
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required("Company name is required"),
      designation: Yup.string().required("Designation is required"),
      fromDate: Yup.date().required("From date is required"),
      toDate: Yup.date()
        .required("To date is required")
        .min(Yup.ref("fromDate"), "To date must be after From date")
        .max(today, "To date cannot be in the future"),
    }),
    onSubmit: (values) => {
      props.onWorkExperienceSubmit(values, id);
    },
  });

  return (
    <div className="container-fluid">
      <h5 className="my-3">+ Add Experience</h5>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Company Name</label>
          <div className="form-input">
            <Form.Control
              type="text"
              name="companyName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.companyName}
              placeholder="Please enter company's name"
              required
            />
            {formik.touched.companyName && formik.errors.companyName ? (
              <div className="error" style={{ color: "red" }}>{formik.errors.companyName}</div>
            ) : null}
          </div>
        </div>
        <div>
          <label>Designation</label>
          <div className="form-input">
            <Form.Control
              type="text"
              name="designation"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.designation}
              placeholder="Enter your designation"
              required
            />
            {formik.touched.designation && formik.errors.designation ? (
              <div className="error" style={{ color: "red" }}>{formik.errors.designation}</div>
            ) : null}
          </div>
        </div>
        <div>
          <label>From</label>
          <div className="form-input">
            <Form.Control
              type="date"
              name="fromDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fromDate}
              required
            />
            {formik.touched.fromDate && formik.errors.fromDate ? (
              <div className="error" style={{ color: "red" }}>{formik.errors.fromDate}</div>
            ) : null}
          </div>
        </div>
        <div>
          <label>To</label>
          <div className="form-input">
            <Form.Control
              type="date"
              name="toDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.toDate}
              required
            />
            {formik.touched.toDate && formik.errors.toDate ? (
              <div className="error" style={{ color: "red" }}>{formik.errors.toDate}</div>
            ) : null}
          </div>
        </div>

        <div className="d-flex gap-3 mt-3">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Submit
          </button>

          <button
            className="btn btn-danger"
            type="reset"
            onClick={props.onFormClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkExperienceForm;


// import React from "react";
// import { Form } from "react-bootstrap";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import "./WorkExperienceForm.css";

// const WorkExperienceForm = (props) => {
//   let id;
//   if (props.data) {
//     id = props.data["_id"];
//   } else {
//     id = localStorage.getItem("_id");
//   }

//   const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

//   const formik = useFormik({
//     initialValues: {
//       companyName: "",
//       designation: "",
//       fromDate: "",
//       toDate: "",
//     },
//     validationSchema: Yup.object({
//       companyName: Yup.string().required("Company name is required"),
//       designation: Yup.string().required("Designation is required"),
//       fromDate: Yup.date().required("From date is required"),
//       toDate: Yup.date()
//         .required("To date is required")
//         .min(Yup.ref("fromDate"), "To date must be after From date")
//         .max(today, "To date cannot be in the future"),
//     }),
//     onSubmit: (values) => {
//       props.onWorkExperienceSubmit(values, id);
//     },
//   });

//   return (
//     <div className="container-fluid">
//       <h5 className="my-3">+ Add Experience</h5>
//       <div>
//         {/* <form onSubmit={formik.handleSubmit}> */}
//         <form onSubmit={(e) => props.formik.onWorkExperienceSubmit(e, id)}>
//           <div>
//             <label>Company Name</label>
//             <div className="form-input">
//               <Form.Control
//                 type="text"
//                 name="companyName"
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.companyName}
//                 placeholder="Please enter company's name"
//                 required
//               />
//               {formik.touched.companyName && formik.errors.companyName ? (
//                 <div className="error" style={{ color: "red" }}>{formik.errors.companyName}</div>
//               ) : null}
//             </div>
//           </div>
//           <div>
//             <label>Designation</label>
//             <div className="form-input">
//               <Form.Control
//                 type="text"
//                 name="designation"
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.designation}
//                 placeholder="Enter your designation"
//                 required
//               />
//               {formik.touched.designation && formik.errors.designation ? (
//                 <div className="error" style={{ color: "red" }}>{formik.errors.designation}</div>
//               ) : null}
//             </div>
//           </div>
//           <div>
//             <label>From</label>
//             <div className="form-input">
//               <Form.Control
//                 type="date"
//                 name="fromDate"
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.fromDate}
//                 required
//               />
//               {formik.touched.fromDate && formik.errors.fromDate ? (
//                 <div className="error" style={{ color: "red" }}>{formik.errors.fromDate}</div>
//               ) : null}
//             </div>
//           </div>
//           <div>
//             <label>To</label>
//             <div className="form-input">
//               <Form.Control
//                 type="date"
//                 name="toDate"
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.toDate}
//                 required
//               />
//               {formik.touched.toDate && formik.errors.toDate ? (
//                 <div className="error" style={{ color: "red" }}>{formik.errors.toDate}</div>
//               ) : null}
//             </div>
//           </div>

//           <div className="d-flex gap-3 mt-3">
//             <button
//               className="btn btn-primary"
//               type="submit"
//               disabled={!formik.isValid || formik.isSubmitting}
//             >
//               Submit
//             </button>

//             <button
//               className="btn btn-danger"
//               type="reset"
//               onClick={props.onFormClose}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default WorkExperienceForm;
