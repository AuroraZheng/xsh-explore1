import { useEffect, useState, useRef } from "react";
import { Post } from "../components/PostCard";
import MasonryGrid from "../components/MasonryGrid";

const tabs = ["推荐", "穿搭", "美食", "彩妆", "影视", "情感", "家居", "旅行", "健身"];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch("/data/posts.json");
        if (!res.ok) {
          setHasMore(false);
          return;
        }
        const data: Post[] = await res.json();
        setPosts((prev) => [...prev, ...data]);
      } catch (error) {
        console.error("Error loading posts:", error);
        setHasMore(false);
      }
    };

    loadPosts();
  }, [page]);

  useEffect(() => {
    if (!loader.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry && firstEntry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [hasMore]);

  return (
    <div className="flex min-h-screen bg-white">
      {/* 左侧菜单栏 */}
      <aside className="w-16 fixed h-full border-r border-gray-100 z-10 bg-white">
        <div className="flex flex-col items-center pt-4 space-y-8">
          <div className="text-red-500 font-bold text-sm rotate-90 mt-4 tracking-wider">小红书</div>
          <nav className="flex flex-col items-center space-y-6 w-full">
            {[
              { label: "发现", icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> },
              { label: "发布", icon: <>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </> },
              { label: "通知", icon: <>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </> },
              { label: "登录", icon: <>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </> },
              { label: "更多", icon: <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </> },
            ].map(({ label, icon }, i) => (
              <button key={i} className="flex flex-col items-center w-full py-2">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {icon}
                  </svg>
                </div>
                <span className="text-xs mt-1">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 ml-16">
        {/* 顶部搜索栏 */}
        <div className="sticky top-0 z-10 bg-white p-3 border-b border-gray-100">
          <div className="relative w-full max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="搜索"
              className="w-full py-2 pl-8 pr-4 text-sm border rounded-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-300"
            />
            <svg 
               viewBox="0 0 24 24" 
               className="w-4 h-4" // 关键！Tailwind类或直接style
               fill="none" 
               stroke="currentColor"
             >
               <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 顶部 Tabs */}
        <div className="sticky top-[68px] z-10 bg-white border-b border-gray-100">
          <div className="flex overflow-x-auto scrollbar-hide px-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-3 text-sm whitespace-nowrap ${tab === "推荐" ? "text-red-500 border-b-2 border-red-500" : "text-gray-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Post 瀑布流布局 */}
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 p-4">
          {posts.map((post) => (
            <div key={post.id} className="mb-2 break-inside-avoid rounded-md overflow-hidden bg-white border border-gray-100 shadow-sm">
              <img
                src={post.image}
                alt={post.title}
                className="w-full aspect-[3/4] object-cover"
                loading="lazy"
              />
              <div className="p-2">
                <p className="text-xs font-medium line-clamp-2 mb-1">{post.title}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <img src={post.avatar} alt={post.username} className="w-4 h-4 rounded-full mr-1" />
                  <span className="truncate flex-1">{post.username}</span>
                  <span className="flex items-center ml-1">
                    <svg className="w-3 h-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    {post.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4">
          <MasonryGrid posts={posts} />
        </div>

        {/* 加载状态 */}
        {hasMore ? (
          <div ref={loader} className="py-4 text-center text-xs text-gray-400">
            加载中...
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-gray-400">没有更多啦~</div>
        )}
      </main>
    </div>
  );
}
