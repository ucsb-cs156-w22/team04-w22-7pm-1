import { render, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import LoadSubjectsPage from 'main/pages/LoadSubjectsPage';
import loadsubjectsFixtures from 'fixtures/loadsubjectsFixtures';
import { apiCurrentUserFixtures } from 'fixtures/currentUserFixtures';
import { systemInfoFixtures } from 'fixtures/systemInfoFixtures';
import mockConsole from 'jest-mock-console';

import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
  const originalModule = jest.requireActual('react-toastify');
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe('LoadSubjectsPage tests', () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const testId = 'UCSBSubjectsTable';

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet('/api/currentUser')
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet('/api/systemInfo')
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test('renders without crashing on three subjects', async () => {
    const queryClient = new QueryClient();
    axiosMock
      .onGet('/api/admin/UCSBSubjects/all')
      .reply(200, loadsubjectsFixtures.threeSubjects);

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LoadSubjectsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => expect(getByText('Load Subjects')).toBeInTheDocument());
  });

  test('renders empty table when backend unavailable', async () => {
    const queryClient = new QueryClient();
    axiosMock.onGet('/api/admin/UCSBSubjects/all').timeout();

    const restoreConsole = mockConsole();

    const { queryByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LoadSubjectsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      'Error communicating with backend via GET on /api/admin/UCSBSubjects'
    );
    restoreConsole();

    expect(
      queryByTestId(`${testId}-cell-row-0-col-id`)
    ).not.toBeInTheDocument();
  });

  test('test what happens when you retrieve new subjects', async () => {
    const queryClient = new QueryClient();
    axiosMock
      .onGet('api/admin/UCSBSubjects/all')
      .replyOnce(200, [])
      .onGet('/api/admin/UCSBSubjects/all')
      .reply(200, loadsubjectsFixtures.threeSubjects);
    axiosMock
      .onPost('/api/admin/UCSBSubjects/load')
      .reply(200, loadsubjectsFixtures.threeSubjects);

    const { queryByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LoadSubjectsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(
        queryByTestId(`${testId}-cell-row-0-col-id`)
      ).not.toBeInTheDocument();
    });

    const loadButton = queryByTestId(`subjectsLoad`);
    expect(loadButton).toBeInTheDocument();

    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(queryByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument();
    });

    expect(queryByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent('1');

    await waitFor(() => {
      expect(mockToast).toBeCalledWith('3 subjects loaded');
    });
  });

  test('test what happens when you click button when subjects have been loaded', async () => {
    const queryClient = new QueryClient();
    axiosMock
      .onGet('/api/admin/UCSBSubjects/all')
      .reply(200, loadsubjectsFixtures.threeSubjects);
    axiosMock
      .onPost('/api/admin/UCSBSubjects/load')
      .reply(200, loadsubjectsFixtures.threeSubjects);

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LoadSubjectsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument();
    });

    expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent('1');

    const loadButton = getByTestId(`subjectsLoad`);
    expect(loadButton).toBeInTheDocument();

    fireEvent.click(loadButton);

    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(mockToast).toBeCalledWith('No new subjects were loaded');
    });
  });
});
