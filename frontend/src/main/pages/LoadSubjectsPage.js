import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import LoadSubjectsTable from "main/components/LoadSubjects/LoadSubjectsTable"

import { useBackend } from "main/utils/useBackend";
const LoadSubjectsPage = () => {

    const { data: subjects, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/admin/UCSBSubjects"],
            { method: "GET", url: "/api/admin/UCSBSubjects/all" },
            []
        );

    return (
        <BasicLayout>
            <h2>Load Subjects</h2>
            <LoadSubjectsTable subjects={subjects} />
        </BasicLayout>
    );
};

export default LoadSubjectsPage;
