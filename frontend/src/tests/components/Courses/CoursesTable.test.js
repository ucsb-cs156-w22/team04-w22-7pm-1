import { fireEvent, render, waitFor } from "@testing-library/react";
import { coursesFixtures } from "fixtures/coursesFixtures";
import CoursesTable from "main/components/Courses/CoursesTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("CoursesTable tests", () => {
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
    const expectedFields = ["quarter", "courseId", "title", "description","objLevelCode","subjectArea","unitsFixed"];
    const testId = "CoursesTable";

    expectedHeaders.forEach((headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });


  });
  test("Has the expected colum headers and content for adminUser with longer text", () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, queryByText,getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CoursesTable courses={coursesFixtures.oneCoursesLongDescription} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["quarter", "courseId", "title", "description","objLevelCode","subjectArea","unitsFixed"];
    const expectedFields = ["quarter", "courseId", "title", "description","objLevelCode","subjectArea","unitsFixed"];
    const testId = "CoursesTable";

    expectedHeaders.forEach((headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
      
    });
    const description = queryByText(coursesFixtures.oneCoursesLongDescription[0].description);
    expect(description).not.toBeInTheDocument();
    const descriptionShort = getByText(coursesFixtures.oneCoursesLongDescription[0].description.substr(0,150));
    expect(descriptionShort).toBeInTheDocument();
  });

});


