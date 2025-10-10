import { useState } from "react";
import {
  MessageSquare,
  Settings,
  Info,
  Sparkles,
  Send,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import InfoSection from "../components/InfoSection";
import { useEffect } from "react";
import useAiStore from "../stores/aiStore";
// Mock ChatSection component
const ChatSection = ({ messageProps }) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-2">
      {messageProps.map((msg, idx) => (
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
          <span className="text-xs text-gray-400 mt-1.5 px-2">{msg.time}</span>
        </div>
      ))}
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

  const [messages, setMessages] = useState(messageProps);
  const [input, setInput] = useState("");

  const response = useAiStore((state) => state.response);
  const fetchResponse = useAiStore((state) => state.fetchResponse);
  const loading = useAiStore((state) => state.loading);

  const handleSend = () => {
    if (!input.trim()) return;

    console.log("User Input:", input);

    // Add user message
    setMessages([
      ...messages,
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

  // Update messages when AI response arrives
  useEffect(() => {
    if (response) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: "bot", text: response, time: getCurrentTime() },
      ]);
    }
  }, [response]);

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
      `}</style>

      {/* Header */}
      <header className="backdrop-blur-md bg-white/70 border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <Sidebar
          showInfo={showInfo}
          setShowInfo={setShowInfo}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />{" "}
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

            <ChatSection messageProps={messages} />

            {/* Input Area */}
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
                  onClick={handleSend}
                  disabled={!enableChat || !input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl 
      flex items-center gap-2 font-medium hover:opacity-90 active:scale-95 transition"
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
            Made with <span className="text-red-500 animate-pulse">❤️</span> for
            the Waray-Waray community
          </p>
        </div>
      </footer>
    </div>
  );
}
