export default function Sidebar() {
    return (
      <aside className="w-64 fixed left-0 top-0 h-screen border-r p-4 bg-white z-10">
        <div className="font-bold text-red-500 text-xl mb-6">小红书</div>
        <nav className="space-y-4 text-gray-700">
          <button className="flex items-center space-x-2">🔍 发现</button>
          <button className="flex items-center space-x-2">➕ 发布</button>
          <button className="flex items-center space-x-2">🔔 通知</button>
        </nav>
        <button className="mt-8 bg-red-500 text-white py-2 px-4 rounded-lg w-full">登录</button>
      </aside>
    );
  }
  