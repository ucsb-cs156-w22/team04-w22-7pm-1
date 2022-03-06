import { getByLabelText, getByTitle, render, waitFor} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";


import ManyLevelDropdown from "main/components/Level/LevelDropdown";


describe("level dropdown tests", () => {

    const queryClient = new QueryClient();

    test("The Dropdown is able to reassign values and operates", async () => {

        const {getByTestId  } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ManyLevelDropdown />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(getByTestId("level-dropdown")).toBeInTheDocument());
        //const dropdown = getByTestId("level-dropdown");

        //const selectLevel = getByTitle("Course Level")
        userEvent.selectOptions(getByTestId("level-dropdown"), "GRAD");
        expect(setLevel).toBeCalledWith("GRAD");

        // const aElement = dropdown.querySelector("All");
        // expect(aElement).toBeInTheDocument();
        // aElement?.click();
        // await waitFor( () => expect(getByTestId("level-dropdown")).toBeInTheDocument() );

    });


});