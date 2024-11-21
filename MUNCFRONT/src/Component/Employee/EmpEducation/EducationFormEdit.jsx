import React, { useState } from "react";
// import "./EducationFormEdit.css";
// import { Form,Button } from "react-bootstrap";
import { Form, Button, Col, Row } from "react-bootstrap";

const EducationForm = (props) => {
  const [state, setState] = useState({
    SchoolUniversityData: props.editData["SchoolUniversity"],
    DegreeData: props.editData["Degree"],
    GradeData: props.editData["Grade"],
    PassingOfYearData: props.editData["PassingOfYear"],
  });

  const onSchoolUniversityDataChange = (e) => {
    setState({ ...state, SchoolUniversityData: e.target.value });
  };

  const onDegreeDataChange = (e) => {
    setState({ ...state, DegreeData: e.target.value });
  };

  const onGradeDataChange = (e) => {
    setState({ ...state, GradeData: e.target.value });
  };

  const onPassingOfYearDataChange = (e) => {
    setState({ ...state, PassingOfYearData: e.target.value });
  };

  return (
    <div>
      <h2 id="role-form-title">Edit Education Details</h2>

      <div id="role-form-outer-div">
        <Form
          id="form"
          onSubmit={(e) => props.onEducationEditUpdate(props.editData, e)}
        >
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              School / University
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control
                type="Text"
                placeholder="School / University "
                required
                value={state.SchoolUniversityData}
                onChange={(e) => onSchoolUniversityDataChange(e)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Degree
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control
                type="Text"
                placeholder="Degree "
                required
                value={state.DegreeData}
                onChange={(e) => onDegreeDataChange(e)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Grade / %
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control
                type="Text"
                placeholder="Grade"
                required
                value={state.GradeData}
                onChange={(e) => onGradeDataChange(e)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Passing Of Year
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control
                type="Text"
                placeholder="Passing Of Year"
                required
                value={state.PassingOfYearData}
                onChange={(e) => onPassingOfYearDataChange(e)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} id="form-submit-button">
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit">Update</Button>
            </Col>
          </Form.Group>
          <Form.Group as={Row} id="form-cancel-button">
            <Col sm={{ span: 10, offset: 2 }} id="form-cancel-button-inner">
              <Button
                type="reset"
                style={{ color: "white" }}
                onClick={props.onFormEditClose}
              >
                cancel
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default EducationForm;
