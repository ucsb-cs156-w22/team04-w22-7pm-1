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
    const levels = ["UG-lower div", "UG-upper div", "GRAD", "All"]
    return (

        <Form.Group >  
            <Form.Label>Course Level</Form.Label>
            <Form.Control title = "Course Level" as="select" value={level} onChange={handleLevelOnChange} id="level-dropdown" data-testid="level-dropdown" >

                {levels.map(function (object, i) {
                    const key=`level-dropdown-option-${i}`;
                    return (
                        <option
                            label = {object}
                            key={key}
                            data-testid={key}
                            value={object}
                        >
                        </option>
                    );
                })}

            </Form.Control>
        </Form.Group>
    );
};

export default ManyLevelDropdown;
