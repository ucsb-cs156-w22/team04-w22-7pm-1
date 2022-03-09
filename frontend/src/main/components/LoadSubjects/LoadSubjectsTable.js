import React from "react";
import OurTable from "main/components/OurTable"

const columns = [
    {
        Header: 'id',
        accessor: 'id', // accessor is the "key" in the data
    },
    {
        Header: 'SubjectCode',
        accessor: 'subjectCode',
      },
      {
        Header: 'SubjectTranslation',
        accessor: 'subjectTranslation',
      },
      {
        Header: 'DeptCode',
        accessor: 'deptCode',
      },
      {
        Header: 'CollegeCode',
        accessor: 'collegeCode',
      },
      {
        Header: 'RelatedDeptCode',
        accessor: 'relatedDeptCode',
      },
      {
        Header: 'Inactive',
        accessor: (row) => String(row.inactive),
        id: 'inactive',
      },
];

export default function LoadSubjectsTable({ subjects }) {
    return <OurTable
        data={subjects}
        columns={columns}
        testid={"LoadSubjectsTable"} />;
};