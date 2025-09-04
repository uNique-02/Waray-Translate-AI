import { useState } from "react";
import { Send } from "lucide-react";
import useAiStore from "../stores/aiStore";
import { useEffect } from "react";
import { get } from "mongoose";

export default function ChatSection({ enableChat = false, messageProps = [] }) {
  const [messages, setMessages] = useState(messageProps);
  const [input, setInput] = useState("");

  const response = useAiStore((state) => state.response);
  const fetchResponse = useAiStore((state) => state.fetchResponse);
  const loading = useAiStore((state) => state.loading);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { from: "user", text: input, time: "10:04 AM" }]);

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

  // Update messages when AI response arrives
  useEffect(() => {
    if (response) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: "bot", text: response, time: "10:05 AM" },
      ]);
    }
  }, [response]);

  // If no messages yet → show centered input only
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="flex items-center bg-white rounded-lg shadow px-2 w-[90%] md:w-[350px]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={!enableChat}
            className="flex-1 px-3 py-2 rounded-l-lg focus:outline-none text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!enableChat}
            className={`px-4 py-2 rounded-r-lg text-white text-sm 
              ${
                enableChat
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  // Otherwise → full chat UI
  return (
    <div
      className="flex flex-col bg-white shadow rounded-none md:rounded-2xl 
                 h-screen md:h-[90vh] w-full md:w-[70%] lg:w-[50%] mx-auto"
    >
      <div className="border-b border-gray-300 p-4 font-bold">New Chat</div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.from === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.from === "user"
                  ? "bg-[#0D5EA6] text-white"
                  : "bg-[#F5F5F5] text-[#333333]"
              }`}
            >
              {msg.text}
            </div>
            <span className="text-xs text-gray-400 mt-1">
              {getCurrentTime()}
            </span>
          </div>
        ))}
        {loading && (
          <p className="text-sm text-gray-400 italic">
            WarayTranscribe AI is typing...
          </p>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-300 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type Waray-Waray here..."
          disabled={!enableChat}
          className={`flex-1 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 
            ${
              enableChat
                ? "border border-gray-300 focus:ring-blue-400"
                : "border border-gray-400 bg-gray-100 cursor-not-allowed"
            }`}
        />

        <button
          onClick={handleSend}
          disabled={!enableChat}
          className={`p-2 rounded-lg text-white 
            ${
              enableChat
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
