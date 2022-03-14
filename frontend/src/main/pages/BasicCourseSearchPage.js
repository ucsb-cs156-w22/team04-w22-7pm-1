import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";
import CoursesTable from "main/components/Courses/CoursesTable"
import { Navigate } from 'react-router-dom'
import { useState } from "react";
import { useBackendMutation } from "main/utils/useBackend";
import { queryAllByTestId } from "@testing-library/react";
import { toast } from "react-toastify";

const Home = () => {

    const [courseJSON, setCourseJSON] = useState([]);
    
    const objectToAxiosParams = (query) => ({
      // Stryker disable next-line all : hard to set up test for caching
      url: "/api/curriculum/curriculum",
      method: "GET",
      params: {
        qtr: query.quarter,
        dept: query.subject,
        level: query.level
      },
    });

    // Stryker disable next-line all : hard to set up test for caching
    const onSuccess = (courses) => { 
      setCourseJSON(courses.classes);
    };

    const mutation = useBackendMutation(
        objectToAxiosParams,
         {onSuccess},
         // Stryker disable next-line all : hard to set up test for caching
         []
         );

    async function fetchBasicCourseJSON(event, query) {
      mutation.mutate(query);
    }


    return (
        <BasicLayout>
            <div className="text-left">
                <h5>Welcome to the UCSB Courses Search App!</h5>

                <BasicCourseSearchForm fetchJSON={fetchBasicCourseJSON} />

                <CoursesTable courses={courseJSON} />

            </div>
        </BasicLayout>
    );
};

export default Home;