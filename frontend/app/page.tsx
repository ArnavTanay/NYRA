"use client";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = { role: "user", content: input };
  const updatedMessages = [...messages, userMessage];

  setMessages(updatedMessages);
  setInput("");

  const res = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: updatedMessages }),
  });

  const data = await res.json();
  setMessages([...updatedMessages, { role: "assistant", content: data.response }]);
};

  return (
    <div className="flex h-screen bg-[#0d0d14] text-[#e2e2f0] overflow-hidden" style={{fontFamily:"'Plus Jakarta Sans', sans-serif"}}>
    {/* Sidebar */}
<div className="w-[220px] bg-[#0f0f1a] border-r border-[#1a1a2a] flex flex-col flex-shrink-0">

  {/* Logo */}
  <div className="p-6 pb-5">
    <div className="text-[22px] font-semibold text-[#c4a8f5] tracking-tight">✦ NYRA</div>
    <div className="text-[11px] text-[#3a3a55] mt-1">your companion</div>
  </div>

  {/* Nav */}
  <div className="flex flex-col gap-1 px-3">
    {[
      { label: "Chat", icon: "💬" },
      { label: "Memories", icon: "🤍" },
      { label: "Goals", icon: "🎯" },
      { label: "Journal", icon: "📓" },
      { label: "Settings", icon: "⚙️" },
    ].map((item) => (
      <div key={item.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] cursor-pointer ${item.label === "Chat" ? "bg-[#1c1828] text-[#c4a8f5]" : "text-[#4a4a68]"}`}>
        <span>{item.icon}</span>
        <span>{item.label}</span>
      </div>
    ))}
  </div>

  {/* Footer */}
  <div className="mt-auto px-5 py-4 border-t border-[#16162a] flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-[#1c1828] border border-[#2e2a48] flex items-center justify-center text-[12px] text-[#a78bdc] font-medium flex-shrink-0">A</div>
    <div>
      <div className="text-[13px] text-[#d0d0e8] font-medium">Arnav</div>
      <div className="text-[11px] text-[#3a3a55]">free plan</div>
    </div>
  </div>

</div>
{/* Main */}
<div className="flex-1 flex flex-col min-w-0">

  {/* Top bar */}
  <div className="px-6 py-5 border-b border-[#13131f] flex items-start justify-between">
    <div>
      <div className="text-[20px] font-semibold text-[#e8e8f5] tracking-tight">Good evening, Arnav</div>
      <div className="text-[12.5px] text-[#3e3e60] mt-1">I'm NYRA, nice to see you again.</div>
    </div>
    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2a40] text-[12px] text-[#7c5cbf] bg-[#13131f] cursor-pointer">
      ✦ Today's reflection
    </div>
  </div>

  {/* Messages */}
  <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
    {messages.map((msg, i) => (
      <div key={i} className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
        <div className={`max-w-[60%] px-4 py-3 text-[13.5px] leading-relaxed ${msg.role === "user" ? "bg-[#3d2a6e] border border-[#4e3880] text-[#ede0ff] rounded-[16px_4px_16px_16px]" : "bg-[#15151f] border border-[#1e1e2e] text-[#c8c8e0] rounded-[4px_16px_16px_16px]"}`}>
          {msg.content}
        </div>
      </div>
    ))}
  </div>

  {/* Chips */}
  <div className="px-6 py-2 flex gap-2 overflow-x-auto border-t border-[#13131f]">
    {["motivate me", "something fun", "how do you see me?", "check my goals"].map((chip) => (
      <div key={chip} className="px-4 py-1.5 rounded-full border border-[#1e1e30] text-[12px] text-[#4a4a68] bg-[#0f0f1a] whitespace-nowrap cursor-pointer">
        {chip}
      </div>
    ))}
  </div>

  {/* Input */}
  <div className="px-6 pt-3 pb-2 border-t border-[#13131f] flex items-center gap-3">
    <input
      className="flex-1 bg-[#13131f] border border-[#1e1e2e] rounded-full px-5 py-3 text-[13.5px] text-[#e2e2f0] outline-none placeholder-[#2a2a42]"
      placeholder="Talk to NYRA..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
    <button onClick={sendMessage} className="w-[42px] h-[42px] rounded-full bg-[#3d2a6e] border border-[#4e3880] flex items-center justify-center text-[#d4b8ff] flex-shrink-0">
      ➤
    </button>
  </div>
  <div className="text-center text-[11px] text-[#1e1e32] pb-3">NYRA remembers so you don't have to. 💜</div>

</div>

    </div>
  );
}