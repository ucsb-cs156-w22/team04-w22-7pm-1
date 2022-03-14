import React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";



jest.mock("react-toastify", () => ({
	toast: jest.fn(),
}));

describe("BasicCourseSearchForm tests", () => {


	test("renders without crashing", () => {
		render(<BasicCourseSearchForm />);
	});

	test("when I select a quarter, the state for quarter changes", () => {
		const { getByLabelText } = render(<BasicCourseSearchForm />);
		const selectQuarter = getByLabelText("Quarter");
		userEvent.selectOptions(selectQuarter, "20204");
		expect(selectQuarter.value).toBe("20204");
	});

	test("when I select a subject, the state for subject changes", () => {
		const { getByLabelText } = render(<BasicCourseSearchForm />);
		const selectSubject = getByLabelText("Subject");
		userEvent.selectOptions(selectSubject, "MATH");
		expect(selectSubject.value).toBe("MATH");
	});

	test("when I select a level, the state for level changes", () => {
		const { getByTestId } = render(<BasicCourseSearchForm />);
		const selectLevel = getByTestId("level-dropdown");
        // const selectLevel = getByLabelText("CourseLevel");
		userEvent.selectOptions(selectLevel, "G");
		expect(selectLevel.value).toBe("G");
	});

	test("when I click search, the right stuff happens", async () => {
		const sampleReturnValue = {
			sampleKey: "sampleValue",
		};


		const setCourseJSONSpy = jest.fn();
		const fetchJSONSpy = jest.fn();

		fetchJSONSpy.mockResolvedValue(sampleReturnValue);

		const { getByText, getByLabelText, getByTestId } = render(
			<BasicCourseSearchForm
				setCourseJSON={setCourseJSONSpy}
				fetchJSON={fetchJSONSpy}
			/>
		);

		const expectedFields = {
			quarter: "20204",
			subject: "MATH",
			level: "G",
		};

		const selectQuarter = getByLabelText("Quarter");
		userEvent.selectOptions(selectQuarter, "20204");
		const selectSubject = getByLabelText("Subject");
		userEvent.selectOptions(selectSubject, "MATH");
		const selectLevel = getByTestId("level-dropdown");
		userEvent.selectOptions(selectLevel, "G");

		const submitButton = getByText("Search");
		userEvent.click(submitButton);
		await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

		// assert that ourSpy was called with the right value

		expect(fetchJSONSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expectedFields
		);
	});

	test("when I click submit when JSON is EMPTY, setCourse is not called!", async () => {
		const sampleReturnValue = {
			sampleKey: "sampleValue",
			total: 0,
		};

		const setCourseJSONSpy = jest.fn();
		const fetchJSONSpy = jest.fn();

		fetchJSONSpy.mockResolvedValue(sampleReturnValue);

		const { getByText, getByLabelText, getByTestId} = render(
			<BasicCourseSearchForm
				setCourseJSON={setCourseJSONSpy}
				fetchJSON={fetchJSONSpy}
			/>
		);

		const selectQuarter = getByLabelText("Quarter");
		userEvent.selectOptions(selectQuarter, "20204");
		const selectSubject = getByLabelText("Subject");
		userEvent.selectOptions(selectSubject, "MATH");
		const selectLevel = getByTestId("level-dropdown");
		userEvent.selectOptions(selectLevel, "G");

		const submitButton = getByText("Search");
		userEvent.click(submitButton);

		await waitFor(() => expect(setCourseJSONSpy).toHaveBeenCalledTimes(0));
	});


});