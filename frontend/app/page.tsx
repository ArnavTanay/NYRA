"use client";
import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showBgPanel, setShowBgPanel] = useState(false);
  const [bgStyle, setBgStyle] = useState({ type: "color", value: "#0d0d14" });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    const content = text || input;
    if (!content.trim() || isTyping) return;

    const userMessage = { role: "user", content };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, user_id: userId }),
      });
      const data = await res.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.response }]);
    } catch (e) {
      setMessages([...updatedMessages, { role: "assistant", content: "Something went wrong. Try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBgStyle({ type: "image", value: url });
    setShowBgPanel(false);
  };

  const bgCSS = bgStyle.type === "image"
    ? { backgroundImage: `url(${bgStyle.value})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { backgroundColor: bgStyle.value };

  const presetColors = ["#0d0d14", "#0a0a0f", "#0f0a1a", "#050510", "#0a1020", "#0d1410"];

  return (
    <div className="flex h-screen overflow-hidden text-[#e2e2f0]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", ...bgCSS }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }
        @keyframes sidebarIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .message-enter { animation: fadeSlideIn 0.25s ease forwards; }
        .sidebar-enter { animation: sidebarIn 0.2s ease forwards; }
        .dot {
          display: inline-block; width: 6px; height: 6px;
          border-radius: 50%; background: #7c5cbf; margin: 0 2px;
          animation: blink 1.4s infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        textarea::-webkit-scrollbar { display: none; }
        .bg-glass { background: rgba(13,13,20,0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        .bg-glass-light { background: rgba(15,15,26,0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
      `}</style>

      {/* Toggle button — always visible */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-5 left-4 z-50 w-7 h-7 flex flex-col items-center justify-center gap-[5px] cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <span className="block w-5 h-[1.5px] bg-[#4a4a68] rounded transition-all" style={sidebarOpen ? { transform: "rotate(45deg) translate(4px, 4px)" } : {}}></span>
        <span className="block h-[1.5px] bg-[#4a4a68] rounded transition-all" style={sidebarOpen ? { width: 0, opacity: 0 } : { width: "14px" }}></span>
        <span className="block w-5 h-[1.5px] bg-[#4a4a68] rounded transition-all" style={sidebarOpen ? { transform: "rotate(-45deg) translate(4px, -4px)" } : {}}></span>
      </button>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="sidebar-enter w-[220px] flex flex-col flex-shrink-0 border-r border-[#1a1a2a] relative overflow-hidden" style={{ minHeight: "100vh" }}>
          {/* Background image */}
          <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/sidebar.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
          {/* Dark overlay */}
          <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to bottom, rgba(8,6,20,0.55) 0%, rgba(8,6,20,0.82) 60%, rgba(8,6,20,0.97) 100%)" }} />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            <div className="p-6 pb-5 mt-8">
              <div className="text-[22px] font-semibold text-[#c4a8f5] tracking-tight">✦ NYRA</div>
              <div className="text-[11px] text-[#7a6a99] mt-1">your companion</div>
            </div>

            <div className="flex flex-col gap-1 px-3">
              {[
                { label: "Chat", icon: "💬" },
                { label: "Memories", icon: "🤍" },
                { label: "Goals", icon: "🎯" },
                { label: "Journal", icon: "📓" },
                { label: "Settings", icon: "⚙️" },
              ].map((item) => (
                <div key={item.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] cursor-pointer transition-colors ${item.label === "Chat" ? "bg-[rgba(61,42,110,0.5)] text-[#c4a8f5] border border-[rgba(78,56,128,0.4)]" : "text-[#8a7aaa] hover:text-[#c4a8f5] hover:bg-[rgba(61,42,110,0.3)]"}`}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto px-5 py-4 border-t border-[rgba(255,255,255,0.06)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[rgba(61,42,110,0.6)] border border-[#2e2a48] flex items-center justify-center text-[12px] text-[#a78bdc] font-medium flex-shrink-0">A</div>
              <div>
                <div className="text-[13px] text-[#d0d0e8] font-medium">Arnav</div>
                <div className="text-[11px] text-[#7a6a99]">free plan</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 bg-glass">

        {/* Top bar */}
        <div className="px-6 py-5 border-b border-[#13131f] flex items-start justify-between" style={{ paddingLeft: sidebarOpen ? "24px" : "48px" }}>
          <div>
            <div className="text-[20px] font-semibold text-[#e8e8f5] tracking-tight">{greeting}, Arnav</div>
            <div className="text-[12.5px] text-[#3e3e60] mt-1">I'm NYRA, nice to see you again.</div>
          </div>
          <div className="flex items-center gap-2">
            {/* Background customizer button */}
            <button
              onClick={() => setShowBgPanel(!showBgPanel)}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#2a2a40] text-[12px] text-[#4a4a68] bg-[rgba(13,13,20,0.6)] cursor-pointer hover:border-[#3d2a6e] hover:text-[#7c5cbf] transition-colors"
              title="Customize background"
            >
              🎨
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2a40] text-[12px] text-[#7c5cbf] bg-[rgba(13,13,20,0.6)] cursor-pointer hover:border-[#3d2a6e] transition-colors">
              ✦ Today's reflection
            </div>
          </div>
        </div>

        {/* Background panel */}
        {showBgPanel && (
          <div className="message-enter mx-6 mt-4 p-4 rounded-2xl border border-[#1e1e2e] bg-[rgba(13,13,20,0.9)]">
            <div className="text-[12px] text-[#4a4a68] mb-3">Background</div>
            <div className="flex items-center gap-2 flex-wrap">
              {presetColors.map((c) => (
                <button
                  key={c}
                  onClick={() => { setBgStyle({ type: "color", value: c }); setShowBgPanel(false); }}
                  className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                  style={{ backgroundColor: c, borderColor: bgStyle.value === c ? "#c4a8f5" : "#2a2a40" }}
                />
              ))}
              {/* Custom color picker */}
              <label className="w-7 h-7 rounded-full border-2 border-[#2a2a40] flex items-center justify-center cursor-pointer hover:border-[#c4a8f5] overflow-hidden" title="Pick color">
                <input type="color" className="opacity-0 absolute w-0 h-0" onChange={(e) => setBgStyle({ type: "color", value: e.target.value })} />
                <span className="text-[14px]">🎨</span>
              </label>
              {/* Image upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 rounded-full border border-[#2a2a40] text-[11px] text-[#4a4a68] hover:border-[#c4a8f5] hover:text-[#c4a8f5] transition-colors"
              >
                Upload image
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              {/* Reset */}
              <button
                onClick={() => { setBgStyle({ type: "color", value: "#0d0d14" }); setShowBgPanel(false); }}
                className="px-3 py-1 rounded-full border border-[#2a2a40] text-[11px] text-[#4a4a68] hover:border-[#c4a8f5] hover:text-[#c4a8f5] transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-40 mt-20">
              <div className="text-[32px]">✦</div>
              <div className="text-[14px] text-[#4a4a68]">NYRA is here. Say something.</div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`message-enter flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`max-w-[60%] px-4 py-3 text-[13.5px] leading-relaxed ${msg.role === "user" ? "bg-[rgba(61,42,110,0.8)] border border-[#4e3880] text-[#ede0ff] rounded-[16px_4px_16px_16px]" : "bg-glass-light border border-[#1e1e2e] text-[#c8c8e0] rounded-[4px_16px_16px_16px]"}`}
                style={{ whiteSpace: "pre-wrap" }}>
                {msg.content}
              </div>
              <div className="text-[10px] text-[#2a2a42] px-1">{formatTime()}</div>
            </div>
          ))}
          {isTyping && (
            <div className="message-enter flex flex-col gap-1 items-start">
              <div className="bg-glass-light border border-[#1e1e2e] rounded-[4px_16px_16px_16px] px-4 py-3 flex items-center gap-1">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chips */}
        <div className="px-6 py-2 flex gap-2 overflow-x-auto border-t border-[#13131f]">
          {["motivate me", "something fun", "how do you see me?", "check my goals"].map((chip) => (
            <div key={chip} onClick={() => sendMessage(chip)} className="px-4 py-1.5 rounded-full border border-[#1e1e30] text-[12px] text-[#4a4a68] bg-[rgba(13,13,20,0.5)] whitespace-nowrap cursor-pointer hover:border-[#3d2a6e] hover:text-[#7c5cbf] transition-colors">
              {chip}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-6 pt-3 pb-2 border-t border-[#13131f] flex items-end gap-3">
          <textarea
            className="flex-1 bg-[rgba(19,19,31,0.8)] border border-[#1e1e2e] rounded-2xl px-5 py-3 text-[13.5px] text-[#e2e2f0] outline-none placeholder-[#2a2a42] resize-none overflow-hidden"
            placeholder="Talk to NYRA..."
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isTyping || !input.trim()}
            className="w-[42px] h-[42px] rounded-full bg-[#3d2a6e] border border-[#4e3880] flex items-center justify-center text-[#d4b8ff] flex-shrink-0 transition-opacity disabled:opacity-30 hover:bg-[#4e3880]">
            ➤
          </button>
        </div>
        <div className="text-center text-[11px] text-[#1e1e32] pb-3">NYRA remembers so you don't have to. 💜</div>
      </div>
    </div>
  );
}
