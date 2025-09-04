import ChatSection from "../components/ChatSection";
import { MessageSquare, Settings } from "lucide-react";

export default function WarayTranscribeApp({ enableChat = true }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header / Navbar */}
      <header className="flex items-center justify-between p-4 border-b border-gray-300 bg-white">
        <div className="flex items-center space-x-6">
          <span className="text-blue-500 font-bold text-xl">
            Waray Translate AI
          </span>
          <nav className="flex space-x-6 text-gray-600">
            <a href="/" className="hover:text-black">
              Home
            </a>
            <a href="/new" className="hover:text-black">
              About
            </a>
          </nav>
        </div>
        <div className="flex space-x-4">
          <button className="p-2 border rounded-md hover:bg-gray-50">
            <MessageSquare size={20} />
          </button>
          <button className="p-2 border rounded-md hover:bg-gray-50">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Chat Section */}
      <main className="flex-1 flex justify-center items-center p-6">
        <ChatSection enableChat={enableChat} />
      </main>
    </div>
  );
}
