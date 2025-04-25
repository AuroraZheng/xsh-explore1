import { useEffect, useState } from "react";
import MasonryGrid from "../components/MasonryGrid";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/data/posts.json")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <main className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">发现 · Explore</h1>
      <MasonryGrid posts={posts} />
    </main>
  );
}
