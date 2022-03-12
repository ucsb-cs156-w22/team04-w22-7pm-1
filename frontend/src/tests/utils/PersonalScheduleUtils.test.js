import {
  onDeleteSuccess,
  cellToAxiosParamsDeleteUser,
  cellToAxiosParamsDeleteAdmin,
  editCallback,
} from "main/utils/PersonalScheduleUtils";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("PersonalScheduleUtils", () => {
  describe("onDeleteSuccess", () => {
    test("It puts the message on console.log and in a toast", () => {
      // arrange
      const restoreConsole = mockConsole();
      // act
      onDeleteSuccess("abc");
      // assert
      expect(mockToast).toHaveBeenCalledWith("abc");
      expect(console.log).toHaveBeenCalled();
      const message = console.log.mock.calls[0][0];
      expect(message).toMatch("abc");

      restoreConsole();
    });
  });
  describe("cellToAxiosParamsDeleteUser", () => {
    test("It returns the correct params", () => {
      // arrange
      const cell = { row: { values: { id: 99 } } };

      // act
      const result = cellToAxiosParamsDeleteUser(cell);

      // assert
      expect(result).toEqual({
        url: "/api/PersonalSchedules/",
        method: "DELETE",
        params: { id: 99 },
      });
    });
  });

  describe("cellToAxiosParamsDeleteAdmin", () => {
    test("It returns the correct params", () => {
      // arrange
      const cell = { row: { values: { id: 99 } } };

      // act
      const result = cellToAxiosParamsDeleteAdmin(cell);

      // assert
      expect(result).toEqual({
        url: "/api/PersonalSchedules/admin",
        method: "DELETE",
        params: { id: 99 },
      });
    });
  });
});
