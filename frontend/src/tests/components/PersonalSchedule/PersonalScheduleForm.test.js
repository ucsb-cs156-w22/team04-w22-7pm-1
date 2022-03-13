import {
  render,
  waitFor,
  fireEvent,
  queryByText,
} from '@testing-library/react';
import PersonalScheduleForm from 'main/components/PersonalSchedule/PersonalScheduleForm';
import SingleQuarterDropdown from 'main/components/Quarters/SingleQuarterDropdown';
import { quarterRange } from 'main/utils/quarterUtilities';
import { personalSchedulesFixtures } from 'fixtures/personalSchedulesFixtures';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('PersonalScheduleForm tests', () => {
  test('renders work correctly ', async () => {
    const { getByText } = render(
      <Router>
        <PersonalScheduleForm />
      </Router>
    );
    await waitFor(() => expect(getByText(/Name/)).toBeInTheDocument());
    await waitFor(() => expect(getByText(/Description/)).toBeInTheDocument());
    await waitFor(() => expect(getByText(/Create/)).toBeInTheDocument());
  });

  const quarter = jest.fn();
  const setQuarter = jest.fn();
  test('The Dropdown is able to reassign values and operates', async () => {
    const { getByLabelText } = render(
      <SingleQuarterDropdown
        quarter={quarter}
        setQuarter={setQuarter}
        controlId={'quarterYYYYQ'}
        quarters={quarterRange('20221', '20224')}
      />
    );
    await waitFor(() => expect(getByLabelText('Quarter')).toBeInTheDocument);
    const selectQuarter = getByLabelText('Quarter');
    userEvent.selectOptions(selectQuarter, '20222');
    expect(setQuarter).toBeCalledWith('20222');
  });

  test('renders correctly when passing in a PersonalSchedule ', async () => {
    const { getByText, getByTestId } = render(
      <Router>
        <PersonalScheduleForm
          initialPersonalSchedule={personalSchedulesFixtures.oneSchedule}
        />
      </Router>
    );
    await waitFor(() =>
      expect(getByTestId(/PersonalScheduleForm-id/)).toBeInTheDocument()
    );
    expect(getByText(/Id/)).toBeInTheDocument();
    expect(getByTestId(/PersonalScheduleForm-id/)).toHaveValue('1');
  });

  test('Correct Error messsages on missing input', async () => {
    const { getByTestId, getByText } = render(
      <Router>
        <PersonalScheduleForm />
      </Router>
    );
    await waitFor(() =>
      expect(getByTestId('PersonalScheduleForm-submit')).toBeInTheDocument()
    );
    const submitButton = getByTestId('PersonalScheduleForm-submit');

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(getByText(/Name is required./)).toBeInTheDocument()
    );
  });

  test('No Error messsages on good input', async () => {
    const mockSubmitAction = jest.fn();

    const { getByTestId, queryByText } = render(
      <Router>
        <PersonalScheduleForm submitAction={mockSubmitAction} />
      </Router>
    );
    await waitFor(() =>
      expect(getByTestId('PersonalScheduleForm-name')).toBeInTheDocument()
    );

    const nameField = getByTestId('PersonalScheduleForm-name');
    const descriptionField = getByTestId('PersonalScheduleForm-description');
    const quarterField = document.querySelector('#PersonalScheduleForm-quarter');
    const submitButton = getByTestId('PersonalScheduleForm-submit');

    fireEvent.change(quarterField, { target: { value: '20221' } });
    fireEvent.change(nameField, { target: { value: 'CS154' } });
    fireEvent.change(descriptionField, {
      target: { value: 'Test description 1' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      queryByText(/Name is required/)
    ).not.toBeInTheDocument();
  });

  test('Test that navigate(-1) is called when Cancel is clicked', async () => {
    const { getByTestId } = render(
      <Router>
        <PersonalScheduleForm />
      </Router>
    );
    await waitFor(() =>
      expect(getByTestId('PersonalScheduleForm-cancel')).toBeInTheDocument()
    );
    const cancelButton = getByTestId('PersonalScheduleForm-cancel');

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
