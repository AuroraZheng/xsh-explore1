import { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic';
import { Home, PlusCircle, Bell, User, Menu, Search, Heart } from "lucide-react";
import { Post } from "../components/PostCard";

// 1. 动态导入可能引起问题的组件
const MasonryGrid = dynamic(() => import("../components/MasonryGrid"), {
  ssr: false // 禁用SSR
});

const tabs = ["推荐", "穿搭", "美食", "彩妆", "影视", "情感", "家居", "旅行", "健身"];
const POSTS_PER_PAGE = 10;

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
        // Only take the next 10 posts
        const startIndex = (page - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        const newPosts = data.slice(startIndex, endIndex);
        
        if (newPosts.length === 0) {
          setHasMore(false);
          return;
        }
        
        setPosts((prev) => [...prev, ...newPosts]);
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
        <aside className="w-20 fixed h-full border-r border-gray-100 z-10 bg-white" />
        <main className="flex-1 pl-20" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* 左侧菜单栏 */}
      <aside className="w-20 fixed left-0 top-0 h-full border-r border-gray-100 bg-white">
        <div className="flex flex-col items-center pt-4 space-y-8">
          <div className="text-red-500 font-bold text-sm rotate-90 mt-4 tracking-wider">小红书</div>
          <nav className="flex flex-col items-center space-y-6 w-full">
            {navItems.map(({ label, icon: Icon }, i) => (
              <button key={i} className="flex flex-col items-center w-full py-2 hover:bg-gray-50">
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
      <main className="flex-1 pl-20">
        {/* 顶部搜索栏 */}
        <div className="fixed top-0 left-20 right-0 bg-white z-20 border-b border-gray-100">
          <div className="px-4 py-3">
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
          <div className="border-b border-gray-100">
            <div className="flex overflow-x-auto scrollbar-hide px-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-3 text-sm whitespace-nowrap ${
                    tab === "推荐" ? "text-red-500 border-b-2 border-red-500" : "text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Post 网格布局 - 添加顶部边距以避免被固定头部覆盖 */}
        <div className="pt-28 px-4">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-5 gap-2">
              {posts.map((post) => (
                <div key={post.id} className="mb-2">
                  <div className="rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow duration-200">
                    <div className="relative aspect-[3/4]">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2">
                      <h2 className="text-[10px] font-medium line-clamp-2 mb-1">{post.title}</h2>
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
                </div>
              ))}
            </div>
          </div>
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