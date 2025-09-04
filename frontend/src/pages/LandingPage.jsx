import ChatSection from "../components/ChatSection";
import { MessageSquare, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function WarayTranscribeApp() {
  let messages = [
    { from: "user", text: "Maupay nga adlaw! Kumusta ka?", time: "10:00 AM" },
    { from: "bot", text: "Good day! How are you?", time: "10:00 AM" },
    {
      from: "user",
      text: "Mabaysay ako. Naglilibot-libot la. Nano imo ginbubuhat yana?",
      time: "10:01 AM",
    },
    {
      from: "bot",
      text: "I am fine. Just exploring around. What are you doing now?",
      time: "10:01 AM",
    },
    {
      from: "user",
      text: "Nagbabasa ako hin libro mahitungod han kasaysayan han Waray-Waray.",
      time: "10:02 AM",
    },
    {
      from: "bot",
      text: "I am reading a book about the history of Waray-Waray.",
      time: "10:02 AM",
    },
    {
      from: "user",
      text: "Makapainteres! Mayda ka ba paborito nga bahin?",
      time: "10:03 AM",
    },
    {
      from: "bot",
      text: "Interesting! Do you have a favorite part?",
      time: "10:03 AM",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b bg-white shadow-sm">
        <div className="flex items-center space-x-6">
          <span className="text-blue-500 font-bold text-xl">
            Waray Translate AI
          </span>
          <nav className="flex space-x-6 text-gray-600">
            <a href="#" className="hover:text-black">
              Home
            </a>
            <a href="#" className="hover:text-black">
              About
            </a>
          </nav>
        </div>

        <div className="flex space-x-4">
          {/* New Chat Button */}
          <div className="relative group">
            <button className="p-2 border rounded-md hover:bg-gray-50 hover:cursor-pointer">
              <MessageSquare size={20} />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 -top-6 text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition">
              New
            </span>
          </div>

          {/* Settings Button */}
          <div className="relative group">
            <button className="p-2 border rounded-md hover:bg-gray-50 hover:cursor-pointer">
              <Settings size={20} />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 -top-6 text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition">
              Settings
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 p-6 space-x-6">
        {/* Left Side */}
        <div className="w-1/3 bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-2">WarayTranscribe AI</h2>
          <p className="text-gray-600 mb-4">
            Your Instant Waray-Waray to English AI Translator
          </p>
          <p className="text-gray-600 mb-4">
            Bridge language barriers effortlessly with WarayTranscribe AI. Our
            advanced chatbot provides accurate, real-time translations from
            Waray-Waray to English, helping you connect, learn, and communicate
            with ease.
          </p>
          <h3 className="font-semibold mb-2">Key Features</h3>
          <ul className="space-y-2 text-gray-700">
            <li>⚑ Accurate Translations</li>
            <li>⚡ Real-time Processing</li>
            <li>🌏 Preserving Culture</li>
          </ul>

          <Link
            to="/new"
            className="mt-4 w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 hover:cursor-pointer flex justify-center"
          >
            Start Translating
          </Link>
        </div>

        <ChatSection messageProps={messages} />
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-gray-500">
        Made with 💙
      </footer>
    </div>
  );
}
