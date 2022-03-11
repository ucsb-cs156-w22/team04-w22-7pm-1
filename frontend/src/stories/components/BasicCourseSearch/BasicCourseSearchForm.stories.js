import React from 'react';

import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";

export default {
  title: 'components/BasicCourseSearch/BasicCourseSearchForm',
  component: BasicCourseSearchForm
};

const Template = (args) => {
  return (
      <BasicCourseSearchForm {...args} />
  )
};

export const Default = Template.bind({});

Default.args = {
  submitText: "Create",
  submitAction: () => { console.log("Submit was clicked"); }
};

// const initialJSON = {
//     "pageNumber": 1,
//     "pageSize": 1,
//     "total": 0,
//     "classes": []
// };

// const setCourseJsonStandin = () => { return initialJSON; };
// const fetchJSONStandin = () => Promise.resolve();

// const Template = (_args) => {
//   return(
//     <BasicCourseSearchForm setCourseJson={setCourseJsonStandin} fetchJSON={fetchJSONStandin} />
//   )
// }

// export const Empty = Template.bind({});
// Empty._args = {};
