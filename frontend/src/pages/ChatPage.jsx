import { useState, useRef } from "react";
import { MessageSquare, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import InfoSection from "../components/InfoSection";
import ChatSection from "../components/ChatSection.jsx";
import { useEffect } from "react";
import useAiStore from "../stores/aiStore";
import useUserStore from "../stores/useUserStore";
import useChatStore from "../stores/chatStore";
import useMessageStore from "../stores/messageStore";

export default function WarayTranscribeApp({
  enableChat = true,
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showChats, setShowChats] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const checkingAuth = useUserStore((state) => state.checkingAuth);

  const user = useUserStore((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();

  const currentYear = new Date().getFullYear();

  const setCurrentChat = useChatStore((state) => state.setCurrentChat);

  const chats = useChatStore((state) => state.chats);
  const currentChat = useChatStore((state) => state.currentChat);
  const fetchChats = useChatStore((state) => state.fetchChats);

  const sendMessage = useMessageStore((s) => s.sendMessage);
  const resetAll = useMessageStore((s) => s.resetAll);

  // ai store
  const response = useAiStore((s) => s.response);
  const responseCount = useAiStore((s) => s.responseCount);
  const fetchResponse = useAiStore((s) => s.fetchResponse);
  const aiLoading = useAiStore((s) => s.loading);

  // Keep the query that triggered the current AI call
  const pendingQueryRef = useRef(null);
  const activeChatId = currentChat?._id || currentChat?.id;
  const showChatsOnTransition = location.state?.showChats ?? showChats;

  useEffect(() => {
    resetAll();
    setMessages([]);
    if (user) {
      fetchChats(user.id || user._id);
    }
  }, []);

  // ---- handle send
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // 1) Add user message immediately
    setMessages((prev) => [
      ...prev,
      { from: "user", text: input, time: getCurrentTime() },
    ]);

    // 2) Store pending query so the response effect knows what query this is
    pendingQueryRef.current = input;

    // 3) Trigger AI fetch
    fetchResponse(input);

    // 4) Clear input for UX
    setInput("");
  };

  // ---- effect: when AI response is ready, send to backend
  useEffect(() => {
    // Snapshot and immediately clear the ref so any re-run of this effect is a no-op
    const query = pendingQueryRef.current;
    const aiText = response;
    pendingQueryRef.current = null;

    // Guard: nothing to do if there's no pending query or response
    if (
      !query ||
      query.trim() === "" ||
      !aiText ||
      aiText.trim() === "" ||
      query == "" ||
      query == null ||
      query.trim(" ") == ""
    )
      return;

    let cancelled = false;

    const sendToBackend = async () => {
      if (!user) {
        // Guest: just show the bot reply
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: aiText, time: getCurrentTime() },
        ]);
        return;
      }

      try {
        const userId = user._id || user.id;
        const result = await sendMessage({ userId, query, response: aiText });
        const { chat } = result || {};

        if (cancelled) return;

        setMessages((prev) => [
          ...prev,
          { from: "bot", text: aiText, time: getCurrentTime() },
        ]);

        if (!chat) {
          console.error("Chat not returned from backend");
          return;
        }

        setCurrentChat(chat);
        navigate(`/chats/${chat._id}`, {
          state: { showChats: showChatsOnTransition },
        });
      } catch (err) {
        console.error("Failed to send message to backend:", err);
      }
    };

    sendToBackend();

    return () => {
      cancelled = true;
    };
  }, [responseCount, showChatsOnTransition, navigate, response, sendMessage, setCurrentChat, user]);

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
    navigate(`/chats/${chat._id || chat.id}`, {
      state: { showChats: showChatsOnTransition },
    });
  };

  const handleNewChat = () => {
    setMessages([]);
    setShowChats(false);
  };

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
`}</style>

      {/* Header */}
      <header className="backdrop-blur-md bg-slate-950/60 border-b border-blue-900/60 shadow-sm sticky top-0 z-50">
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0 max-w-7xl mx-auto w-full overflow-hidden">
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
          <div className="w-80 backdrop-blur-md bg-slate-100/95 border-r border-blue-200/80 shadow-[0_24px_80px_rgba(2,6,23,0.35)] animate-slide-in">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-blue-100">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Chat History
                  </h2>
                  <button
                    onClick={() => setShowChats(!showChats)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-slate-700 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Chat List - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {chats.length > 0 ? (
                    chats.map((chat) => {
                      const chatId = chat._id || chat.id;
                      const isActive = chatId === activeChatId;

                      return (
                      <button
                        key={chatId}
                        className={`w-full text-left p-3 rounded-lg shadow-sm hover:shadow-md transition-all border ${
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
                          {chat.date}
                        </p>
                      </button>
                    );
                  })
                ) : (
                    <div className="text-center py-8 text-slate-500">
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

        {/* Content Area */}
        <main className="flex flex-col lg:flex-row flex-1 min-h-0 p-6 gap-6 overflow-hidden">
          {/* Info Section */}
          <InfoSection showInfo={showInfo} />

          {/* Chat Section */}
          <div className="flex-1">
            <ChatSection
              messageProps={messages}
              loading={aiLoading}
              input={input}
              setInput={setInput}
              onSend={handleSendMessage}
              onKeyPress={handleKeyPress}
              enableChat={enableChat && !checkingAuth}
              placeholder="Type your message in English..."
              emptyTitle="WarayTranscribe AI"
              emptySubtitle="Start a conversation in Waray-Waray"
              emptyMessage="Type your message here..."
            />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="backdrop-blur-md bg-slate-950/60 border-t border-blue-900/60 p-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-300">
            &copy; {currentYear} Kim Nique, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
