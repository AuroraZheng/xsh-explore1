import React from "react";

interface PostProps {
  post: {
    image: string;
    title: string;
    username: string;
    avatar: string;
  };
}

export default function PostCard({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden break-words">
      <img src={post.image} alt={post.title} className="w-full object-cover aspect-[3/4] rounded-t-lg" loading="lazy" />
      <div className="p-2">
        <p className="text-sm font-medium line-clamp-2 mb-1">{post.title}</p>
        <div className="flex items-center text-xs text-gray-500">
          <img src={post.avatar} className="w-5 h-5 rounded-full mr-2" />
          <span>{post.username}</span>
          <span className="ml-auto">❤️ {post.likes}</span>
        </div>
      </div>
    </div>
  );
}

