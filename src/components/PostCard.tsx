import React from "react";
import Image from "next/image";

// Define the type for the props
interface PostCardProps {
  title: string;
  description: string;
  image: string;
}

// Functional component with TypeScript
const PostCard: React.FC<PostCardProps> = ({ title, description, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image
        src={image}
        alt={title}
        width={400}
        height={300}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default PostCard;
