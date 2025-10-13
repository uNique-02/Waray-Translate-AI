import { useState, useRef } from "react";
import {
  MessageSquare,
  Settings,
  Info,
  Sparkles,
  Send,
  Menu,
  X,
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

// Mock ChatSection component
const ChatSection = ({ messageProps, loading }) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-2">
      {messageProps
        .filter((msg) => msg.text && msg.text.trim() !== "")
        .map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.from === "user" ? "items-end" : "items-start"
            } animate-slide-up`}
          >
            <div
              className={`px-5 py-3 rounded-2xl max-w-md shadow-sm transition-all duration-200 hover:shadow-md ${
                msg.from === "user"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md"
                  : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
            <span className="text-xs text-gray-400 mt-1.5 px-2">
              {msg.time}
            </span>
          </div>
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
    </div>
  );
};

export default function WarayTranscribeApp({
  enableChat = true,
  messageProps = [],
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showChats, setShowChats] = useState(false);

  const [messages, setMessages] = useState([messageProps]);
  const [input, setInput] = useState("");

  const checkingAuth = useUserStore((state) => state.checkingAuth);

  // const response = useAiStore((state) => state.response);
  // const fetchResponse = useAiStore((state) => state.fetchResponse);
  // const aiLoading = useAiStore((state) => state.loading);

  const user = useUserStore((state) => state.user);

  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const setCurrentChat = useChatStore((state) => state.setCurrentChat);

  const chats = useChatStore((state) => state.chats);
  const currentChat = useChatStore((state) => state.currentChat);

  const createChat = useChatStore((state) => state.createChat);
  const fetchChats = useChatStore((state) => state.fetchChats);

  // const sendMessage = useMessageStore((state) => state.sendMessage);
  // const chatId = useMessageStore((state) => state.chatId);
  // const messageLoading = useMessageStore((state) => state.loading);

  // const { sendMessage } = useMessageStore();

  // const handleSendMessage = async () => {
  //   if (!input.trim()) return;

  //   // Add user message immediately
  //   setMessages((prev) => [
  //     ...prev,
  //     { from: "user", text: input, time: getCurrentTime() },
  //   ]);

  //   // Trigger async AI fetch
  //   fetchResponse(input);
  // };

  // // Send query to the api if response from ai is ready
  // useEffect(() => {
  //   if (!response) return; // wait until AI response is ready

  //   // Send to backend now that response exists
  //   if (user) {
  //     sendMessage({
  //       userId: user._id,
  //       query: input,
  //       response,
  //     });
  //   }

  //   if (!messageLoading) {
  //     // Add bot message
  //     setMessages((prev) => [
  //       ...prev,
  //       { from: "bot", text: response, time: getCurrentTime() },
  //     ]);
  //     // Clear input
  //     setInput("");
  //   }
  // }, [response]);

  // useEffect(() => {
  //   if (response) {
  //     navigate(`/chats/${chatId}`);
  //   }

  //   // // Add bot message
  //   // setMessages((prev) => [
  //   //   ...prev,
  //   //   { from: "bot", text: response, time: getCurrentTime() },
  //   // ]);
  //   // // Clear input
  //   // setInput("");
  // }, [chatId]);

  // const createNewChat = async () => {
  //   await createChat(userId, "Hello! This is my first message.");
  // };

  // const handleSend = () => {
  //   console.log("Handle send is called");
  //   if (!input.trim()) return;

  //   console.log("User Input:", input);

  //   // Add user message
  //   setMessages([
  //     ...messages,
  //     { from: "user", text: input, time: getCurrentTime() },
  //   ]);

  //   // Fetch AI response
  //   fetchResponse(input);

  //   setInput("");
  // };

  const chatId = useMessageStore((s) => s.chatId);
  const sendMessage = useMessageStore((s) => s.sendMessage);
  const messageLoading = useMessageStore((s) => s.loading);

  // ai store
  const response = useAiStore((s) => s.response);
  const fetchResponse = useAiStore((s) => s.fetchResponse);
  const aiLoading = useAiStore((s) => s.loading);

  // Keep the query that triggered the current AI call
  const pendingQueryRef = useRef(null);

  useEffect(() => {
    console.log("Chat page mounted, current user:", user);
    if (user) {
      console.log("Logged in as ", user);
    } else {
      console.log("User not logged in. Working as guest.");
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchChats(user.id || user._id);
    setMessages([]);
  }, []);

  if (user) {
    useEffect(() => {
      if (user) console.log("User Chats:", user.chats);
    }, []);
  }

  useEffect(() => {
    if (user) console.log("Current Chat:", currentChat);
  }, [currentChat]);

  // ---- handle send (user is authenticated)
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // 1) Add user message immediately
    setMessages((prev) => [
      ...prev,
      { from: "user", text: input, time: getCurrentTime() },
    ]);

    // 2) store pending query so response effect knows what query this is
    pendingQueryRef.current = input;

    // 3) trigger AI fetch (doesn't need to return)
    fetchResponse(input);

    // 4) optionally clear input right away for UX
    setInput("");
  };

  let cancelled = false;

  // ---- effect: when AI response is ready, send to backend using pendingQueryRef
  useEffect(() => {
    const sendToBackend = async () => {
      const aiText = response;
      const query = pendingQueryRef.current;

      if (!aiText || !query) return;

      try {
        // Wait for sendMessage to complete.
        if (!user || !user._id) {
          console.error("No user found when sending message");
          return;
        }

        const { chat, message } =
          (await sendMessage({
            userId: user._id,
            query,
            response: aiText,
          })) || {}; // <- prevents destructuring undefined

        if (!chat) {
          console.error("Chat not returned from backend");
          return;
        }

        console.log("Chat + message created:", chat, message);

        setCurrentChat(chat);
      } catch (err) {
        console.error("Failed to send message to backend:", err);
      } finally {
        // clear pending query so later AI responses won't re-trigger
        pendingQueryRef.current = null;
      }
    };

    sendToBackend();

    if (!user) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: response, time: getCurrentTime() },
      ]);
    }

    return () => {
      cancelled = true;
    };
  }, [response, sendMessage, user, chatId, navigate]);

  useEffect(() => {
    if (!chatId) return;

    // Add bot message to UI (only once)
    setMessages((prev) => [
      ...prev,
      { from: "bot", text: aiText, time: getCurrentTime() },
    ]);
    // If sendMessage returns chat id, navigate immediately:
    if (chatId && !cancelled) {
      navigate(`/chats/${chatId}`);
    }
  }, [chatId]);

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // handleSend();
      // if (user) {
      //   handleSendMessage();
      // } else {
      //   handleSend();
      // }
      handleSendMessage();
    }
  };

  const handleChatSelect = (chat) => {
    console.log("Selected chat:", chat);
    setCurrentChat(chat);
    navigate(`/chats/${chat._id || chat.id}`);
    // ✅ redirect to the chat view

    // Load the selected chat messages here
    // setShowChats(false);
  };

  const handleNewChat = () => {
    console.log("Create new chat");
    setMessages([]);
    setShowChats(false);
  };

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
`}</style>

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
            <div className="w-80 backdrop-blur-md bg-white/95 border-r border-gray-200/50 shadow-xl animate-slide-in">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
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
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {chats.length > 0 ? (
                    chats.map((chat) => (
                      <button
                        key={chat.id}
                        className="w-full text-left p-3 rounded-lg bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all border border-gray-200/50"
                        onClick={() => handleChatSelect(chat)}
                      >
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {chat.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {chat.date}
                        </p>
                      </button>
                    ))
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
                <div className="p-4 border-t border-gray-200/50">
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
        <main className="flex flex-col lg:flex-row flex-1 p-6 gap-6">
          {/* Info Section */}
          <InfoSection showInfo={showInfo} />

          {/* Chat Section */}
          <div className="flex-1 backdrop-blur-md bg-white/70 rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col min-h-[70vh]">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Conversation</h3>
              <p className="text-xs text-gray-500">
                See the translation in action
              </p>
            </div>
            <ChatSection messageProps={messages} loading={aiLoading} />
            {/* Input Area */}
            {!checkingAuth && (
              <div className="mt-auto pt-4 border-t border-gray-200">
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
                    onClick={handleSendMessage}
                    // {() => {
                    //   if (user) {
                    //     handleSendMessage();
                    //   } else {
                    //     handleSend();
                    //   }
                    // }}
                    disabled={!enableChat || !input.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl 
                    flex items-center gap-2 font-medium hover:opacity-90 active:scale-95 transition disabled:opacity-50"
                  >
                    <Send size={18} />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            )}
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
