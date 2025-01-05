"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetcher } from "../utils/api";

type Post = {
  _id: string;
  title: string;
  shortDescription: string;
  image: string;
};

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // Add loading state
  const postsPerPage = 6;

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true); // Start loading
      try {
        const data = await fetcher(`/posts?page=${currentPage}&limit=${postsPerPage}`);
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Failed to load posts:", error);
        setPosts([]);
        setTotalPages(1);
      } finally {
        setLoading(false); // End loading
      }
    };
    loadPosts();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link href="/manage-posts">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Manage Posts
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center">
            <p className="text-gray-500">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post._id} href={`/post/${post._id}`}>
              <div className="border rounded-lg shadow p-4">
                <img
                  src={
                    post.image
                      ? `http://localhost:5000${post.image}` 
                      : '/images/dummyimage.png' 
                  }
                  alt={post.title || 'Default Image'}
                  className="w-full h-40 object-cover rounded"
                />
                <h2 className="text-xl font-bold mt-2">{post.title}</h2>
                <p className="text-gray-600">{post.shortDescription}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center">
            <p className="text-gray-500">No posts available at the moment.</p>
            <img
              src="https://via.placeholder.com/400x300?text=No+Posts"
              alt="No posts"
              className="mx-auto my-4"
            />
          </div>
        )}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="bg-gray-300 px-4 py-2 rounded mr-2"
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="bg-gray-300 px-4 py-2 rounded ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
