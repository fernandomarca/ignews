import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";
import { mocked } from "ts-jest/utils";
import { SignInButton } from ".";

jest.mock("next-auth/client");

describe("SignInButton component", () => {
  it("Button correctly renders user is not authenticated", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    const { debug } = render(<SignInButton />);
    expect(screen.getByText("SignIn in Github")).toBeInTheDocument();
    expect(screen.getByText("SignIn in Github")).toHaveClass("signInButton");
    expect(screen.getByText("SignIn in Github")).toHaveProperty(
      "type",
      "button"
    );

    expect(
      screen.getByText("SignIn in Github").getElementsByTagName("svg")
        .length === 1
    );
  });

  it("Button correctly renders when user is authenticated", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: "John Doe",
          email: "john.doe@example.com",
          image: "johnUrlImage",
        },
        expires: "fake-expires",
      },
      false,
    ]);

    render(<SignInButton />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toHaveClass("signInButton");
    expect(screen.getByText("John Doe")).toHaveProperty("type", "button");
    expect(
      screen.getByText("John Doe").getElementsByTagName("svg").length === 2
    );
  });
});
