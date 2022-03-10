import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SingleSubjectDropdown from "main/components/Subjects/SingleSubjectDropdown";

import * as subjectFixtures from 'fixtures/subjectFixtures.js';

jest.mock('react', ()=>({
    ...jest.requireActual('react'),
    useState: jest.fn()
  }))
import { useState } from 'react';

describe("SingleSubjectSelector tests", () => {

    beforeEach(() => {
        useState.mockImplementation(jest.requireActual('react').useState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const subject = jest.fn();
    const setSubject = jest.fn();

    test("renders without crashing on one subject", () => {
        render(<SingleSubjectDropdown
            subjects={subjectFixtures.oneSubject}
            subject={subject}
            setSubject={setSubject}
            controlId="ssd1"
        />);
    });

    test("renders without crashing on three subjects", () => {
        render(<SingleSubjectDropdown
            subjects={subjectFixtures.threeSubjects}
            subject={subject}
            setSubject={setSubject}
            controlId="ssd1"
        />);
    });

    test("renders without crashing on many subjects", () => {
        render(<SingleSubjectDropdown
            subjects={subjectFixtures.allTheSubjects}
            subject={subject}
            setSubject={setSubject}
            controlId="ssd1"
        />);
    });

    test("when I select an object, the value changes", async () => {
        const { getByLabelText } =
            render(<SingleSubjectDropdown
                subjects={subjectFixtures.allTheSubjects}
                subject={subject}
                setSubject={setSubject}
                controlId="ssd1"
                label="Subject"
            />
            );
        const selectSubject = getByLabelText("Subject")
        userEvent.selectOptions(selectSubject, "ANTH");
        expect(setSubject).toBeCalledWith("ANTH");
    });

    test("if I pass a non-null onChange, it gets called when the value changes", async () => {
        const onChange = jest.fn();
        const { getByLabelText } =
            render(<SingleSubjectDropdown
                subjects={subjectFixtures.allTheSubjects}
                subject={subject}
                setSubject={setSubject}
                controlId="ssd1"
                label="Select Subject"
                onChange={onChange}
            />
            );
        await waitFor(() => expect(getByLabelText("Select Subject")).toBeInTheDocument);
        const selectSubject = getByLabelText("Select Subject")
        userEvent.selectOptions(selectSubject, "ANTH");
        await waitFor(() => expect(setSubject).toBeCalledWith("ANTH"));
        await waitFor(() => expect(onChange).toBeCalledTimes(1));
        
        const event = onChange.mock.calls[0][0];
        expect(event.target.value).toBe("ANTH");
    });

    test("default label is Subject", async () => {
        const { getByLabelText } =
            render(<SingleSubjectDropdown
                subjects={subjectFixtures.oneSubject}
                subject={subject}
                setSubject={setSubject}
                controlId="ssd1"
            />
            );
        await waitFor(() => expect(getByLabelText("Subject")).toBeInTheDocument);
    });

    test("keys / testids are set correctly on options", async () => {
        const { getByTestId } =
            render(<SingleSubjectDropdown
                subjects={subjectFixtures.oneSubject}
                subject={subject}
                setSubject={setSubject}
                controlId="ssd1"
            />
            );
        const expectedKey = "ssd1-option-0"
        await waitFor(() => expect(getByTestId(expectedKey).toBeInTheDocument));
        const firstOption = getByTestId(expectedKey);
    });

    test("when localstorage has a value, it is passed to useState", async () => {
        const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
        getItemSpy.mockImplementation(() => "ANTH");

        const setSubjectStateSpy = jest.fn();
        useState.mockImplementation((x)=>[x, setSubjectStateSpy])

        const { getByTestId } =
            render(<SingleSubjectDropdown
                subjects={subjectFixtures.allTheSubjects}
                subject={subject}
                setSubject={setSubject}
                controlId="ssd1"
            />
            );

        await waitFor(() => expect(useState).toBeCalledWith("ANTH"));
    });

    test("when localstorage has no value, first element of subject range is passed to useState", async () => {
        const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
        getItemSpy.mockImplementation(() => null);

        const setSubjectStateSpy = jest.fn();
        useState.mockImplementation((x)=>[x, setSubjectStateSpy])

        const { getByTestId } =
            render(<SingleSubjectDropdown
                subjects={subjectFixtures.threeSubjects}
                subject={subject}
                setSubject={setSubject}
                controlId="ssd1"
            />
            );

        await waitFor(() => expect(useState).toBeCalledWith("ANTH"));
    });

    test("sorts based on subjectCode", async () => {
        const { getByText } =
            render(<SingleSubjectDropdown
                subjects={subjectFixtures.wrongSubjectsOrder}
                subject={subject}
                setSubject={setSubject}
                controlId="ssd1"
            />);
        await waitFor(() => expect(getByText("Subject")).toBeInTheDocument);
        expect(getByText("ANTH - Anthropology")).toHaveAttribute("data-testid", "ssd1-option-0");
    });

});