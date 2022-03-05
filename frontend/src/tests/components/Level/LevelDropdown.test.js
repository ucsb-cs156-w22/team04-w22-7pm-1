import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import leveldropdown from "main/components/Level/LevelDropdown"


jest.mock('react', ()=>({
    ...jest.requireActual('react'),
    useState: jest.fn()
  }))
import { useState } from 'react';

describe("manyLevelDropdown tests", () => {

    beforeEach(() => {
        useState.mockImplementation(jest.requireActual('react').useState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const level = jest.fn();
    const setLevel = jest.fn();

    test("renders without crashing on one level", () => {
        render(<leveldropdown
            //quarters={quarterRange("20211", "20211")}
            level={level}
            setLevel={setLevel}
            //controlId="sqd1" //DUDE WHAT IS THIS LMAO
        />);
    });

    // test("renders without crashing on three quarters", () => {
    //     render(<SingleQuarterDropdown
    //         quarters={quarterRange("20214", "20222")}
    //         quarter={quarter}
    //         setQuarter={setQuarter}
    //         controlId="sqd1"
    //     />);
    // });

    test("when I select an object, the value changes", async () => {
        const { getByLabelText } =
            render(<leveldropdown
                //quarters={quarterRange("20211", "20222")}
                level={level}
                setLevel={setLevel}
               // controlId="sqd1"        //WHAT ARE THESE TWO BELOW 
                label="Course Level"
            />
            );
        await waitFor(() => expect(getByLabelText("Course Level")).toBeInTheDocument);
        const selectLevel = getByLabelText("Course Level")
        userEvent.selectOptions(selectLevel, "GRAD");
        expect(setLevel).toBeCalledWith("GRAD");
    });

    test("if I pass a non-null onChange, it gets called when the value changes", async () => {
        const onChange = jest.fn();
        const { getByLabelText } =
            render(<leveldropdown
                //quarters={quarterRange("20211", "20222")}
                level={level}
                setLevel={setLevel}
                //controlId="sqd1"       //WHAT IS THIS 
                label="Course Level"
                onChange={onChange}
            />
            );
        await waitFor(() => expect(getByLabelText("Course Level")).toBeInTheDocument);
        const selectedLevel = getByLabelText("Course Level")
        userEvent.selectOptions(selectedLevel, "GRAD");
        await waitFor(() => expect(setLevel).toBeCalledWith("GRAD"));
        await waitFor(() => expect(onChange).toBeCalledTimes(1));

        // x.mock.calls[0][0] is the first argument of the first call to the jest.fn() mock x

        //const event = onChange.mock.calls[0][0];    //How doe I change these(2) from quarter to match my dropdown. 
        //console.log(onChange.mock.calls)
        //expect(event.target.value).toBe("GRAD");
    });

    test("default label is Course Level", async () => {
        const { getByLabelText } =
            render(<leveldropdown
                //quarters={quarterRange("20211", "20222")}
                level={level}
                setLevel={setLevel}
                //controlId="sqd1" //WHAT IS THIS ??
            />
            );
        await waitFor(() => expect(getByLabelText("Course Level")).toBeInTheDocument);
    });

});