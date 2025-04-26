
import { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic';
import { Home, PlusCircle, Bell, User, Menu, Search, Heart } from "lucide-react";
import { Post } from "../components/PostCard";

// 1. 动态导入可能引起问题的组件
const MasonryGrid = dynamic(() => import("../components/MasonryGrid"), {
  ssr: false // 禁用SSR
});

const tabs = ["推荐", "穿搭", "美食", "彩妆", "影视", "情感", "家居", "旅行", "健身"];

export default function XHSHome() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isClient, setIsClient] = useState(false); // 2. 添加客户端状态标记
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsClient(true); // 3. 标记已挂载到客户端
  }, []);

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
    if (!loader.current || !hasMore || !isClient) return; // 4. 只在客户端观察

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(loader.current);

    return () => observer.disconnect();
  }, [hasMore, isClient]);

  const navItems = [
    { label: "发现", icon: Home },
    { label: "发布", icon: PlusCircle },
    { label: "通知", icon: Bell },
    { label: "登录", icon: User },
    { label: "更多", icon: Menu },
  ];

  // 5. 只在客户端渲染瀑布流布局
  if (!isClient) {
    return (
      <div className="flex min-h-screen bg-white">
        {/* 仅渲染基本骨架 */}
        <aside className="w-16 fixed h-full border-r border-gray-100 z-10 bg-white" />
        <main className="flex-1 ml-16" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* 左侧菜单栏 */}
      <aside className="w-16 fixed h-full border-r border-gray-100 z-10 bg-white">
        <div className="flex flex-col items-center pt-4 space-y-8">
          <div className="text-red-500 font-bold text-sm rotate-90 mt-4 tracking-wider">小红书</div>
          <nav className="flex flex-col items-center space-y-6 w-full">
            {navItems.map(({ label, icon: Icon }, i) => (
              <button key={i} className="flex flex-col items-center w-full py-2">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gray-700" />
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
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
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
        {/* Post 网格布局 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-4">
          {posts.map((post) => (
            <div key={post.id} className="mb-2 rounded-md overflow-hidden bg-white border border-gray-100 shadow-sm">
              <img
                src={post.image}
                alt={post.title}
                className="w-full aspect-[3/4] object-cover"
                loading="lazy"
              />
              <div className="p-2">
                <p className="text-xs font-medium line-clamp-2 mb-1">{post.title}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <img 
                    src={post.avatar} 
                    alt={post.username} 
                    className="w-3 h-3 rounded-full mr-1" // 调整为与文字相同大小
                  />
                  <span className="truncate flex-1">{post.username}</span>
                  <span className="flex items-center ml-1">
                    <Heart className="w-3 h-3 mr-0.5" fill="currentColor" />
                    {post.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 7. 条件渲染 MasonryGrid */}
        {isClient && <MasonryGrid posts={posts} />}

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