import { fireEvent, render, screen } from "@testing-library/react";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { mocked } from "ts-jest/utils";
import { SubscribeButton } from ".";

jest.mock("next-auth/client");
jest.mock("next/router");

describe("SubscribeButton component", () => {
  it("correctly renders", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);
    render(<SubscribeButton priceId="" />);
    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
    expect(screen.getByText("Subscribe now")).toHaveClass("subscribeButton");
  });
  it("redirects user to sign in when not authenticated", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);
    const signInMocked = mocked(signIn);
    render(<SubscribeButton priceId="" />);
    const subscribeButton = screen.getByText("Subscribe now");
    fireEvent.click(subscribeButton);
    expect(signInMocked).toHaveBeenCalled();
  });

  it("redirects to posts when user already has a subscription", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: "John Doe",
          email: "john.doe@example.com",
          image: "johnUrlImage",
        },
        activeSubscription: "fake-active-subscription",
        expires: "fake-expires",
      },
      false,
    ] as any);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();
    useRouterMocked.mockReturnValue({
      push: pushMock,
    } as any);
    render(<SubscribeButton priceId="" />);
    const subscribeButton = screen.getByText("Subscribe now");
    fireEvent.click(subscribeButton);
    expect(pushMock).toHaveBeenCalledWith("/posts");
  });
});
