import { render, waitFor, fireEvent } from "@testing-library/react";
import SubmitButton from "main/components/SubmitButton/SubmitButton"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("SubmitButton tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
    });

    test("when submit button is hit, it gives a toast", async () => {

        const queryClient = new QueryClient();
        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SubmitButton />
                </MemoryRouter>
            </QueryClientProvider>
        );
        
        const submitButton = getByTestId("level-submit");


        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);
            
        expect(mockToast).toBeCalledWith("If search were implemented, we would have made a call to the back end to get courses for x subject, x quarter, x level");

    });

});