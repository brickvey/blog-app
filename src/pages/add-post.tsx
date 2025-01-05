"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { fetcher } from "../utils/api";

const AddPost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedImageUrl = null;
    
    if (image) {
      const formData = new FormData();
      formData.append("file", image); 
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET! 
      );

      try {
        const response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL!, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        uploadedImageUrl = data.secure_url; 
      } catch (error) {
        console.error("Image upload failed:", error);
        return;
      }
    }

    try {
      await fetcher("/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: shortDescription,
          content,
          image: uploadedImageUrl, 
        }),
      });
      router.push("/manage-posts"); 
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Add New Post</h1>
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
          <label className="block mb-2 text-sm font-medium">Short Description</label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Image</label>
          <input
            type="file"
            accept="image/*" // Restrict file types to images
            onChange={(e) => setImage(e.target.files?.[0] || null)} // Update the state with the selected file
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
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
        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
