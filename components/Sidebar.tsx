export default function Sidebar() {
    return (
      <aside className="w-64 fixed top-0 left-0 h-screen border-r p-4 bg-white z-10">
        <div className="font-bold text-red-500 text-xl mb-6">小红书</div>
        <nav className="space-y-4 text-gray-700">
          <button className="flex items-center space-x-2">🏠 发现</button>
        </nav>
        <nav className="space-y-4 text-gray-700">
        <button className="flex items-center space-x-2">➕ 发布</button>
        </nav>
        <nav className="space-y-4 text-gray-700">
        <button className="flex items-center space-x-2">🔔 通知</button>
        </nav>
        <nav className="space-y-4 text-gray-700">
        <button className="mt-8 bg-red-500 text-white py-2 px-4 rounded-lg w-full">登录</button>
        </nav>
        <button className="mt-4 text-sm text-gray-500">📁 更多菜单栏</button>
      </aside>
    );
  }
  
  
  