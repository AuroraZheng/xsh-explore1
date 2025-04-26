import { Heart } from "lucide-react";

export interface Post {
  id: number;
  image: string;
  title: string;
  avatar: string;
  username: string;
  likes: number;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-[3/4]">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
          style={{ borderRadius: '1rem' }}
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h2 className="text-[10px] font-medium line-clamp-2 mb-3">{post.title}</h2>
        <div className="flex items-center text-[10px] text-gray-500">
          <img 
            src={post.avatar} 
            alt={post.username} 
            className="w-[10px] h-[10px] rounded-full mr-1"
          />
          <span className="truncate flex-1">{post.username}</span>
          <span className="flex items-center ml-1">
            <Heart className="w-[10px] h-[10px] mr-0.5" fill="currentColor" />
            {post.likes}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;



