"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

const SESSION_STORAGE_KEY = "marosko_chat_session_id";
const MAX_MESSAGE_LENGTH = 2000;

function getSessionId(): string {
  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;
  const id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  window.localStorage.setItem(SESSION_STORAGE_KEY, id);
  return id;
}

/** Renders **bold** text and bare URLs as safe React elements — no raw HTML injection. */
function formatBotMessage(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*)|(https?:\/\/[^\s<>)]+)/g;
  let lastIndex = 0;
  let key = 0;

  const pushPlain = (segment: string) => {
    segment.split("\n").forEach((line, i) => {
      if (i > 0) nodes.push(<br key={`br-${key++}`} />);
      if (line) nodes.push(<span key={`t-${key++}`}>{line}</span>);
    });
  };

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) pushPlain(text.slice(lastIndex, match.index));
    if (match[1]) {
      nodes.push(<strong key={`b-${key++}`}>{match[1].slice(2, -2)}</strong>);
    } else if (match[2]) {
      const cleanUrl = match[2].replace(/[)]+$/, "");
      nodes.push(
        <a
          key={`a-${key++}`}
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline break-all"
        >
          {cleanUrl}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }
  pushPlain(text.slice(lastIndex));
  return nodes;
}

export default function ChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: t("greeting") },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const message = input.trim();
    if (!message || message.length > MAX_MESSAGE_LENGTH || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, session_id: getSessionId(), locale }),
      });
      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [...prev, { role: "bot", text: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: t("errorGeneric", { error: data.error ?? "?" }) },
        ]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: t("errorNetwork") }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      {open && (
        <div className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] max-w-sm h-[500px] bg-white rounded-2xl shadow-2xl border border-amber-200 flex flex-col overflow-hidden">
          <div className="bg-amber-600 text-white px-4 py-3 flex items-center justify-between font-semibold">
            <span>{t("title")}</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="close"
              className="hover:opacity-80"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 bg-cream-50 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed break-words ${
                  m.role === "user"
                    ? "ml-auto bg-amber-600 text-white rounded-br-sm"
                    : "bg-white border border-amber-100 text-espresso-800 rounded-bl-sm"
                }`}
              >
                {m.role === "bot" ? formatBotMessage(m.text) : m.text}
              </div>
            ))}
            {loading && (
              <div className="flex gap-1 w-fit px-3 py-2 rounded-xl bg-white border border-amber-100">
                <span className="w-2 h-2 rounded-full bg-espresso-300 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-espresso-300 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-espresso-300 animate-bounce" />
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 p-3 border-t border-amber-100 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              maxLength={MAX_MESSAGE_LENGTH}
              className="flex-1 px-3 py-2 border border-espresso-200 rounded-full text-sm outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              {t("send")}
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("toggleLabel")}
        className="w-14 h-14 rounded-full bg-amber-600 text-white text-2xl shadow-lg hover:bg-amber-700 hover:scale-105 transition-all flex items-center justify-center"
      >
        {open ? "✕" : "?"}
      </button>
    </div>
  );
}
