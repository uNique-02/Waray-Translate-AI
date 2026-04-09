import { useEffect, useRef, useState } from "react";
import { MessageSquare, MoreVertical, Share2, Trash2, X } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import InfoSection from "../components/InfoSection";
import ChatSection from "../components/ChatSection.jsx";
import useAiStore from "../stores/aiStore";
import useUserStore from "../stores/useUserStore";
import useChatStore from "../stores/chatStore";
import useMessageStore from "../stores/messageStore";

function formatTime(value) {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function flattenMessages(items = []) {
  return items.flatMap((item) => {
    const time = formatTime(item.updatedAt || item.createdAt);
    const flat = [{ from: "user", text: item.query, time }];

    if (item.response) {
      flat.push({ from: "bot", text: item.response, time });
    }

    return flat;
  });
}

export default function ChatViewPage({ enableChat = true }) {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const pendingQueryRef = useRef(null);

  const [showInfo, setShowInfo] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showChats, setShowChats] = useState(
    Boolean(location.state?.showChats),
  );
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [input, setInput] = useState("");
  const [uiMessages, setUIMessages] = useState([]);

  const user = useUserStore((state) => state.user);
  const chats = useChatStore((state) => state.chats);
  const currentChat = useChatStore((state) => state.currentChat);
  const fetchChats = useChatStore((state) => state.fetchChats);
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);
  const fetchChatById = useChatStore((state) => state.fetchChatById);
  const deleteChat = useChatStore((state) => state.deleteChat);

  const messages = useMessageStore((state) => state.messages);
  const fetchMessages = useMessageStore((state) => state.fetchMessages);
  const sendMessage = useMessageStore((state) => state.sendMessage);

  const response = useAiStore((state) => state.response);
  const responseCount = useAiStore((state) => state.responseCount);
  const fetchResponse = useAiStore((state) => state.fetchResponse);
  const loading = useAiStore((state) => state.loading);

  const currentYear = new Date().getFullYear();
  const activeChatId = chatId || currentChat?._id || currentChat?.id;

  useEffect(() => {
    if (!user) {
      navigate("/new", { state: { showChats } });
      return;
    }

    if (!chatId) return;

    fetchChats(user._id || user.id);
    fetchChatById(chatId);
    fetchMessages(chatId);
  }, [chatId, user, fetchChats, fetchChatById, fetchMessages, navigate, showChats]);

  useEffect(() => {
    setUIMessages(flattenMessages(messages));
  }, [messages]);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setUIMessages((prev) => [
      ...prev,
      { from: "user", text: input, time: getCurrentTime() },
    ]);

    pendingQueryRef.current = input;
    fetchResponse(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const query = pendingQueryRef.current;
    const aiText = response;
    pendingQueryRef.current = null;

    if (!query || !aiText || !aiText.trim() || !activeChatId) return;

    let cancelled = false;

    const sendToBackend = async () => {
      if (!user) {
        setUIMessages((prev) => [
          ...prev,
          { from: "bot", text: aiText, time: getCurrentTime() },
        ]);
        return;
      }

      try {
        await sendMessage({
          userId: user.id || user._id,
          chatId: activeChatId,
          query,
          response: aiText,
        });

        if (cancelled) return;

        setUIMessages((prev) => [
          ...prev,
          { from: "bot", text: aiText, time: getCurrentTime() },
        ]);
      } catch (err) {
        console.error("Failed to send message to backend:", err);
      }
    };

    sendToBackend();

    return () => {
      cancelled = true;
    };
  }, [response, responseCount, activeChatId, sendMessage, user]);

  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
    navigate(`/chats/${chat._id || chat.id}`, {
      state: { showChats },
    });
  };

  const handleNewChat = () => {
    setUIMessages([]);
    setInput("");
    setShowChats(false);
    navigate("/new");
  };

  const handleMenuToggle = (e, chatMenuId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === chatMenuId ? null : chatMenuId);
  };

  const handleShare = (e, chat) => {
    e.stopPropagation();
    setOpenMenuId(null);

    const shareUrl = `${window.location.origin}/chats/${chat._id || chat.id}`;

    if (navigator.share) {
      navigator
        .share({
          title: chat.title,
          text: `Check out this chat: ${chat.title}`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Chat link copied to clipboard!");
      });
    }
  };

  const handleDeleteClick = (e, chat) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setChatToDelete(chat);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (!chatToDelete) return;

    deleteChat(chatToDelete._id || chatToDelete.id);
    setShowDeleteConfirm(false);
    setChatToDelete(null);

    if ((chatToDelete._id || chatToDelete.id) === activeChatId) {
      navigate("/new");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setChatToDelete(null);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col">
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes slide-in-from-sidebar {
          from {
            transform: translateX(-80px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in-from-sidebar 0.3s ease-out forwards;
        }
      `}</style>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-slate-100/95 rounded-2xl shadow-[0_24px_80px_rgba(2,6,23,0.45)] p-6 max-w-md w-full mx-4 animate-fade-in border border-blue-200/80">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <Trash2 size={24} className="text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete Chat</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "{chatToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 rounded-lg border border-blue-200 text-slate-700 hover:bg-blue-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="backdrop-blur-md bg-slate-950/60 border-b border-blue-900/60 shadow-sm sticky top-0 z-50">
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      </header>

      <div className="flex flex-1 min-h-0 max-w-7xl mx-auto w-full overflow-hidden">
        <div className="flex min-h-0">
          <Sidebar
            showInfo={showInfo}
            setShowInfo={setShowInfo}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            showChats={showChats}
            setShowChats={setShowChats}
          />

          {showChats && (
            <div className="w-80 h-full backdrop-blur-md bg-slate-100/95 border-r border-blue-200/80 shadow-[0_24px_80px_rgba(2,6,23,0.35)] animate-slide-in">
              <div className="flex flex-col h-full min-h-0">
                <div className="flex items-center justify-between p-4 border-b border-blue-100">
                  <h2 className="text-lg font-semibold text-slate-900">Chat History</h2>
                  <button
                    onClick={() => setShowChats(false)}
                    className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-slate-700"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
                  {chats.length > 0 ? (
                    [...chats].reverse().map((chat) => {
                      const menuId = chat._id || chat.id;
                      const isActive = menuId === activeChatId;
                      return (
                        <div key={menuId} className="relative group">
                          <button
                            className={`w-full text-left p-3 pr-10 rounded-lg shadow-sm hover:shadow-md transition-all border ${
                              isActive
                                ? "bg-blue-50 border-blue-200 ring-2 ring-blue-200 shadow-md"
                                : "bg-white hover:bg-blue-50 border-blue-100"
                            }`}
                            onClick={() => handleChatSelect(chat)}
                          >
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {chat.title}
                            </p>
                            <p className={`text-xs mt-1 ${isActive ? "text-blue-700" : "text-slate-500"}`}>
                              {chat.updatedAt}
                            </p>
                          </button>

                          <button
                            onClick={(e) => handleMenuToggle(e, menuId)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical size={16} className="text-slate-600" />
                          </button>

                          {openMenuId === menuId && (
                            <div className="absolute right-2 top-full mt-1 w-48 bg-slate-100 rounded-lg shadow-lg border border-blue-100 py-1 z-10 animate-fade-in">
                              <button
                                onClick={(e) => handleShare(e, chat)}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 flex items-center gap-2 transition-colors"
                              >
                                <Share2 size={16} />
                                Share
                              </button>
                              <button
                                onClick={(e) => handleDeleteClick(e, chat)}
                                className="w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2 transition-colors"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <MessageSquare size={48} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No chats yet</p>
                      <p className="text-xs mt-1">Start a new conversation</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-blue-100">
                  <button
                    onClick={handleNewChat}
                    className="w-full p-3 rounded-lg bg-gradient-to-br from-blue-700 to-cyan-600 text-white font-medium hover:shadow-lg transition-all"
                  >
                    + New Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <main className="flex flex-col lg:flex-row flex-1 min-h-0 p-6 gap-6 overflow-hidden">
          <InfoSection showInfo={showInfo} />

          <div className="flex-1 min-h-0 overflow-hidden">
            <ChatSection
              messageProps={uiMessages}
              loading={loading}
              input={input}
              setInput={setInput}
              onSend={handleSendMessage}
              onKeyPress={handleKeyPress}
              enableChat={enableChat}
              placeholder="Type your message in English..."
              emptyTitle="WarayTranscribe AI"
              emptySubtitle="Start a conversation in Waray-Waray"
              emptyMessage="Type your message here..."
            />
          </div>
        </main>
      </div>

      <footer className="backdrop-blur-md bg-slate-950/60 border-t border-blue-900/60 p-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-300">&copy; {currentYear} Kim Nique, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
