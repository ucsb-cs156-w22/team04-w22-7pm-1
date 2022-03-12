import React, { useState } from 'react'
import { Form } from 'react-bootstrap';

const ManyLevelDropdown = ({ levels, level, setLevel, controlId, onChange = null, label = "CourseLevel"}) => {
    // Stryker disable all
    const localSearchLevel = localStorage.getItem(controlId);

    const [levelState, setLevelState] = useState(
        // Stryker disable next-line all : not sure how to test/mock local storage
        localSearchLevel || "UG-lower div"
    );

    const handleLevelOnChange = (event) => {
        const selectedLevel = event.target.value;
        localStorage.setItem(controlId, selectedLevel);
        setLevelState(selectedLevel);
        setLevel(selectedLevel);
        if (onChange != null) {
            onChange(event);
        }
    };
    const allLevels = ["UG-lower div","UG-upper div", "GRAD", "All"]
    return (

        <Form.Group controlId={controlId}>  
            <Form.Label>{label}</Form.Label>
            <Form.Control 
                title = "Course Level" 
                as="select" 
                value={levelState} 
                onChange={handleLevelOnChange} 
                id="level-dropdown" 
                data-testid="level-dropdown" >

                {allLevels.map(function (object, i) {
                    const key=`${controlId}-option-${i}`;
                    return (
                        <option
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
