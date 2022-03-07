import { getByLabelText, getByTitle, render, waitFor, fireEvent} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";


import ManyLevelDropdown from "main/components/Level/LevelDropdown";

describe("level dropdown tests", () => {
    const onChange = jest.fn();
    const setLevel = jest.fn();
    const queryClient = new QueryClient();
    test("The Dropdown is able to reassign values and operates", async () => {

        const {getByTestId  } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ManyLevelDropdown onChange={onChange} setLevel = {setLevel}/>
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(getByTestId("level-dropdown")).toBeInTheDocument());

        userEvent.selectOptions(getByTestId("level-dropdown"), "GRAD");

        await waitFor(() => expect(setLevel).toBeCalledWith("GRAD"));
        await waitFor(() => expect(onChange).toBeCalledTimes(1));
    });


});