import { hasRole } from "main/utils/currentUser";
import React from "react"
import OurTable from "../OurTable"


export default function PersonalScheduleTable ({schedule, currentUser})
{
	const columns = [
		{
			Header: 'id',
			accessor: 'id',
		},
		{
			Header: 'name',
			accessor: 'Name'
		},
		{
			Header: 'description',
			accessor: 'Description',
		},
		{
			Header: 'quarterYYYYQ',
			accessor: 'QuarterYYYYQ',
		}
	];

	const memoizedColumns = React.useMemo(() => columns, [columns]);
	const memoizedSchedule = React.useMemo (() => schedule, [schedule]);

	return <OurTable
		data={memoizedSchedule}
		columns = {memoizedColumns}
		testid = {"PersonalScheduleTbale"}
		/>;
};