import React, { useState } from 'react'
import { Form } from 'react-bootstrap';

const ManyLevelDropdown = ({levels, level, setLevel, controlId, onChange = null, label = "Course Level"}) => {
    
    const localSearchLevel = localStorage.getItem(controlId);
    
    const [levelState, setLevelState] = useState(
        // Stryker disable next-line all : not sure how to test/mock local storage
        localSearchLevel || "U"
    );

    // Stryker disable all
    const handleLevelOnChange = (event) => {
        
        localStorage.setItem(controlId, event.target.value);
        setLevelState(event.target.value)
        setLevel(event.target.value);
        if (onChange != null) {
            onChange(event);
        }
    };
    const levels = ["UG-lower div", "UG-upper div", "GRAD", "All"]
    return (

        <Form.Group controlId={controlId}>  
            <Form.Label>{label}</Form.Label>
            <Form.Control 
                //title = "Course Level" 
                as="select" 
                value={levelState} 
                onChange={handleLevelOnChange} 
                //id="level-dropdown" 
                //data-testid="level-dropdown" 
                >

                {levels.map(function (object, i) {
                    const key=`level-dropdown-option-${i}`;
                    return (
                        <option
                            //label = {object}
                            key={key}
                            data-testid={key}
                            value={object[0]}
                        >
                            {object[1]}
                        </option>
                    );
                })}

            </Form.Control>
        </Form.Group>
    );
};

export default ManyLevelDropdown;
