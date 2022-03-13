import { render } from "@testing-library/react";
import BasicCourseSearchPage from "main/pages/BasicCourseSearchPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { coursesFixtures } from "../../fixtures/coursesFixtures";


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


});