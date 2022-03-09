import React from 'react';

import CoursesTable from "main/components/Courses/CoursesTable";
import { coursesFixtures } from 'fixtures/coursesFixtures';

export default {
    title: 'components/Courses/CoursesTable',
    component: CoursesTable
};

const Template = (args) => {
    return (
        <CoursesTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    courses: []
};

export const oneCourses = Template.bind({});

oneCourses.args = {
    courses: coursesFixtures.oneCoursesLongDescription

};