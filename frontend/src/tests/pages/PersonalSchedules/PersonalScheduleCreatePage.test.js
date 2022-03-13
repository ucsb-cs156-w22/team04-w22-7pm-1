import { render, waitFor, fireEvent, screen } from "@testing-library/react";

import PersonalScheduleCreatePage from "main/pages/PersonalSchedule/PersonalScheduleCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("PersonalScheduleCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalScheduleCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const personalschedule = {
      id: 99,
      name: "Test name 1",
      description: "Test description 1",
      quarterYYYYQ: "20221",
    };

    axiosMock.onPost("/api/PersonalSchedules/post").reply(202, personalschedule);

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalScheduleCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByTestId("PersonalScheduleForm-name")).toBeInTheDocument();
    });

    const nameField = getByTestId("PersonalScheduleForm-name");
    const descriptionField = getByTestId("PersonalScheduleForm-description");
    const quarterField = document.querySelector("#PersonalScheduleForm-quarter");
    const submitButton = getByTestId("PersonalScheduleForm-submit");

    fireEvent.change(nameField, { target: { value: "Test Name 1" } });
    fireEvent.change(descriptionField, { target: { value: "Test description 1" } });
    fireEvent.change(quarterField, { target: { value: "20222" } });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      name: "Test Name 1",
      description: "Test description 1",
      quarterYYYYQ: "20222",
      user: undefined,
    });

    expect(mockToast).toBeCalledWith("New personalschedule Created - name: Test name 1");
    expect(mockNavigate).toBeCalledWith({ to: "/personalschedule/list" });
  });
});
