import { MessageSquare, Settings, Info } from "lucide-react";
import useUserStore from "../stores/useUserStore.js";

export default function Sidebar({
  showInfo,
  setShowInfo,
  isOpen,
  setIsOpen,
  showChats,
  setShowChats,
}) {
  const { user, logout } = useUserStore();

  return (
    <div
      className={`fixed top-30 left-0shadow-lg transform transition-transform duration-300 z-40
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static`}
    >
      <aside className="w-20 backdrop-blur-md bg-white/50 border-r border-gray-200/50 flex flex-col items-center py-6 space-y-4">
        {/* Info Toggle Button */}
        <div className="relative group">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-3 rounded-xl transition-all duration-300 ${
              showInfo
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg scale-105"
                : "bg-white hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md"
            }`}
          >
            <Info size={20} />
          </button>
          <span className="absolute left-20 top-3 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-all bg-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10">
            {showInfo ? "Hide Info" : "Show Info"}
          </span>
        </div>

        {/* Chat List Toggle Button */}
        {user && (
          <div className="relative group">
            <button
              onClick={() => {
                setShowChats(!showChats);
                setIsOpen(false); // Close sidebar on mobile after selection
              }}
              className={`p-3 rounded-xl transition-all duration-300 ${
                showChats
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg scale-105"
                  : "bg-white hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md"
              }`}
            >
              <MessageSquare size={20} />
            </button>
            <span className="absolute left-20 top-3 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-all bg-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10">
              {showChats ? "Hide Chats" : "Show Chats"}
            </span>
          </div>
        )}

        {/* Settings Button */}
        <div className="relative group">
          <button className="p-3 rounded-xl bg-white hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md transition-all">
            <Settings size={20} />
          </button>
          <span className="absolute left-20 top-3 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-all bg-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10">
            Settings
          </span>
        </div>
      </aside>
    </div>
  );
}
