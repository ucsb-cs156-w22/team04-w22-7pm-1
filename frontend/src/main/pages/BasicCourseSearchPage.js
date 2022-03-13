import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";
import CoursesTable from "main/components/Courses/CoursesTable"

import axios from "axios";

import { useState } from "react";
import { useBackendMutation } from "main/utils/useBackend";

 

const Home = () => {

    // every function that starts with "use" is a hook
    // e.g. useState, useSWR, useAuth0

    // courseJSON is the variable for the state
    // setCourseJSON is the setter
    // the parameter to useState is the initial value of the state

    const initialCourseJSON = {
        "pageNumber": 1,
        "pageSize": 1,
        "total": 0,
        "classes": []
    };

    const [returned_courses, setCourses] = useState([]);

    // courseId, title, sectionNumber, instructor, enroll code, units, total enrolled students, max enrolled
    //const [courseJSON, setCourseJSON] = useState(initialCourseJSON);

    
    /*
    const objectToAxiosParams = (query) => ({
      url: "/api/curriculum/curriculum",
      method: "GET",
      params: {
        qtr: query.quarter,
        dept: query.subject,
        level: query.level
      },
    });

    const onSuccess = (courses) => { return courses };

    setCourses(courses)

    const mutation = useBackendMutation(objectToAxiosParams, {onSuccess}, []);

    async function fetchBasicCourseJSON(event, query) {
      mutation.mutate(query);
    }*/

    const fetchBasicCourseJSON = async (event, {quarter, subject, level}) => {
      const response = await axios({
        url: "/api/curriculum/curriculum",
        method: "GET",
        params: {
          qtr: quarter,
          dept: subject,
          level: level
        }
      }).then(e => e.data.classes)
      setCourses(response);
    };


    return (
        <BasicLayout>
            <div className="text-left">
                <h5>Welcome to the UCSB Courses Search App!</h5>

                <BasicCourseSearchForm fetchJSON={fetchBasicCourseJSON} />
                
                <CoursesTable courses = {returned_courses}/>
            </div>
        </BasicLayout>
    );
};

export default Home;