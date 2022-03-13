import { fireEvent, render, waitFor } from "@testing-library/react";
import { personalSchedulesFixtures } from "fixtures/personalSchedulesFixtures";
import PersonalScheduleTable from "main/components/PersonalSchedule/PersonalScheduleTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();

const mockedMutate = jest.fn();

jest.mock("main/utils/useBackend", () => ({
  ...jest.requireActual("main/utils/useBackend"),
  useBackendMutation: () => ({ mutate: mockedMutate }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalScheduleTable schedules={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });
  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalScheduleTable schedules={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalScheduleTable schedules={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("Has the expected colum headers and content for adminUser", () => {
    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalScheduleTable
            schedules={personalSchedulesFixtures.threeSchedules}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const expectedHeaders = ["id", "User", "Name", "Description", "Quarter (YYYYQ)"];
    const expectedFields = ["id", "user.fullName", "name", "description", "quarterYYYYQ"];
    const testId = "PersonalScheduleTable";

    expectedHeaders.forEach((headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

    const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Edit button navigates to the edit page for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalScheduleTable
            schedules={personalSchedulesFixtures.threeSchedules}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByTestId(`PersonalScheduleTable-cell-row-0-col-id`)).toHaveTextContent("1");
    });

    const editButton = getByTestId(`PersonalScheduleTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith("/personalschedule/edit/1"));
  });

  test("Delete button calls the delete call back", async () => {
    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalScheduleTable
            schedules={personalSchedulesFixtures.threeSchedules}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByTestId(`PersonalScheduleTable-cell-row-0-col-id`)).toHaveTextContent("1");
    });

    const deleteButton = getByTestId(`PersonalScheduleTable-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => expect(mockedMutate).toHaveBeenCalledTimes(1));
  });
});
