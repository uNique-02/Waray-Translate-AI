import ChatSection from "../components/ChatSection";
import { MessageSquare, Settings } from "lucide-react";
import Navbar from "../components/navbar";
import Sidebar from "../components/Sidebar";
import InfoSection from "../components/InfoSection";
import { useState } from "react";

export default function WarayTranscribeApp({ enableChat = true }) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Header / Navbar */}
      <header className="backdrop-blur-md bg-white/70 border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
        <Navbar />
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <Sidebar showInfo={showInfo} setShowInfo={setShowInfo} />{" "}
        {/* Content Area */}
        <main className="flex flex-col lg:flex-row flex-1 p-6 gap-6">
          {/* Info Section */}
          <InfoSection showInfo={showInfo} />
          <ChatSection enableChat={enableChat} />
        </main>
      </div>
    </div>
  );
}
