import React from "react";

async function fetchPost(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  return res.json();
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = await params; 

  const post = await fetchPost(id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <img
        src={post.image || "/images/dummyimage.png"}
        alt={post.title}
        className="w-full h-80 object-cover rounded mb-4"
      />
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
