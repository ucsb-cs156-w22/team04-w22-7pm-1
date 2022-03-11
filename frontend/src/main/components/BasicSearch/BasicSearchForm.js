import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

import { allTheSubjects } from "fixtures/subjectFixtures";
import { allTheLevels } from "fixtures/levelsFixtures"
import { quarterRange } from "main/utils/quarterUtilities";

import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import ManyLevelDropdown from "../Level/LevelDropdown";
import SingleSubjectDropdown from "../Subjects/SingleSubjectDropdown"

const BasicCourseSearchForm = ({ setCourseJSON, fetchJSON }) => {
	const quarters = quarterRange("20084", "20222");
	const levels = [["L","Undergrad-Lower"], 
					["S","Undergrad-Upper Division"], 
					["U","Undergrad-All"], 
					["G","Graduate"]];

    const localSubject = localStorage.getItem("BasicSearch.Subject");
    const localQuarter = localStorage.getItem("BasicSearch.Quarter");
	const localLevel = localStorage.getItem("BasicSearch.CourseLevel");
	
	const firstDepartment = allTheSubjects[0].subjectCode;
	const [quarter, setQuarter] = useState(localQuarter || quarters[0].yyyyq);
	const [subject, setSubject] = useState(localSubject || firstDepartment);
	const [level, setLevel] = useState(localLevel || "U");
	const [errorNotified, setErrorNotified] = useState(false);

	useEffect(() => {
		if (!errorNotified && errorGettingSubjects) {
			toast(`${errorGettingSubjects}`, { appearance: "error" });
			setErrorNotified(true);
		}
	}, [errorGettingSubjects, errorNotified, toast]);

	const handleSubmit = (event) => {
		event.preventDefault();
		fetchJSON(event, { quarter, subject, level }).then((courseJSON) => {
			if (courseJSON.total === 0) {
				toast("There are no courses that match the requested criteria.", {
					appearance: "error",
				});
			}
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
						setSubject={handleSubjectOnChange}
                        controlId={"BasicSearch.Subject"}
                        label={"Subject"}
					/></Col>
					<Col md = "auto"><ManyLevelDropdown
						levels={levels}
						level={level}
						setLevel={handleLevelOnChange}
						controlId={"BasicSearch.Level"}
						label={"Level"}
					/></Col>
				</Row>
			</Container>
			<Button variant="primary" type="submit">
				Submit
			</Button>
		</Form>
	);
};

export default BasicCourseSearchForm;