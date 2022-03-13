import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";
import CoursesTable from "main/components/Courses/CoursesTable"

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

    // courseId, title, sectionNumber, instructor, enroll code, units, total enrolled students, max enrolled
    const [courseJSON, setCourseJSON] = useState(initialCourseJSON);

    
    const objectToAxiosParams = (query) => ({
      url: "/api/curriculum/curriculum",
      method: "GET",
      params: {
        qtr: query.quarter,
        dept: query.subject,
        level: query.level
      },
    });

    const [returned_courses, setCourses] = useState([]);

    const onSuccess = (courses) => { return courses };

    setCourses(courses)

    const mutation = useBackendMutation(objectToAxiosParams, {onSuccess}, []);

    async function fetchBasicCourseJSON(event, query) {
      mutation.mutate(query);
    }

    return (
        <BasicLayout>
            <div className="text-left">
                <h5>Welcome to the UCSB Courses Search App!</h5>

                <BasicCourseSearchForm setCourseJSON={setCourseJSON} fetchJSON={fetchBasicCourseJSON} />
                <CoursesTable coursestab = {returned_courses}/>
            </div>
        </BasicLayout>
    );
};

export default Home;