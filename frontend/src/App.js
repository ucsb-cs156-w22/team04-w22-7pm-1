import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";
import LoadSubjectsPage from "main/pages/LoadSubjectsPage";

import PersonalScheduleIndexPage from "main/pages/PersonalSchedule/PersonalScheduleIndexPage";
import PersonalSchedulCreatePage from "main/pages/PersonalSchedule/PersonalScheduleCreatePage";
import PersonalSchedulEditPage from "main/pages/PersonalSchedule/PersonalScheduleEditPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";
import BasicCourseListPage from "main/pages/BasicCourseListPage";

function App() {
  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <Route exact path="/admin/users" element={<AdminUsersPage />} />
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <Route exact path="/admin/UCSBSubjects" element={<LoadSubjectsPage />} />
        )}

        {hasRole(currentUser, "ROLE_USER") && (
          <>
            <Route exact path="/personalschedule/list" element={<PersonalScheduleIndexPage />} />
            <Route exact path="/personalschedule/create" element={<PersonalSchedulCreatePage />} />
          </>
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route exact path="/personalschedule/list" element={<PersonalScheduleIndexPage />} />
            <Route exact path="/personalschedule/create" element={<PersonalSchedulCreatePage />} />
            <Route exact path="/personalschedule/edit/:id" element={<PersonalSchedulEditPage />} />
          </>
        )}
        {hasRole(currentUser, "ROLE_USER") && (
            <>

              <Route exact path="/basiccoursesearch/search" element={<BasicCourseSearchPage />} />
              <Route exact path="/basiccoursesearch/index" element={<BasicCourseListPage />} />
            </>
          )
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
