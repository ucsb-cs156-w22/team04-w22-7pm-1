import React, { useState } from 'react'
import { Button, Form, DropdownButton, Dropdown } from 'react-bootstrap';

import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';


function SubmitButton({ initialUCSBSubject, submitAction}) {

    return (

        //<Form onSubmit={handleSubmit(submitAction)}>

            <Button
                variant="primary"
                data-testid="level-submit"
                onClick={() => toast("If search were implemented, we would have made a call to the back end to get courses for x subject, x quarter, x level")}
            >
                Submit
            </Button>

        //</Form>

    )
}

export default SubmitButton;