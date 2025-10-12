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
import useUserStore from "../stores/useUserStore.js";

// Mock ChatSection component
const ChatSection = ({ messageProps }) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-2">
      {messageProps.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${
            msg.from === "user" ? "justify-end" : "justify-start"
          } animate-fade-in`}
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <div
            className={`max-w-xs md:max-w-md rounded-2xl p-4 shadow-md ${
              msg.from === "user"
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                : "bg-white text-gray-800 border border-gray-100"
            }`}
          >
            <p className="text-sm leading-relaxed">{msg.text}</p>
            <span
              className={`text-xs mt-2 block ${
                msg.from === "user" ? "text-blue-100" : "text-gray-400"
              }`}
            >
              {msg.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function WarayTranscribeApp() {
  const [showInfo, setShowInfo] = useState(true);
  const [inputText, setInputText] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  const messages = [
    { from: "user", text: "Good day! How are you?", time: "10:00 AM" },
    { from: "bot", text: "Maupay nga adlaw! Kumusta ka?", time: "10:00 AM" },
    {
      from: "user",
      text: "I am fine. Just exploring around. What are you doing now?",
      time: "10:01 AM",
    },
    {
      from: "bot",
      text: "Mabaysay ako. Naglilibot-libot la. Nano imo ginbubuhat yana?",
      time: "10:01 AM",
    },
    {
      from: "user",
      text: "I am reading a book about the history of Waray-Waray.",
      time: "10:02 AM",
    },
    {
      from: "bot",
      text: "Nagbabasa ako hin libro mahitungod han kasaysayan han Waray-Waray.",
      time: "10:02 AM",
    },
    {
      from: "user",
      text: "Interesting! Do you have a favorite part?",
      time: "10:03 AM",
    },
    {
      from: "bot",
      text: "Makapainteres! Mayda ka ba paborito nga bahin?",
      time: "10:03 AM",
    },
  ];

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
            <div className="mt-auto pt-4 border-t border-gray-200 opacity-50 pointer-events-none">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message in English..."
                  disabled
                  className="flex-1 px-4 py-3 bg-white rounded-2xl border border-gray-200 outline-none transition-all text-sm"
                />
                <button
                  disabled
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl 
      flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
            {/* Made with <span className="text-red-500 animate-pulse">❤️</span> for
            the Waray-Waray community */}
            &copy; {currentYear} Kim Nique, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
