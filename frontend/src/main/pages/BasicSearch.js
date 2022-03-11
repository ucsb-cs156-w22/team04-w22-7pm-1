import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBSubjectsTable from 'main/components/UCSBSubjects/UCSBSubjectsTable';

import CoursesTable from 'main/components/Courses/CoursesTable';
import ManyLevelDropdown from 'main/components/Level/LevelDropdown';

import { useCurrentUser } from 'main/utils/currentUser'


export default function BasicSearch() {

  const currentUser = useCurrentUser();
    
  const { data: subjects, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/UCSBSubjects/all"],
      { method: "GET", url: "/api/UCSBSubjects/all" },
      []
    );
  
  const { data: courses, error: _error, status: _status } =
  useBackend(
    ["/api/public/curriculum"],
    { method: "GET", url: "/api/public/curriculum" },
    []
  );
  
  const 
  const onChange = null;
  
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>BasicSearch</h1>
        <div>
          <CoursesTable courses={courses} currentUser ={currentUser} />
        </div>
        <div>
          <ManyLevelDropdown level={level} setLevel={setlevel} onChange={onChange}/>
        </div>
      </div>
    </BasicLayout>
  )
}