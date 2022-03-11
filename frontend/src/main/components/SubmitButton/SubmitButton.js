import React, { useState } from 'react'
import { Button, Form, DropdownButton, Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';


function SubmitButton({ initialUCSBSubject, submitAction}) {

    return (

            <Button
                variant="primary"
                data-testid="level-submit"
                onClick={() => toast("If search were implemented, we would have made a call to the back end to get courses for x subject, x quarter, x level")}
            >
                Submit
            </Button>

    )
}

export default SubmitButton;