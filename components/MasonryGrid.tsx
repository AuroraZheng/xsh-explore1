import Masonry from "react-masonry-css";
import Card from "./Card";

const MasonryGrid = ({ posts }: { posts: any[] }) => {
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
        <Card key={post.id} post={post} />
      ))}
    </Masonry>
  );
};

export default MasonryGrid;
