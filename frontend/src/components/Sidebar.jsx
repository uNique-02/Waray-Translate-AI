import { useEffect, useState } from "react";
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
  const { user } = useUserStore();
  const [activeTools, setActiveTools] = useState({
    info: showInfo,
    chats: showChats,
    settings: false,
  });

  useEffect(() => {
    setActiveTools((prev) => ({
      ...prev,
      info: showInfo,
      chats: showChats,
    }));
  }, [showInfo, showChats]);

  // console.log("Sidebar props:", { showChats, setShowChats });

  return (
    <div
      className={`fixed top-30 left-0shadow-lg transform transition-transform duration-300 z-40
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static`}
    >
      <aside className="w-20 backdrop-blur-md bg-transparent flex flex-col items-center py-6 space-y-4">
        {/* Info Toggle Button */}
        <div className="relative group">
          <button
            onClick={() => {
              setShowInfo(!showInfo);
              setActiveTools((prev) => ({
                ...prev,
                info: !showInfo,
              }));
            }}
            className={`p-3 rounded-xl transition-all duration-300 ${
              activeTools.info
                ? "bg-blue-100 text-blue-900 shadow-lg scale-105 ring-2 ring-blue-200"
                : "bg-white hover:bg-slate-100 text-slate-900 shadow-sm hover:shadow-md"
            }`}
          >
            <Info size={20} />
          </button>
          <span className="absolute left-20 top-3 text-xs font-medium text-slate-900 opacity-0 group-hover:opacity-100 transition-all bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200 whitespace-nowrap z-10">
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
                setActiveTools((prev) => ({
                  ...prev,
                  chats: !showChats,
                }));
              }}
              className={`p-3 rounded-xl transition-all duration-300 ${
                activeTools.chats
                  ? "bg-blue-100 text-blue-900 shadow-lg scale-105 ring-2 ring-blue-200"
                  : "bg-white hover:bg-slate-100 text-slate-900 shadow-sm hover:shadow-md"
              }`}
            >
              <MessageSquare size={20} />
            </button>
            <span className="absolute left-20 top-3 text-xs font-medium text-slate-900 opacity-0 group-hover:opacity-100 transition-all bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200 whitespace-nowrap z-10">
              {showChats ? "Hide Chats" : "Show Chats"}
            </span>
          </div>
        )}

        {/* Settings Button */}
        <div className="relative group">
          <button
            onClick={() =>
              setActiveTools((prev) => ({
                ...prev,
                settings: !prev.settings,
              }))
            }
            className={`p-3 rounded-xl transition-all duration-300 ${
              activeTools.settings
                ? "bg-blue-100 text-blue-900 shadow-lg scale-105 ring-2 ring-blue-200"
                : "bg-white hover:bg-slate-100 text-slate-900 shadow-sm hover:shadow-md"
            }`}
          >
            <Settings size={20} />
          </button>
          <span className="absolute left-20 top-3 text-xs font-medium text-slate-900 opacity-0 group-hover:opacity-100 transition-all bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200 whitespace-nowrap z-10">
            Settings
          </span>
        </div>
      </aside>
    </div>
  );
}
