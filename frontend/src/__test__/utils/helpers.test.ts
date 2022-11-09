import { isValidUrl } from "../../utils/helpers";

describe("Test helper functions", () => {
  test("should return true if actor link value is empty", () => {
    const res = isValidUrl("", "actor link");
    expect(res).toBeTruthy();
  });
});
