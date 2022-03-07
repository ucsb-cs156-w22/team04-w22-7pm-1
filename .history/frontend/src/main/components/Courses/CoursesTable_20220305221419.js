import React from "react";
import OurTable from "main/components/OurTable";


export default function  CoursesTable({  courses, currentUser }) {

    const columns = [
        {
            Header: 'quarter',
            accessor: 'quarter', // accessor is the "key" in the data
        },
        {
            Header: 'courseId',
            accessor: 'courseId',
          
        },
        {
            Header: 'mag',
            accessor: 'properties.mag',
            
        },
        {
            Header: 'place',
            accessor: 'properties.place',
           
        },
        {
            Header: 'time',
            accessor: 'properties.time',
            
        }
    ];

    // Stryker disable ArrayDeclaration : [columns] and [students] are performance optimization; mutation preserves correctness
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedDates = React.useMemo(() =>  courses, [courses]);
    // Stryker enable ArrayDeclaration

    return <OurTable
        data={memoizedDates}
        columns={memoizedColumns}
        testid={"CoursesTable"}
    />;
};

