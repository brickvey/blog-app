"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetcher } from "@/utils/api";

type Post = {
  _id: string;
  title: string;
  description: string;
  image: string;
};

const ManagePosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await fetcher("/posts");
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Failed to load posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleSelectPost = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedPosts) {
        await fetcher(`/posts/${id}`, { method: "DELETE" });
      }
      setPosts((prev) => prev.filter((post) => !selectedPosts.includes(post._id)));
      setSelectedPosts([]);
    } catch (error) {
      console.error("Failed to delete posts:", error);
    }
  };

  if (loading)
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-gray-600">Loading posts...</p>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Manage Posts</h1>
        <div className="flex gap-4">
          <Link href="/">
            <button className="bg-gray-500 text-white px-4 py-2 rounded">
              Go to Home
            </button>
          </Link>
          <button
            onClick={handleDeleteSelected}
            disabled={!selectedPosts.length}
            className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-red-300"
          >
            Delete Selected
          </button>
          <Link href="/add-post">
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Add Post
            </button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className={`border rounded-lg shadow p-4 ${selectedPosts.includes(post._id) ? "ring-2 ring-blue-500" : ""
                }`}
            >
              <img
                src={
                  post.image
                    ? post.image
                    : '/images/dummyimage.png'
                }
                alt={post.title}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-xl font-bold mt-2">{post.title}</h2>
              <p className="text-gray-600">{post.description}</p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleSelectPost(post._id)}
                  className={`px-2 py-1 text-sm rounded ${selectedPosts.includes(post._id)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                  {selectedPosts.includes(post._id) ? "Unselect" : "Select"}
                </button>
                <Link href={`/edit-post/${post._id}`}>
                  <button className="bg-blue-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center">
            <p className="text-gray-500">No posts available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePosts;

