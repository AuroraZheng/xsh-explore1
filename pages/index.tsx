import { useEffect, useState, useRef } from "react";
import MasonryGrid from "../components/MasonryGrid";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  useEffect(() => {
    const loadPosts = async () => {
      const res = await fetch(`/data/posts-page-${page}.json`);
      if (!res.ok) {
        setHasMore(false);
        return;
      }
      const data = await res.json();
      setPosts((prev) => [...prev, ...data]);
    };
    loadPosts();
  }, [page]);

  // Intersection Observer 实现无限加载
  useEffect(() => {
    if (!loader.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "100px" }
    );
    observer.observe(loader.current);

    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <main className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">发现 · Explore</h1>
      <MasonryGrid posts={posts} />
      {hasMore && <div ref={loader} className="py-6 text-center text-gray-400">加载中...</div>}
      {!hasMore && <div className="py-6 text-center text-gray-400">没有更多啦~</div>}
    </main>
  );
}

