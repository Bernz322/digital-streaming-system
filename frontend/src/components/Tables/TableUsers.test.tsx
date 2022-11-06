import {
  cleanup,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { TableUsers } from "..";
import { renderWithProviders } from "../../utils/test-utils";

describe("Test Table Users Component", () => {
  afterEach(cleanup);
  test("should render all mocked users data", async () => {
    const { store } = renderWithProviders(
      <BrowserRouter>
        <TableUsers />
      </BrowserRouter>
    );

    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    const tableRows = screen.getAllByRole("row");

    // Extra one is from the table head row
    expect(tableRows.length - 1).toEqual(2);
    expect(store.getState().user.users.length).toEqual(2);
  });

  test("should render search input and 'Add User' button", () => {});

  test("should render John Doe in table row after search", () => {});
});
