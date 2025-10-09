import { useState } from "react";
import { Send } from "lucide-react";
import useAiStore from "../stores/aiStore";
import { useEffect } from "react";

import { Sparkles } from "lucide-react";
import { get } from "mongoose";

export default function ChatSection({ enableChat = true, messageProps = [] }) {
  const [messages, setMessages] = useState(messageProps);
  const [input, setInput] = useState("");

  const response = useAiStore((state) => state.response);
  const fetchResponse = useAiStore((state) => state.fetchResponse);
  const loading = useAiStore((state) => state.loading);

  const handleSend = () => {
    if (!input.trim()) return;

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

  // Empty state - centered input
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
        <div className="w-full max-w-2xl px-6">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              WarayTranscribe AI
            </h1>
            <p className="text-gray-600">Start a conversation in Waray-Waray</p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                disabled={!enableChat}
                className="flex-1 px-6 py-4 focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!enableChat || !input.trim()}
                className={`m-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 
                  ${
                    enableChat && input.trim()
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:scale-105 active:scale-95"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat UI with messages
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="flex flex-col bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl h-[90vh] w-full max-w-4xl overflow-hidden border border-white/20">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">
                WarayTranscribe AI
              </h2>
              <p className="text-white/80 text-sm">Always here to help</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-transparent to-blue-50/30">
          {messages.map((msg, idx) => (
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

        {/* Input */}
        <div className="p-6 bg-white/50 backdrop-blur-sm border-t border-gray-100">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-300"></div>
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type Waray-Waray here..."
                disabled={!enableChat}
                className={`flex-1 px-5 py-4 focus:outline-none bg-transparent text-gray-700 placeholder-gray-400
                  ${!enableChat && "cursor-not-allowed"}`}
              />

              <button
                onClick={handleSend}
                disabled={!enableChat || !input.trim()}
                className={`m-2 p-3 rounded-xl transition-all duration-200 
                  ${
                    enableChat && input.trim()
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
