import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Async } from "./index";
test("it renders correctly", async () => {
  render(<Async />);
  expect(screen.getByText("hello world")).toBeInTheDocument();
  //expect(await screen.findByText("Button")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText("Button")).toBeInTheDocument();
  });
});

test("it Button 2 is removed", async () => {
  render(<Async />);
  expect(screen.getByText("hello world")).toBeInTheDocument();

  // await waitFor(() => {
  //   expect(screen.queryByText("Button 2")).not.toBeInTheDocument();
  // });

  await waitForElementToBeRemoved(screen.queryByText("Button 2"), {
    timeout: 2000,
  });
});
