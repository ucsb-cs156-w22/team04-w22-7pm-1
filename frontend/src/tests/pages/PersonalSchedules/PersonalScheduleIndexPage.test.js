import { render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import PersonalScheduleIndexPage from "main/pages/PersonalSchedule/PersonalScheduleIndexPage";
import { personalSchedulesFixtures } from "fixtures/personalSchedulesFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

describe("PersonalScheduleIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const testId = "PersonalScheduleTable";
  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
  };

  test("renders without crashing for regular user", () => {
    setupUserOnly();
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/PersonalSchedules/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalScheduleIndexPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders without crashing for admin user", () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/PersonalSchedules/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalScheduleIndexPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders three PersonalSchedule without crashing for regular user", async () => {
    setupUserOnly();
    const queryClient = new QueryClient();
    axiosMock
      .onGet("/api/PersonalSchedules/all")
      .reply(200, personalSchedulesFixtures.threeSchedules);

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalScheduleIndexPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("CS156");
    });
    expect(getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("CS154");
    expect(getByTestId(`${testId}-cell-row-2-col-name`)).toHaveTextContent("CS130A");
  });

  test("renders three schedules without crashing for admin user", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock
      .onGet("/api/PersonalSchedules/admin/all")
      .reply(200, personalSchedulesFixtures.threeSchedules);

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalScheduleIndexPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("CS156");
    });
    expect(getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("CS154");
    expect(getByTestId(`${testId}-cell-row-2-col-name`)).toHaveTextContent("CS130A");
  });

  test("renders empty table when backend unavailable, user only", async () => {
    setupUserOnly();

    const queryClient = new QueryClient();
    axiosMock.onGet("/api/PersonalSchedules/all").timeout();

    const restoreConsole = mockConsole();

    const { queryByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalScheduleIndexPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error communicating with backend via GET on /api/PersonalSchedules/"
    );
    restoreConsole();

    expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
  });
});
