const tabs = ["推荐", "穿搭", "美食", "彩妆", "影视", "情感", "家居", "旅行", "健身"];
export default function TopTabs() {
  return (
    <div className="sticky top-0 bg-white z-20 px-6 py-3 flex gap-4 overflow-x-auto border-b">
      {tabs.map(tab => (
        <button key={tab} className="text-sm font-semibold whitespace-nowrap">
          {tab}
        </button>
      ))}
    </div>
  );
}
