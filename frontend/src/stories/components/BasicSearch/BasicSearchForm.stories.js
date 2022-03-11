import React from 'react';

import BasicSearchForm from "main/components/BasicSearch/BasicSearchForm";

export default {
  title: 'components/BasicSearch/BasicSearchForm',
  component: BasicSearchForm
};

const initialJSON = {
    "pageNumber": 1,
    "pageSize": 1,
    "total": 0,
    "classes": []
};

const setCourseJsonStandin = () => { return initialJSON; };
const fetchJSONStandin = () => Promise.resolve();

const Template = (_args) => {
  return(
    <BasicCourseSearchForm setCourseJson={setCourseJsonStandin} fetchJSON={fetchJSONStandin} />
  )
}

export const Empty = Template.bind({});
Empty._args = {};
