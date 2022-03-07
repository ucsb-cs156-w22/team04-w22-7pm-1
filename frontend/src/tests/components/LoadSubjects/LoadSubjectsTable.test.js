import { render } from "@testing-library/react";
import loadsubjectsFixtures from "fixtures/loadsubjectsFixtures";
import LoadSubjectsTable from "main/components/LoadSubjects/LoadSubjectsTable"


describe("LoadSubjectsTable tests", () => {

    test("renders without crashing for empty table", () => {
        render(
            <LoadSubjectsTable subjects={[]} />
        );
    });

    test("renders without crashing for three subjects", () => {
        render(
            <LoadSubjectsTable subjects={loadsubjectsFixtures.threeSubjects} />
        );
    });

    test("Has the expected column headers and content", () => {
        const { getByText, getByTestId } = render(
          <LoadSubjectsTable subjects={loadsubjectsFixtures.threeSubjects}/>
        );
    
        const expectedHeaders = ["id", "SubjectCode", "SubjectTranslation", "DeptCode", "CollegeCode", "RelatedDeptCode", "Inactive"];
        const expectedFields = ["id", "subjectCode", "subjectTranslation", "deptCode", "collegeCode", "relatedDeptCode", "inactive"];
        const testId = "LoadSubjectsTable";

        expectedHeaders.forEach( (headerText)=> {
            const header = getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach( (field)=> {
          const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
          expect(header).toBeInTheDocument();
        });

        expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(getByTestId(`${testId}-cell-row-0-col-subjectCode`)).toHaveTextContent("PHIL");
        expect(getByTestId(`${testId}-cell-row-0-col-inactive`)).toHaveTextContent("true");
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${testId}-cell-row-1-col-subjectCode`)).toHaveTextContent("CMPSC");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
        expect(getByTestId(`${testId}-cell-row-2-col-subjectCode`)).toHaveTextContent("ANTH");
      });
});

