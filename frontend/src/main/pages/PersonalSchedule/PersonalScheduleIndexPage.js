import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import React from "react";
import PersonalScheduleTable from "main/components/PersonalSchedule/PersonalScheduleTable";
import { useCurrentUser } from "main/utils/currentUser";
import { useBackend } from "main/utils/useBackend";

export default function PersonalScheduleIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: schedule,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/PersonalSchedules/all"],
    { method: "GET", url: "/api/PersonalSchedules/all" },
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
