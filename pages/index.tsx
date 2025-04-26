import { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic';
import { Home, PlusCircle, Bell, User, Menu, Search, Heart } from "lucide-react";
import { Post } from "../components/PostCard";
import PostCard from "../components/PostCard";

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
    <div className="min-h-screen bg-white flex">
      {/* 左侧菜单栏 - 1/6 of the page */}
      <aside className="fixed left-0 top-0 bottom-0 w-1/6 bg-white z-50">
        <div className="h-full flex flex-col">
          {/* 小红书 Logo */}
          <div className="h-16 flex items-center px-4">
            <div 
              className="font-bold tracking-wider px-6 py-3"
              style={{ 
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '1.5rem',
                borderRadius: '1rem'
              }}
            >
              小红书
            </div>
          </div>
          
          {/* 导航菜单 */}
          <nav className="flex flex-col items-start space-y-4 w-full" style={{ paddingTop: '2rem' }}>
            {navItems.slice(0, 3).map(({ label, icon: Icon }, i) => (
              <button 
                key={i} 
                className={`flex items-center w-full py-2.5 px-3 ${
                  i === 0 ? 'bg-red-500 text-white' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${i === 0 ? 'text-white' : 'text-gray-700'}`} />
                </div>
                <span className="text-xs ml-2 font-medium">{label}</span>
              </button>
            ))}
            
            {/* 登录按钮 */}
            <button 
              className="flex items-center w-full py-2.5 px-3"
              style={{ 
                backgroundColor: '#ef4444',
                color: '#ffffff'
              }}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs ml-2 font-medium">登录</span>
            </button>
          </nav>

          {/* 更多按钮 - 固定在底部 */}
          <div className="mt-auto px-4 pb-6" style={{ transform: 'translateY(0px)' }}>
            <button className="flex items-center w-full py-2.5 px-3 hover:bg-gray-50">
              <div className="w-6 h-6 flex items-center justify-center">
                <Menu className="w-4 h-4 text-gray-700" />
              </div>
              <span className="text-xs ml-2 font-medium">更多</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 右侧内容区 */}
      <div className="flex-1 ml-[16.666667%]">
        {/* 顶部搜索栏和标签 */}
        <div className="fixed top-0 right-0 w-[83.333333%] bg-white z-40">
          <div className="px-4 py-3">
            <div className="flex justify-center">
              <div className="relative w-1/3">
                <input
                  type="text"
                  placeholder="搜索"
                  className="w-full py-4 pl-6 pr-12 text-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-300"
                  style={{ 
                    borderWidth: '4px', 
                    borderColor: '#e5e7eb',
                    borderRadius: '1rem'
                  }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* 顶部 Tabs */}
          <div style={{ marginTop: '2rem' }}>
            <div className="flex overflow-x-auto scrollbar-hide px-4">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  className={`px-4 py-3 text-sm whitespace-nowrap hover:text-red-500 transition-colors ${
                    tab === "推荐" ? "text-red-500" : "text-gray-600"
                  } ${index !== 0 ? 'ml-8' : ''}`}
                  style={{ marginRight: index !== tabs.length - 1 ? '2rem' : '0' }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Post 网格布局 */}
        <div className="mt-[120px] px-12 py-8">
          <div className="grid grid-cols-5 gap-12">
            {posts.map((post) => (
              <div key={post.id} className="mb-12">
                <PostCard post={post} />
              </div>
            ))}
          </div>

          {/* 加载状态 */}
          {hasMore ? (
            <div ref={loader} className="py-4 text-center text-xs text-gray-400">
              加载中...
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-gray-400">没有更多啦~</div>
          )}
        </div>
      </div>
    </div>
  );
}