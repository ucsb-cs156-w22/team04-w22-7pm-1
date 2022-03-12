import { render, waitFor, fireEvent } from "@testing-library/react";
import PersonalScheduleForm from "main/components/PersonalSchedule/PersonalScheduleForm";
import { personalSchedulesFixtures } from "fixtures/personalSchedulesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("PersonalScheduleForm tests", () => {
  test("renders correctly ", async () => {
    const { getByText } = render(
      <Router>
        <PersonalScheduleForm />
      </Router>
    );
    await waitFor(() => expect(getByText(/QuarterYYYYQ/)).toBeInTheDocument());
    await waitFor(() => expect(getByText(/Create/)).toBeInTheDocument());
  });

  test("renders correctly when passing in a PersonalSchedule ", async () => {
    const { getByText, getByTestId } = render(
      <Router>
        <PersonalScheduleForm initialPersonalSchedule={personalSchedulesFixtures.oneSchedule} />
      </Router>
    );
    await waitFor(() => expect(getByTestId(/PersonalScheduleForm-id/)).toBeInTheDocument());
    expect(getByText(/Id/)).toBeInTheDocument();
    expect(getByTestId(/PersonalScheduleForm-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    const { getByTestId, getByText } = render(
      <Router>
        <PersonalScheduleForm />
      </Router>
    );
    await waitFor(() => expect(getByTestId("PersonalScheduleForm-quarter")).toBeInTheDocument());
    const nameField = getByTestId("PersonalScheduleForm-name");
    const descriptionField = getByTestId("PersonalScheduleForm-description");
    const quarterYYYYQField = getByTestId("PersonalScheduleForm-quarter");
    const submitButton = getByTestId("PersonalScheduleForm-submit");

    fireEvent.change(quarterYYYYQField, { target: { value: "bad-input" } });
    fireEvent.change(nameField, { target: { value: "Test Name 1" } });
    fireEvent.change(descriptionField, { target: { value: "Test description 1" } });

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(getByText(/QuarterYYYYQ must be in the format YYYYQ/)).toBeInTheDocument()
    );
  });

  test("Correct Error messsages on missing input", async () => {
    const { getByTestId, getByText } = render(
      <Router>
        <PersonalScheduleForm />
      </Router>
    );
    await waitFor(() => expect(getByTestId("PersonalScheduleForm-submit")).toBeInTheDocument());
    const submitButton = getByTestId("PersonalScheduleForm-submit");

    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText(/QuarterYYYYQ is required./)).toBeInTheDocument());
    expect(getByText(/Name is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    const { getByTestId, queryByText } = render(
      <Router>
        <PersonalScheduleForm submitAction={mockSubmitAction} />
      </Router>
    );
    await waitFor(() => expect(getByTestId("PersonalScheduleForm-quarter")).toBeInTheDocument());

    const nameField = getByTestId("PersonalScheduleForm-name");
    const descriptionField = getByTestId("PersonalScheduleForm-description");
    const quarterField = getByTestId("PersonalScheduleForm-quarter");
    const submitButton = getByTestId("PersonalScheduleForm-submit");

    fireEvent.change(quarterField, { target: { value: "20221" } });
    fireEvent.change(nameField, { target: { value: "CS154" } });
    fireEvent.change(descriptionField, { target: { value: "Test description 1" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(queryByText(/QuarterYYYYQ must be in the format YYYYQ/)).not.toBeInTheDocument();
  });

  test("Test that navigate(-1) is called when Cancel is clicked", async () => {
    const { getByTestId } = render(
      <Router>
        <PersonalScheduleForm />
      </Router>
    );
    await waitFor(() => expect(getByTestId("PersonalScheduleForm-cancel")).toBeInTheDocument());
    const cancelButton = getByTestId("PersonalScheduleForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
