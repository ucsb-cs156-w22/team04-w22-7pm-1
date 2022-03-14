import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import PersonalScheduleEditPage from "main/pages/PersonalSchedule/PersonalScheduleEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import userEvent from '@testing-library/user-event';

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
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("PersonalScheduleEditPage tests", () => {
  describe("when the backend doesn't return a schedule", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/PersonalSchedules", { params: { id: 170 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const { getByText, queryByTestId } = render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalScheduleEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );
      await waitFor(() => expect(getByText("Edit PersonalSchedule")).toBeInTheDocument());
      expect(queryByTestId("PersonalScheduleForm-quarter")).not.toBeInTheDocument();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const setupUserOnly = () => {
      axiosMock.reset();
      window.localStorage.clear();
      axiosMock.resetHistory();
      axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/PersonalSchedules", { params: { id: 17 } }).reply(200, {
        id: 17,
        name: "Test Name 1",
        description: "Test description 1",
        quarterYYYYQ: "20222",
        user: undefined,
      });
      axiosMock.onPut("/api/PersonalSchedules").reply(200, {
        id: "17",
        quarterYYYYQ: "20224",
        name: "PSTAT120A",
        description: "The best class",
      });
    };

    const setupAdminUser = () => {
      axiosMock.reset();
      window.localStorage.clear();
      axiosMock.resetHistory();
      axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
      axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/PersonalSchedules/admin", { params: { id: 17 } }).reply(200, {
        id: 17,
        name: "Test Name 1",
        description: "Test description 1",
        quarterYYYYQ: "20222",
        user: undefined,
      });
      axiosMock.onPut("/api/PersonalSchedules/admin").reply(200, {
        id: "17",
        quarterYYYYQ: "20224",
        name: "PSTAT120A",
        description: "The best class",
      });
    };

    const queryClient = new QueryClient();
    test("renders without crashing USER", () => {
      setupUserOnly();
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalScheduleEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );
    });

    test("renders without crashing ADMIN", () => {
      setupAdminUser();
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalScheduleEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );
    });

    test("Is populated with the data provided for user", async () => {
      setupUserOnly();
      const { getByTestId } = render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalScheduleEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      const idField = getByTestId("PersonalScheduleForm-id");
      const nameField = getByTestId("PersonalScheduleForm-name");
      const descriptionField = getByTestId("PersonalScheduleForm-description");
      const quarterField = document.querySelector("#PersonalScheduleForm-quarter");
      const submitButton = getByTestId("PersonalScheduleForm-submit");

      expect(idField).toHaveValue("17");
      expect(quarterField).toHaveValue("20222");
      expect(nameField).toHaveValue("Test Name 1");
      expect(descriptionField).toHaveValue("Test description 1");
    });

    test("Changes when you click Update user", async () => {
      setupUserOnly();
      const { getByTestId } = render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalScheduleEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      const idField = getByTestId("PersonalScheduleForm-id");
      const nameField = getByTestId("PersonalScheduleForm-name");
      const descriptionField = getByTestId("PersonalScheduleForm-description");
      const quarterField = document.querySelector("#PersonalScheduleForm-quarter");
      const submitButton = getByTestId("PersonalScheduleForm-submit");

      expect(idField).toHaveValue("17");
      expect(quarterField).toHaveValue("20222");
      expect(nameField).toHaveValue("Test Name 1");
      expect(descriptionField).toHaveValue("Test description 1");

      expect(submitButton).toBeInTheDocument();

      userEvent.selectOptions(quarterField, '20223');
      fireEvent.change(nameField, { target: { value: "PSTAT120A" } });
      fireEvent.change(descriptionField, { target: { value: "The best class" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled);
      expect(mockToast).toBeCalledWith("PersonalSchedule Updated - id: 17 name: PSTAT120A");
      expect(mockNavigate).toBeCalledWith({ to: "/personalschedule/list" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          name: "PSTAT120A",
          description: "The best class",
          quarterYYYYQ: "20223",
        })
      ); // posted object
    });

    test("Changes when you click Update Admin", async () => {
      setupAdminUser();

      const { getByTestId } = render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalScheduleEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      const idField = getByTestId("PersonalScheduleForm-id");
      const nameField = getByTestId("PersonalScheduleForm-name");
      const descriptionField = getByTestId("PersonalScheduleForm-description");
      const quarterField = document.querySelector("#PersonalScheduleForm-quarter");
      const submitButton = getByTestId("PersonalScheduleForm-submit");

      expect(idField).toHaveValue("17");
      expect(quarterField).toHaveValue("20222");
      expect(nameField).toHaveValue("Test Name 1");
      expect(descriptionField).toHaveValue("Test description 1");

      expect(submitButton).toBeInTheDocument();

      fireEvent.change(quarterField, { target: { value: "20223" } });
      fireEvent.change(nameField, { target: { value: "PSTAT120A" } });
      fireEvent.change(descriptionField, { target: { value: "The best class" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled);
      expect(mockToast).toBeCalledWith("PersonalSchedule Updated - id: 17 name: PSTAT120A");
      expect(mockNavigate).toBeCalledWith({ to: "/personalschedule/list" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          name: "PSTAT120A",
          description: "The best class",
          quarterYYYYQ: "20223",
        })
      ); // posted object
    });
  });
});
