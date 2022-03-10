import React, { useState } from 'react';

import LevelDropdown from "main/components/Level/LevelDropdown";
export default {
    title: 'components/Level/LevelDropdown',
    component: LevelDropdown
};

const Template = (args) => {
    const [level, setLevel] = useState("All");
  
    return (
      < LevelDropdown setLevel={setLevel} level={level} {...args} />
    )
  };

export const manyLevelDropdown = Template.bind({}); 
