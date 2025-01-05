import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { fetcher } from "../../utils/api";

type Post = {
  _id: string;
  title: string;
  image: string;
  content: string;
};

type Props = {
  post: Post;
};

const BlogPage: React.FC<Props> = ({ post }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <img
        src={
          post.image
            ? `${process.env.NEXT_PUBLIC_API_URL}${post.image}`
            : '/images/dummyimage.png'
        }
        alt={post.title}
        className="w-full h-80 object-cover rounded mb-4"
      />
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const posts = await fetcher("/posts");
    const paths = posts.map((post: { _id: string }) => ({
      params: { id: post._id },
    }));
    return { paths, fallback: "blocking" };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const post = await fetcher(`/posts/${params?.id}`);
    return { props: { post }, revalidate: 10 };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { notFound: true };
  }
};

export default BlogPage;
