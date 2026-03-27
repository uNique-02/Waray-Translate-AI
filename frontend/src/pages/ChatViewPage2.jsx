import { useState, useEffect } from "react";
import {
  MessageSquare,
  Send,
  X,
  MoreVertical,
  Share2,
  Trash2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import InfoSection from "../components/InfoSection";
import useAiStore from "../stores/aiStore";
import useUserStore from "../stores/useUserStore";
import useChatStore from "../stores/chatStore";
import useMessageStore from "../stores/messageStore";
import React from "react";

// ─── Chat Section ────────────────────────────────────────────────────────────

const ChatSection = ({ messageProps, loading }) => {
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageProps, loading]);

  return (
    <div className="flex-1 overflow-y-auto space-y-3 px-2 py-2 min-h-0">
      {messageProps.map((msg, idx) => (
        <React.Fragment key={idx}>
          {/* User query */}
          <div className="flex flex-col items-end animate-slide-up">
            <div className="px-5 py-3 rounded-2xl max-w-md shadow-sm transition-all duration-200 hover:shadow-md bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md">
              <p className="text-sm leading-relaxed">{msg.query}</p>
            </div>
            <span className="text-xs text-gray-400 mt-1.5 px-2">
              {msg.updatedAt}
            </span>
          </div>

          {/* Bot response */}
          {msg.response && (
            <div className="flex flex-col items-start animate-slide-up">
              <div className="px-5 py-3 rounded-2xl max-w-md shadow-sm transition-all duration-200 hover:shadow-md bg-white text-gray-800 rounded-bl-md border border-gray-100">
                <p className="text-sm leading-relaxed">{msg.response}</p>
              </div>
              <span className="text-xs text-gray-400 mt-1.5 px-2">
                {msg.updatedAt}
              </span>
            </div>
          )}
        </React.Fragment>
      ))}

      {loading && (
        <div className="flex items-start space-x-2 animate-fade-in">
          <div className="bg-white rounded-2xl rounded-bl-md px-5 py-3 shadow-sm border border-gray-100">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ChatViewPage({ enableChat = true }) {
  const [showInfo, setShowInfo] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [uiMessages, setUIMessages] = useState([]);
  const [input, setInput] = useState("");

  const { id: urlChatId } = useParams(); // ← source of truth
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const user = useUserStore((state) => state.user);

  const response = useAiStore((state) => state.response);
  const fetchResponse = useAiStore((state) => state.fetchResponse);
  const loading = useAiStore((state) => state.loading);

  const chats = useChatStore((state) => state.chats);
  const currentChat = useChatStore((state) => state.currentChat);
  const fetchChats = useChatStore((state) => state.fetchChats);
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);

  const messages = useMessageStore((s) => s.messages);
  const fetchMessages = useMessageStore((s) => s.fetchMessages);

  // ── Runs every time the URL chat id changes (also on first mount)
  // This is the ONLY place we load chat data — no duplicate effects.
  useEffect(() => {
    if (!user || !urlChatId) return;

    const load = async () => {
      await fetchChats(user._id || user.id);

      // wait for Zustand to update
      const updatedChats = useChatStore.getState().chats;

      const target = updatedChats?.find(
        (c) => (c._id || c.id)?.toString() === urlChatId.toString(),
      );

      if (target) {
        setCurrentChat(target);
      }

      // Fetch messages for this chat id
      await fetchMessages(urlChatId);
    };

    load();
  }, [urlChatId]); // ← re-fires on every navigation to a different chat

  // ── Sync uiMessages whenever the store messages update
  useEffect(() => {
    if (messages && messages.length > 0) {
      setUIMessages(messages);
    } else {
      setUIMessages([]);
    }
  }, [messages]);

  // ── Append bot reply when AI responds
  useEffect(() => {
    if (response) {
      setUIMessages((prev) => [
        ...prev,
        { from: "bot", text: response, time: getCurrentTime() },
      ]);
    }
  }, [response]);

  // ── Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId !== null) setOpenMenuId(null);
    };
    if (openMenuId !== null)
      document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  }

  const handleSend = () => {
    if (!input.trim()) return;
    setUIMessages((prev) => [
      ...prev,
      { from: "user", text: input, time: getCurrentTime() },
    ]);
    fetchResponse(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChatSelect = (chat) => {
    const id = chat._id || chat.id;
    setCurrentChat(chat);
    navigate(`/chats/${id}`); // urlChatId change triggers the load effect
  };

  const handleNewChat = () => {
    setUIMessages([]);
    setShowChats(false);
    navigate("/new");
  };

  const handleMenuToggle = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleShare = (e, chat) => {
    e.stopPropagation();
    setOpenMenuId(null);
    const shareUrl = `${window.location.origin}/chats/${chat._id || chat.id}`;
    if (navigator.share) {
      navigator
        .share({ title: chat.title, url: shareUrl })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => alert("Chat link copied!"));
    }
  };

  const handleDeleteClick = (e, chat) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setChatToDelete(chat);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (chatToDelete) {
      // add your deleteChat(chatToDelete._id) call here
      setShowDeleteConfirm(false);
      setChatToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setChatToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }

        @keyframes slide-in-from-sidebar {
          from { transform: translateX(-80px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        .animate-slide-in { animation: slide-in-from-sidebar 0.3s ease-out forwards; }

        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.4) transparent;
          scroll-behavior: smooth;
        }
        .overflow-y-auto::-webkit-scrollbar       { width: 8px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: transparent; border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: rgba(156,163,175,0.4); border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: rgba(156,163,175,0.6); }
      `}</style>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Delete Chat</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{chatToDelete?.title}"? This
              action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="backdrop-blur-md bg-white/70 border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        <div className="flex">
          <Sidebar
            showInfo={showInfo}
            setShowInfo={setShowInfo}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            showChats={showChats}
            setShowChats={setShowChats}
          />

          {/* Chat History Panel — fixed height, never reflows */}
          {showChats && (
            <div className="w-80 backdrop-blur-md bg-white/95 border-r border-gray-200/50 shadow-xl animate-slide-in sticky top-[80px] h-[calc(100vh-80px)] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200/50 flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-800">
                  Chat History
                </h2>
                <button
                  onClick={() => setShowChats(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable chat list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
                {chats.length > 0 ? (
                  chats.map((chat) => {
                    const chatId = chat._id || chat.id;
                    const isActive =
                      chatId?.toString() === urlChatId?.toString();

                    return (
                      <div key={chatId} className="relative group">
                        <button
                          className={`w-full text-left p-3 pr-10 rounded-lg shadow-sm transition-all border ${
                            isActive
                              ? "bg-indigo-50 border-indigo-300 shadow-indigo-100"
                              : "bg-white hover:bg-gray-50 hover:shadow-md border-gray-200/50"
                          }`}
                          onClick={() => handleChatSelect(chat)}
                        >
                          <p
                            className={`text-sm font-medium truncate ${isActive ? "text-indigo-700" : "text-gray-800"}`}
                          >
                            {chat.title}
                          </p>
                          <p
                            className={`text-xs mt-1 ${isActive ? "text-indigo-400" : "text-gray-500"}`}
                          >
                            {chat.updatedAt}
                          </p>
                        </button>

                        {/* Ellipsis menu */}
                        <button
                          onClick={(e) => handleMenuToggle(e, chatId)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical size={16} className="text-gray-600" />
                        </button>

                        {/* Dropdown */}
                        {openMenuId === chatId && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-2 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 animate-fade-in"
                          >
                            <button
                              onClick={(e) => handleShare(e, chat)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                            >
                              <Share2 size={16} /> Share
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(e, chat)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare
                      size={48}
                      className="mx-auto mb-3 opacity-20"
                    />
                    <p className="text-sm">No chats yet</p>
                    <p className="text-xs mt-1">Start a new conversation</p>
                  </div>
                )}
              </div>

              {/* New Chat Button */}
              <div className="p-4 border-t border-gray-200/50 flex-shrink-0">
                <button
                  onClick={handleNewChat}
                  className="w-full p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium hover:shadow-lg transition-all"
                >
                  + New Chat
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <main className="flex flex-col lg:flex-row flex-1 p-6 gap-6 overflow-hidden">
          <InfoSection showInfo={showInfo} />

          {/* Chat Section */}
          <div className="flex-1 backdrop-blur-md bg-white/70 rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col min-h-[70vh] max-h-[80vh] overflow-hidden">
            <div className="mb-4 pb-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-800">Conversation</h3>
              <p className="text-xs text-gray-500">
                See the translation in action
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-1">
              <ChatSection messageProps={uiMessages} loading={loading} />
            </div>

            <div className="pt-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!enableChat}
                  placeholder="Type your message in English..."
                  className="flex-1 px-4 py-3 bg-white rounded-2xl border border-gray-200 outline-none transition-all text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!enableChat || !input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center gap-2 font-medium hover:opacity-90 active:scale-95 transition disabled:opacity-50"
                >
                  <Send size={18} />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="backdrop-blur-md bg-white/50 border-t border-gray-200/50 p-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} Kim Nique, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
