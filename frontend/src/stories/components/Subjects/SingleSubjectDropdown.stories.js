import React, { useState } from 'react';

import SingleSubjectDropdown from "main/components/Subjects/SingleSubjectDropdown";

import * as subjectFixtures from 'fixtures/subjectFixtures.js';

export default {
    title: 'components/Subjects/SingleSubjectDropdown',
    component: SingleSubjectDropdown
};

const Template = (args) => {
    const [subject, setSubject] = useState(args.subjects[0]);

    return (
        < SingleSubjectDropdown 
        subject={subject} 
        setSubject={setSubject} 
        controlId={"SampleControlId"}
        label={"Subject"} 
        {...args} />
    )
};


export const OneSubject = Template.bind({});
OneSubject.args = {
    subjects: subjectFixtures.oneSubject
};

export const ThreeSubjects = Template.bind({});
ThreeSubjects.args = {
    subjects: subjectFixtures.threeSubjects
};

export const AllTheSubjects = Template.bind({});
AllTheSubjects.args = {
    subjects: subjectFixtures.allTheSubjects
};
