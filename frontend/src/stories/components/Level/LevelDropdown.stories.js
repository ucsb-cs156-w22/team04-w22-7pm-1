import React, { useState } from 'react';

import LevelDropdown from "main/components/Level/LevelDropdown";

//import {levels} from "main/utils/levelUtilities"

//EX: DO I EVEN NEED THE IMPORT ABOVE FOR UTILITIES FOR OUR LEVEL DROPDOWN BECAUSE IM NOT CHANGING ANYTHING

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
// manyLevelDropdown.args = {
//     levels: //genuinely don't know if or do I add anything in this field.
// };
