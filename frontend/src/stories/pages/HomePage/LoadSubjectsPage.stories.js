
import React from 'react';
import loadsubjectsFixtures from 'fixtures/loadsubjectsFixtures';

import LoadSubjectsTable from "main/components/LoadSubjects/LoadSubjectsTable";

export default {
    title: 'components/LoadSubjects/LoadSubjectsTable',
    component: LoadSubjectsTable
};

const Template = () => <LoadSubjectsTable subjects={loadsubjectsFixtures.threeSubjects}/>;

export const Default = Template.bind({});
