import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

import { allTheSubjects } from "fixtures/subjectFixtures";
import { quarterRange } from "main/utils/quarterUtilities";

import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import ManyLevelDropdown from "../Level/LevelDropdown";
import SingleSubjectDropdown from "../Subjects/SingleSubjectDropdown"

const BasicCourseSearchForm = ({ setCourseJSON, fetchJSON }) => {
	const quarters = quarterRange("20084", "20222");

	//const allTheLevels = [["L","UG-lower div"], ["S", "UG-upper div"], ["G","GRAD"], ["A","All"]]
	const allTheLevels = ["UG-lower div","UG-upper div", "GRAD", "All"]

    const localSubject = localStorage.getItem("BasicSearch.Subject");
    const localQuarter = localStorage.getItem("BasicSearch.Quarter");
	const localLevel = localStorage.getItem("BasicSearch.CourseLevel");
	
	const firstDepartment = allTheSubjects[0].subjectCode;
	const [quarter, setQuarter] = useState(localQuarter || quarters[0].yyyyq);
	const [subject, setSubject] = useState(localSubject || firstDepartment);
	const [level, setLevel] = useState(localLevel || "UG-lower div");
	const [errorNotified, setErrorNotified] = useState(false);

	const handleSubmit = (event) => {
		toast(
			"Not getting anything yet",
			{
			  appearance: "error",
			}
		);
		event.preventDefault();
		fetchJSON(event, {quarter, subject, level}).then((courseJSON) => {
			setCourseJSON(courseJSON);
		});
	};


	return (
		<Form onSubmit={handleSubmit}>
			<Container>
				<Row>
					<Col md = "auto"><SingleQuarterDropdown
						quarters={quarters}
						quarter={quarter}
						setQuarter={setQuarter}
						controlId={"BasicSearch.Quarter"}
						label={"Quarter"}
					/></Col>
					<Col md = "auto"><SingleSubjectDropdown
						subjects={allTheSubjects}
						subject={subject}
						setSubject={setSubject}
                        controlId={"BasicSearch.Subject"}
                        label={"Subject"}
					/></Col>
					<Col md = "auto"><ManyLevelDropdown
						levels={allTheLevels}
						level={level}
						setLevel={setLevel}
						controlId={"BasicSearch.CourseLevel"}
						label={"CourseLevel"}
					/></Col>
				</Row>
			</Container>
			<Button variant="primary" type="submit">
				Search
			</Button>
		</Form>
	);
};

export default BasicCourseSearchForm;