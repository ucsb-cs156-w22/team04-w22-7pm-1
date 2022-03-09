import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";



export default function  CoursesTable({  courses, currentUser }) {

   const limitText = ({value})=>{
 
          
            return value.substr(0,150);
          
          
           
    };

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
            Header: 'title',
            accessor: 'title',
            
        },
        {
            Header: 'description',
            accessor: 'description',
            Cell:limitText,

           
        },
        {
            Header: 'objLevelCode',
            accessor: 'objLevelCode',
            
        },
        {
            Header: 'subjectArea',
            accessor: 'subjectArea',
           
        },
        {
            Header: 'unitsFixed',
            accessor: 'unitsFixed',
           
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

