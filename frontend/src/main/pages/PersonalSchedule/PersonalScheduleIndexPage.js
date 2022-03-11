import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { hasRole } from "main/utils/currentUser";
import React, { useEffect } from "react";
import PersonalScheduleTable from "main/components/PersonalSchedule/PersonalScheduleTable";
import { useCurrentUser } from "main/utils/currentUser";
import { useBackend } from "main/utils/useBackend";

export default function PersonalScheduleIndexPage() {
  const currentUser = useCurrentUser();

  // Stryker disable all : hard to test, the queryKey doesn't really matter
  // but it needs to be same as the actual request
  const {
    data: schedule,
    error: _error,
    status: _status,
  } = useBackend(
    [
      hasRole(currentUser, "ROLE_ADMIN")
        ? "/api/PersonalSchedules/admin/all"
        : "/api/PersonalSchedules/all",
    ],
    {
      method: "GET",
      url: hasRole(currentUser, "ROLE_ADMIN")
        ? "/api/PersonalSchedules/admin/all"
        : "/api/PersonalSchedules/all",
    },
    []
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>PersonalSchedule</h1>
        <PersonalScheduleTable schedules={schedule} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}
