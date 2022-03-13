import { render,waitFor,fireEvent } from "@testing-library/react";
import BasicCourseSearchPage from "main/pages/BasicCourseSearchPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { coursesFixtures } from "../../fixtures/coursesFixtures";



const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});





describe("BasicCourseSearchPage tests", () => {


    
    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    axiosMock.onGet("/api/curriculum/curriculum").reply(200,coursesFixtures.oneCourses)
    
    
    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BasicCourseSearchPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });


    test("test nav", async () => {

        const queryClient = new QueryClient();
        const initialCourseJSON = {
            "Quarter": "20221",
            "Subject": "CMPSC",
            "CourseLevel": "All",
        };

        axiosMock.onPost("/api/curriculum/curriculum").reply( 202, initialCourseJSON );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BasicCourseSearchPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("BasicCourseSearchForm-Quarter")).toBeInTheDocument();
        });

        const localSubjectField = getByTestId("BasicCourseSearchForm-Subject");
        const localQuarterField = getByTestId("BasicCourseSearchForm-Quarter");
        const localLevelField = getByTestId("BasicCourseSearchForm-CourseLevel");
        const searchButton = getByTestId("BasicCourseSearchForm-search");
        fireEvent.change(localSubjectField, { target: { value: 'CMPSC' } });
        fireEvent.change(localQuarterField, { target: { value: '20221' } });
        fireEvent.change(localLevelField, { target: { value: 'All' } });
     

        expect(searchButton).toBeInTheDocument();

        fireEvent.click(searchButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "Subject": "CMPSC",
            "Quarter": "20221",
            "CourseLevel": "All",

        });
        expect(mockNavigate).toBeCalledWith({ "to": "/basiccoursesearch/index" });
    });




});