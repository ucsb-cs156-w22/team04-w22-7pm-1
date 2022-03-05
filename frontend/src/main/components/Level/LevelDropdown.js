import React, { useState } from 'react'
import { Form } from 'react-bootstrap';

const ManyLevelDropdown = ({ level, setLevel, onChange = null}) => {

    // const localSearchLevel= localStorage.getItem(controlId);

//     const [levelState, setLevelState] = useState(
//     // Stryker disable next-line all : not sure how to test/mock local storage
//    // localSearchLevel || quarters[0].yyyyq //EX: WHAT DOES THIS DO (COMMENTED THIS ENTIRE LINE OUT)
//     );

    // const handleQuarterOnChange = (event) => {
    //     const selectedQuarter = event.target.value;
    //     localStorage.setItem(controlId, selectedQuarter);
    //     setQuarterState(selectedQuarter);
    //     setQuarter(selectedQuarter);
    //     if (onChange != null) {
    //         onChange(event);
    //     }
    // };   
    
    // const handleLevelOnChange = (event) => {
    //     const selectedLevel = event.target.value;
    //     localStorage.setItem(controlId, selectedLevel);
    //     setLevelState(selectedLevel);
    //     setLevel(selectedLevel);
    //     if (onChange != null) {
    //         onChange(event);
    //     }
    // };
    
    //EX: commented the ones above because I don't think they're sufficient/accurate. 
    const handleLevelOnChange = (event) => {
        setLevel(event.target.value);
        if (onChange != null) {
            onChange(event);
        }
    };

    return (
        //probably need to change the "LevelDropdown.Level"
        <Form.Group controlId="LevelDropdown.Level">  
            <Form.Label>Course Level</Form.Label>
            <Form.Control as="select" value={level} onChange={handleLevelOnChange} >
                <option label = "UG-lower div" value="UG-lower div"></option>;
                <option label = "UG-upper div" value="UG-upper div"></option>;
                <option label = "GRAD" value="GRAD"></option>;
                <option label = "All" value="All"></option>;
                
            </Form.Control>
        </Form.Group>
    );
};

export default ManyLevelDropdown;
