import React from "react";

interface PostProps {
  post: {
    image: string;
    title: string;
    username: string;
    avatar: string;
  };
}

const Card: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <img src={post.image} alt={post.title} className="w-full object-cover" loading="lazy" />
      <div className="p-2">
        <h2 className="text-sm font-semibold mb-1">{post.title}</h2>
        <div className="flex items-center text-xs text-gray-500">
          <img src={post.avatar} alt="avatar" className="w-5 h-5 rounded-full mr-1" />
          {post.username}
        </div>
      </div>
    </div>
  );
};

export default Card;
