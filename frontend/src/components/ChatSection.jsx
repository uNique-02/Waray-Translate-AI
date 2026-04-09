import { Send } from "lucide-react";

export default function ChatSection({
  messageProps = [],
  loading = false,
  input = "",
  setInput = () => {},
  onSend = () => {},
  onKeyPress = () => {},
  enableChat = true,
  placeholder = "Type your message in English...",
  emptyTitle = "WarayTranscribe AI",
  emptySubtitle = "Start a conversation in Waray-Waray",
  emptyMessage = "Type your message here...",
}) {
  const hasMessages = messageProps.some(
    (msg) => msg.text && msg.text.trim() !== "",
  );

  if (!hasMessages) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center bg-transparent h-full">
        <div className="w-full max-w-2xl px-6">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-700 to-cyan-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-white text-2xl font-bold">W</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {emptyTitle}
            </h1>
            <p className="text-slate-300">{emptySubtitle}</p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative flex items-center bg-slate-100 rounded-2xl shadow-2xl shadow-blue-950/40 overflow-hidden border border-blue-200/80 ring-1 ring-white/30">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyPress}
                placeholder={emptyMessage}
                disabled={!enableChat}
                className="min-w-0 flex-1 px-4 sm:px-6 py-4 focus:outline-none text-slate-900 placeholder-slate-500 bg-transparent"
              />
              <button
                onClick={onSend}
                disabled={!enableChat || !input.trim()}
                className={`m-1 sm:m-2 px-4 sm:px-6 py-3 rounded-xl font-medium text-white shrink-0 transition-all duration-200 ${
                  enableChat && input.trim()
                    ? "bg-gradient-to-r from-blue-700 to-cyan-600 hover:shadow-lg hover:scale-105 active:scale-95"
                    : "bg-slate-400 text-slate-200 cursor-not-allowed"
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

  return (
    <div className="flex items-center justify-center h-full min-h-0 bg-transparent p-0">
      <div className="flex flex-col bg-slate-100/95 backdrop-blur-xl shadow-[0_24px_80px_rgba(2,6,23,0.45)] rounded-3xl h-full w-full max-w-4xl overflow-hidden border border-blue-200/80 ring-1 ring-white/40">
        <div className="relative bg-gradient-to-r from-blue-700 to-cyan-600 p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl">
              <span className="text-white font-bold">W</span>
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">{emptyTitle}</h2>
              <p className="text-cyan-100 text-sm">{emptySubtitle}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-white to-blue-50/80">
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
                      ? "bg-gradient-to-r from-blue-700 to-cyan-600 text-white rounded-br-md"
                      : "bg-white text-slate-800 rounded-bl-md border border-blue-100 shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-xs text-slate-500 mt-1.5 px-2">
                  {msg.time}
                </span>
              </div>
            ))}

          {loading && (
            <div className="flex items-start space-x-2 animate-fade-in">
              <div className="bg-white rounded-2xl rounded-bl-md px-5 py-3 shadow-sm border border-blue-100">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm border-t border-blue-100">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-300"></div>
            <div className="relative flex items-center bg-slate-100 rounded-2xl shadow-2xl shadow-blue-950/30 overflow-hidden border border-blue-200/80 ring-1 ring-white/30">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyPress}
                placeholder={placeholder}
                disabled={!enableChat}
                className={`min-w-0 flex-1 px-4 sm:px-5 py-4 focus:outline-none bg-transparent text-slate-900 placeholder-slate-500 ${
                  !enableChat && "cursor-not-allowed"
                }`}
              />

              <button
                onClick={onSend}
                disabled={!enableChat || !input.trim()}
                className={`m-1 sm:m-2 p-2.5 sm:p-3 rounded-xl shrink-0 transition-all duration-200 ${
                  enableChat && input.trim()
                    ? "bg-gradient-to-r from-blue-700 to-cyan-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                    : "bg-slate-400 text-slate-200 cursor-not-allowed"
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
