import { useState } from "react";
import {
  MessageSquare,
  Settings,
  Info,
  Sparkles,
  Send,
  Menu,
  X,
  MoreVertical,
  Share2,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import InfoSection from "../components/InfoSection";
import { useEffect } from "react";
import useAiStore from "../stores/aiStore";
import useUserStore from "../stores/useUserStore";
import useChatStore from "../stores/chatStore";
import useMessageStore from "../stores/messageStore";
import React from "react";

// Mock ChatSection component
const ChatSection = ({ messageProps, loading }) => {
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messageProps, loading]);

  return (
    <div className="flex-1 overflow-y-auto space-y-3 px-2 py-2 min-h-0">
      {messageProps.map((msg, idx) => (
        <React.Fragment key={idx}>
          <div
            key={`q-${idx}`}
            className="flex flex-col items-end animate-slide-up"
          >
            <div
              className={`px-5 py-3 rounded-2xl max-w-md shadow-sm transition-all duration-200 hover:shadow-md bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md"
                  `}
            >
              <p className="text-sm leading-relaxed">{msg.query}</p>
            </div>
            <span className="text-xs text-gray-400 mt-1.5 px-2">
              {msg.updatedAt}
            </span>
          </div>

          {msg.response && (
            <div
              key={`r-${idx}`}
              className="flex flex-col items-start animate-slide-up"
            >
              <div
                className={`px-5 py-3 rounded-2xl max-w-md shadow-sm transition-all duration-200 hover:shadow-md 
                  "bg-white text-gray-800 rounded-bl-md border border-gray-100"
              `}
              >
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
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default function ChatViewPage({
  enableChat = true,
  messageProps = [],
  chatId = null,
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  const user = useUserStore((state) => state.user);

  const [uiMessages, setUIMessages] = useState(messageProps);
  const [input, setInput] = useState("");

  const response = useAiStore((state) => state.response);
  const fetchResponse = useAiStore((state) => state.fetchResponse);
  const loading = useAiStore((state) => state.loading);

  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const chats = useChatStore((state) => state.chats);
  const currentChat = useChatStore((state) => state.currentChat);
  const createChat = useChatStore((state) => state.createChat);
  const fetchChats = useChatStore((state) => state.fetchChats);
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);

  const messages = useMessageStore((s) => s.messages);
  const fetchMessages = useMessageStore((s) => s.fetchMessages);

  useEffect(() => {
    console.log("Chat View page mounted, current user:", user);
    if (user) {
      console.log("Logged in as ", user);
    } else {
      console.log("User not logged in. Working as guest.");
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchChats(user._id || user.id);
  }, []);

  if (user) {
    useEffect(() => {
      if (user) console.log("User Chats:", user.chats);
    }, []);
  }
  useEffect(() => {
    fetchMessages(currentChat?._id || currentChat?.id);
    console.log("CURRENT CHAT: ", currentChat);
    console.log("CURRENT MESSAGES: ", messages);
    if (user) console.log("Current Chat:", currentChat);
  }, [currentChat]);

  const handleSend = () => {
    if (!input.trim()) return;

    console.log("User Input:", input);

    // Add user message
    setUIMessages([
      ...uiMessages,
      { from: "user", text: input, time: getCurrentTime() },
    ]);

    // Fetch AI response
    fetchResponse(input);

    setInput("");
  };

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChatSelect = (chat) => {
    console.log("Selected chat:", chat);
    setCurrentChat(chat);
    setUIMessages(chat.messages);
    console.log("MESSAGES NOW");
    navigate(`/chats/${chat._id || chat.id}`);
  };

  const handleNewChat = () => {
    console.log("Create new chat");
    setUIMessages([]);
    setShowChats(false);
    navigate("/new");
  };

  const handleMenuToggle = (e, chatId) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Toggling menu for chat:", chatId);
    console.log("Current openMenuId:", openMenuId);
    setOpenMenuId((prevId) => (prevId === chatId ? null : chatId));
  };

  const handleShare = (e, chat) => {
    e.stopPropagation();
    setOpenMenuId(null);

    // Create shareable link
    const shareUrl = `${window.location.origin}/chats/${chat._id || chat.id}`;

    // Try to use Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title: chat.title,
          text: `Check out this chat: ${chat.title}`,
          url: shareUrl,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback: copy to clipboard
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
    if (chatToDelete) {
      console.log("Deleting chat:", chatToDelete);
      // Add your delete logic here
      // deleteChat(chatToDelete._id || chatToDelete.id);

      setShowDeleteConfirm(false);
      setChatToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setChatToDelete(null);
  };

  // Update messages when AI response arrives
  useEffect(() => {
    console.log(
      "Chatview page set bot message for use effect for response was called"
    );
    if (response) {
      setUIMessages((prevMessages) => [
        ...prevMessages,
        { from: "bot", text: response, time: getCurrentTime() },
      ]);
    }
  }, [response]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
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
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
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

  /* Custom Scrollbar Styles */
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.4) transparent;
  }
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px;
  }
  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.4);
    border-radius: 10px;
    transition: background 0.2s;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.6);
  }
  
  /* Smooth scroll behavior */
  .overflow-y-auto {
    scroll-behavior: smooth;
  }
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
        {/* Sidebar and Chat List Container */}
        <div className="flex">
          {/* Sidebar */}
          <Sidebar
            showInfo={showInfo}
            setShowInfo={setShowInfo}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            showChats={showChats}
            setShowChats={setShowChats}
          />

          {/* Chat List Panel - Adjacent to Sidebar */}
          {showChats && (
            <div className="w-80 backdrop-blur-md bg-white/95 border-r border-gray-200/50 shadow-xl animate-slide-in h-[calc(100vh-80px)] flex flex-col">
              <div className="flex flex-col h-full">
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

                {/* Chat List - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
                  {chats.length > 0 ? (
                    chats.map((chat) => {
                      const chatId = chat._id || chat.id;
                      return (
                        <div key={chatId} className="relative group">
                          <button
                            className="w-full text-left p-3 pr-10 rounded-lg bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all border border-gray-200/50"
                            onClick={() => handleChatSelect(chat)}
                          >
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {chat.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {chat.updatedAt}
                            </p>
                          </button>

                          {/* Ellipse Menu Button */}
                          <button
                            onClick={(e) => handleMenuToggle(e, chatId)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical size={16} className="text-gray-600" />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === chatId && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-2 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 animate-fade-in"
                            >
                              <button
                                onClick={(e) => handleShare(e, chat)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                              >
                                <Share2 size={16} />
                                Share
                              </button>
                              <button
                                onClick={(e) => handleDeleteClick(e, chat)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
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
            </div>
          )}
        </div>

        {/* Content Area */}
        <main className="flex flex-col lg:flex-row flex-1 p-6 gap-6 overflow-hidden">
          {/* Info Section */}
          <InfoSection showInfo={showInfo} />

          {/* Chat Section */}
          <div className="flex-1 backdrop-blur-md bg-white/70 rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col min-h-[70vh] max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="mb-4 pb-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-800">Conversation</h3>
              <p className="text-xs text-gray-500">
                See the translation in action
              </p>
            </div>

            {/* ✅ Scrollable Chat Messages */}
            <div className="flex-1 overflow-y-auto px-1">
              <ChatSection messageProps={uiMessages} loading={loading} />
            </div>

            {/* Input Area (Fixed at bottom) */}
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
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl 
            flex items-center gap-2 font-medium hover:opacity-90 active:scale-95 transition disabled:opacity-50"
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
