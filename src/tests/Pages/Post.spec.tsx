import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/client";
import { mocked } from "ts-jest/utils";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  slug: "my-new-post",
  title: "My new Post",
  updatedAt: "10 de abril de 21",
  content: "<p>my content</p>",
};

jest.mock("next-auth/client");
jest.mock("../../services/prismic");

describe("Posts page", () => {
  it("renders correctly", () => {
    render(<Post post={post} />);
    expect(screen.getByText("My new Post")).toBeInTheDocument();
    expect(screen.getByText("10 de abril de 21")).toBeInTheDocument();
    expect(screen.getByText("my content")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce(null);
    const response = await getServerSideProps({
      req: {
        cookies: {},
      },
      params: { slug: "my-new-post" },
    } as any);
    //console.log(response);
    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: `/`,
          permanent: false,
        },
      })
    );
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

    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-Subscription",
    } as any);

    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);
    //console.log(response);
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post,
        },
      })
    );
  });
});
