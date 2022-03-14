import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

import { allTheSubjects } from "fixtures/subjectFixtures";
import { quarterRange } from "main/utils/quarterUtilities";

import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import ManyLevelDropdown from "../Level/LevelDropdown";
import SingleSubjectDropdown from "../Subjects/SingleSubjectDropdown"
import { useNavigate } from 'react-router-dom'


const BasicCourseSearchForm = ({ setCourseJSON, fetchJSON }) => {

	const quarters = quarterRange("20084", "20222");

	// Stryker disable all : hard-coded string 
    const localSubject = localStorage.getItem("BasicSearch.Subject");
    const localQuarter = localStorage.getItem("BasicSearch.Quarter");
	const localLevel = localStorage.getItem("BasicSearch.CourseLevel");
	//Stryker enable all
	
	const firstDepartment = allTheSubjects[0].subjectCode;
	//Stryker disable next-line all: cannot change it to boolean value
	const [quarter, setQuarter] = useState(localQuarter || quarters[0].yyyyq);
	const [subject, setSubject] = useState(localSubject || firstDepartment);
	const [level, setLevel] = useState(localLevel || "U");
	//Stryker enable all

	const handleSubmit = (event) => {
		
		event.preventDefault();
		fetchJSON(event, {quarter, subject, level});
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
						data-testid = "BasicSearch.Quarter" 
						label={"Quarter"}
					/></Col>
					<Col md = "auto"><SingleSubjectDropdown
						subjects={allTheSubjects}
						subject={subject}
						setSubject={setSubject}
                        controlId={"BasicSearch.Subject"}
						data-testid = "BasicSearch.Subject" 
                        label={"Subject"}
					/></Col>
					<Col md = "auto"><ManyLevelDropdown
						level={level}
						setLevel={setLevel}
						controlId={"BasicSearch.CourseLevel"}
						data-testid = "BasicSearch.CourseLevel" 
						label={"CourseLevel"}
					/></Col>
				</Row>
			</Container>
			<Button variant="primary" type="submit" data-testid = "BasicSearch.Submit"> 
				Search
			</Button>
		</Form>
	);
};

export default BasicCourseSearchForm;