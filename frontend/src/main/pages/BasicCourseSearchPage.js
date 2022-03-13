import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";
import { Navigate } from 'react-router-dom'
import { useState } from "react";
import { useBackendMutation } from "main/utils/useBackend";


const Home = () => {
    //Stryker disable all
    const initialCourseJSON = {
        "pageNumber": 1,
        "pageSize": 1,
        "total": 0,
        "classes": []
    };
    //Stryker enable all

    const [courseJSON, setCourseJSON] = useState(initialCourseJSON);
    
    const objectToAxiosParams = (query) => ({
      // Stryker disable next-line all 
      url: "/api/curriculum/curriculum",
      method: "GET",
      params: {
        qtr: query.quarter,
        dept: query.subject,
        level: query.level
      },
    });

    // Stryker disable next-line all 
    const onSuccess = (courses) => { return courses };

    const mutation = useBackendMutation(
        objectToAxiosParams,
         {onSuccess},
         // Stryker disable next-line all 
         ["api/curriculum/curriculum"]
         );

    const { isSuccess } = mutation

    async function fetchBasicCourseJSON(event, query) {
      mutation.mutate(query);
    }

    if (isSuccess) {
        return <Navigate to="/basiccoursesearch/index" />
    }


    return (
        <BasicLayout>
            <div className="text-left">
                <h5>Welcome to the UCSB Courses Search App!</h5>

                <BasicCourseSearchForm setCourseJSON={setCourseJSON} fetchJSON={fetchBasicCourseJSON} />
            </div>
        </BasicLayout>
    );
};

export default Home;