import React from "react";

import PersonalScheduleTable from "main/components/PersonalSchedule/PersonalScheduleTable";
import { ucsbDatesFixtures } from "fixtures/personalSchedulesFixtures";

export default {
  title: "components/PersonalSchedule/PersonalScheduleTable",
  component: PersonalScheduleTable,
};

const Template = (args) => {
  return <PersonalScheduleTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  schedules: [],
};

export const ThreeSchedules = Template.bind({});

ThreeSchedules.args = {
  schedules: ucsbDatesFixtures.threeDates,
};
