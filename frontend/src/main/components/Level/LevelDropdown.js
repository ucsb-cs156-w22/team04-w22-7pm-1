import React, { useState } from 'react'
import { Form } from 'react-bootstrap';

const ManyLevelDropdown = ({ level, setLevel, onChange = null}) => {
    // Stryker disable all
    const handleLevelOnChange = (event) => {
        setLevel(event.target.value);
        if (onChange != null) {
            onChange(event);
        }
    };
    const levels = [
    {label:"UG-lower div", value:"L"}, 
    {label:"UG-upper div", value:"S"},
    {label:"UG-All", value:"U"},
    {label:"GRAD", value:"G"}

]
    return (

        <Form.Group >  
            <Form.Label>Course Level</Form.Label>
            <Form.Control title = "Course Level" as="select" value={level} onChange={handleLevelOnChange} id="level-dropdown" data-testid="level-dropdown" >

                {levels.map(function (object, i) {
                    const key=`level-dropdown-option-${i}`;
                    return (
                        <option
                            label = {object.label}
                            key={key}
                            data-testid={key}
                            value={object.value}
                        >
                        </option>
                    );
                })}

            </Form.Control>
        </Form.Group>
    );
};

export default ManyLevelDropdown;
