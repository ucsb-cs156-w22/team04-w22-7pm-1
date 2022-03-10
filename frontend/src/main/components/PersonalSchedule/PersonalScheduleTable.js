import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
// import { toast } from "react-toastify";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/PersonalScheduleUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function PersonalScheduleTable({ personalSchedules, currentUser }) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/personalschedule/edit/${cell.row.values.id}`);
  };

  // Stryker disable all : hard to test for query caching

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/ucsbdates/all"]
  );
  // Stryker enable all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "id",
      accessor: "id", // accessor is the "key" in the data
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Description",
      accessor: "localDateTime",
    },
    {
      Header: "QuarterYYYYQ",
      accessor: "quarterYYYYQ",
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(ButtonColumn("Edit", "primary", editCallback, "UCSBDatesTable"));
    columns.push(ButtonColumn("Delete", "danger", deleteCallback, "UCSBDatesTable"));
  }

  // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
  const memoizedColumns = React.useMemo(() => columns, [columns]);
  const memoizedPersonalSchedules = React.useMemo(() => personalSchedules, [personalSchedules]);

  return (
    <OurTable
      data={memoizedPersonalSchedules}
      columns={memoizedColumns}
      testid={"PersonalScheduleTable"}
    />
  );
}
