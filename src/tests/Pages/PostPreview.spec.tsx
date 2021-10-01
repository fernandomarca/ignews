import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { mocked } from "ts-jest/utils";
import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  slug: "my-new-post",
  title: "My new Post",
  updatedAt: "10 de abril de 21",
  content: "<p>my content</p>",
};

jest.mock("next-auth/client");
jest.mock("../../services/prismic");
jest.mock("next/router");

describe("Posts preview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);
    render(<PostPreview post={post} />);
    expect(screen.getByText("My new Post")).toBeInTheDocument();
    expect(screen.getByText("10 de abril de 21")).toBeInTheDocument();
    expect(screen.getByText("my content")).toBeInTheDocument();
    expect(screen.getByText("Wanna Continue reading?")).toBeInTheDocument();
  });

  it("redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: "fake-active-Subscription" },
      false,
    ] as any);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();
    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<PostPreview post={post} />);
    expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "My new Post" }],
          content: [{ type: "paragraph", text: "my content" }],
        },
        last_publication_date: "04-10-21",
      }),
    } as any);

    const response = await getStaticProps({
      params: { slug: "my-new-post" },
    } as any);
    //console.log(response);
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "My new Post",
            updatedAt: "10 de abril de 21",
            content: "<p>my content</p>",
          },
        },
      })
    );
  });
});
