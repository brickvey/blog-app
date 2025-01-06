"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Use useParams for dynamic route parameters
import { fetcher } from "@/utils/api";

type Post = {
  _id: string;
  title: string;
  description: string;
  image: string;
  content: string;
};

const EditPost: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const router = useRouter();
  const params = useParams(); 
  const id = params?.id; 

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      try {
        const data = await fetcher(`/posts/${id}`);
        setPost(data);
        setTitle(data.title);
        setDescription(data.description);
        setContent(data.content);
      } catch (error) {
        console.error("Failed to load post:", error);
      }
    };
    loadPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);

    if (image) {
      formData.append("image", image); 
    }

    try {
      await fetcher(`/posts/${id}`, {
        method: "PATCH",
        body: formData,
      });
      router.push("/manage-posts");
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto"
      >
        <div>
          <label className="block mb-2 text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            rows={5}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              setImage(selectedFile || null);
            }}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          {post.image && (
            <img
              src={post.image || "/images/dummyimage.png"}
              alt={post.title}
              className="w-full h-40 object-cover rounded mt-4"
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
