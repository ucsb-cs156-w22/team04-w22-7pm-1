import React from "react";

import PersonalScheduleForm from "main/components/PersonalSchedule/PersonalScheduleForm";
import { personalSchedulesFixtures } from "fixtures/personalSchedulesFixtures";

export default {
  title: "components/PersonalSchedule/PersonalScheduleForm",
  component: PersonalScheduleForm,
};

const Template = (args) => {
  return <PersonalScheduleForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  submitText: "Create",
  submitAction: () => {
    console.log("Submit was clicked");
  },
};

export const Show = Template.bind({});

Show.args = {
  schedules: personalSchedulesFixtures.oneSchedule,
  submitText: "",
  submitAction: () => {},
};
