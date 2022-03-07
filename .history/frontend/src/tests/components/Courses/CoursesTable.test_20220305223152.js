import { fireEvent, render, waitFor } from "@testing-library/react";
import { coursesFixtures } from "fixtures/coureseFixtures";
import CoursesTable from "main/components/Courses/CoursesTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();


  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CoursesTable courses ={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CoursesTable courses ={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = coursesFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CoursesTable courses={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CoursesTable courses={coursesFixtures.oneCourses} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["quarter", "courseId", "title", "description","objLevelCode","subjectArea","unitsFixed"];
    const expectedFields = ["id", "properties.title", "properties.mag", "properties.place","properties.time"];
    const testId = "CoursesTable";

    expectedHeaders.forEach((headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    // expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("621c60d90303313487d98d92");
    // expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("621c60d90303313487d98d93");
   

    // //expect(getByTestId(`${testId}-cell-row-0-col-properties.title`)).toHaveTextContent("M 1.12 - 7km W of Isla Vista, CA");
    // expect(getByTestId(`${testId}-cell-row-1-col-properties.title`)).toHaveTextContent("M 2.36 - 1km NW of Goleta, CA");

    // expect(getByTestId(`${testId}-cell-row-0-col-properties.mag`)).toHaveTextContent("1.12");
    // expect(getByTestId(`${testId}-cell-row-1-col-properties.mag`)).toHaveTextContent("2.36");

    // expect(getByTestId(`${testId}-cell-row-0-col-properties.palce`)).toHaveTextContent("10km ESE of Ojai, CA");
    // expect(getByTestId(`${testId}-cell-row-1-col-properties.place`)).toHaveTextContent("1km NW of Goleta, CA");

    // expect(getByTestId(`${testId}-cell-row-0-col-properties.time`)).toHaveTextContent("1644571919000");
    // expect(getByTestId(`${testId}-cell-row-1-col-properties.time`)).toHaveTextContent("11643479604200");



  });

});


