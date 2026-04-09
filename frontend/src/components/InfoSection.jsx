// src/components/InfoSection.jsx
import { MessageSquare, Sparkles } from "lucide-react";

export default function InfoSection({ showInfo }) {
  return (
    <div
      className={`backdrop-blur-md bg-slate-100/95 rounded-3xl shadow-[0_24px_80px_rgba(2,6,23,0.45)] border border-blue-200/80 ring-1 ring-white/40 p-8 w-full lg:w-96 h-full self-stretch transition-all duration-500 ${
        showInfo ? "opacity-100 scale-100" : "opacity-0 scale-95 hidden"
      }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="relative animate-float">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-cyan-600 rounded-2xl blur-md opacity-35"></div>
          <div className="relative w-14 h-14 bg-gradient-to-br from-blue-700 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
            <MessageSquare className="text-white" size={24} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
            WarayTranscribe
          </h2>
          <p className="text-sm text-blue-700 font-medium">AI Translator</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-slate-700 leading-relaxed text-sm">
            Bridge language barriers effortlessly with our advanced AI. Get
            accurate, real-time translations from English to Waray-Waray
            instantly.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
            <Sparkles className="text-blue-600" size={18} />
            Key Features
          </h3>
          <div className="space-y-3">
            {[
              {
                emoji: "⚑",
                title: "Accurate Translations",
                desc: "Advanced AI technology ensures precision",
              },
              {
                emoji: "⚡",
                title: "Real-time Processing",
                desc: "Lightning-fast responses every time",
              },
              {
                emoji: "🌏",
                title: "Cultural Preservation",
                desc: "Keeping Waray-Waray language thriving",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-xl">{item.emoji}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 text-sm">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
