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
    <div className="rounded-lg overflow-hidden shadow-md bg-white">
      <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="text-sm text-gray-500">@{post.username}</p>
        <p className="text-sm text-gray-700">{post.likes} likes</p>
      </div>
    </div>
  );
};

export default PostCard;



