import Masonry from "react-masonry-css";
import PostCard, { Post } from "./PostCard";

interface MasonryGridProps {
  posts: Post[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ posts }) => {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto gap-4"
      columnClassName="my-masonry-grid_column"
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Masonry>
  );
};

export default MasonryGrid;
