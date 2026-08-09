"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { getSuggestedQuestions } from "@/lib/plant-assistant";
import type { AssistantMessage } from "@/types/assistant";

type PlantAssistantProps = {
  slug: string;
  commonName: string;
  scientificName: string;
  medicinal?: boolean;
};

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ fontWeight: 700, color: "#1e2b1f" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <br key={i} />;

    const linkMatch = trimmed.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isExternal = href.startsWith("http");
      if (isExternal) {
        return (
          <p key={i} style={{ margin: "0 0 8px", lineHeight: 1.55 }}>
            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#2e6b3a", fontWeight: 600 }}>
              {label}
            </a>
          </p>
        );
      }
      return (
        <p key={i} style={{ margin: "0 0 8px", lineHeight: 1.55 }}>
          <Link href={href} style={{ color: "#2e6b3a", fontWeight: 600, textDecoration: "none" }}>
            {label}
          </Link>
        </p>
      );
    }

    if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
      return (
        <p key={i} style={{ margin: "0 0 6px", paddingLeft: 4, lineHeight: 1.55 }}>
          {renderInline(trimmed)}
        </p>
      );
    }

    if (trimmed.startsWith("_") && trimmed.endsWith("_")) {
      return (
        <p key={i} style={{ margin: "8px 0 0", fontSize: 12.5, color: "#8a9682", fontStyle: "italic", lineHeight: 1.45 }}>
          {trimmed.slice(1, -1)}
        </p>
      );
    }

    return (
      <p key={i} style={{ margin: "0 0 8px", lineHeight: 1.55 }}>
        {renderInline(trimmed)}
      </p>
    );
  });
}

function LeafSparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M12 2v2" />
      <path d="m19 5-1.5 1.5" />
    </svg>
  );
}

export function PlantAssistant({ slug, commonName, scientificName, medicinal }: PlantAssistantProps) {
  const suggested = getSuggestedQuestions({ commonName, medicinal });
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"openai" | "local" | null>(null);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      role: "assistant",
      content: `Hello! I'm **UniFlora AI**. Ask me anything about **${commonName}** (*${scientificName}*) — identification tips, flowering season, uses, campus locations, or taxonomy.`,
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: AssistantMessage = { role: "user", content: trimmed };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, messages: nextMessages }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error || "Request failed");
        }

        const data = (await res.json()) as { message: string; source: "openai" | "local" };
        setSource(data.source);
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I couldn't process that question right now. Please try again in a moment.",
          },
        ]);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [loading, messages, slug],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const panel = (
    <div
      id="uf-plant-assistant"
      style={{
        background: "#fff",
        border: "1px solid #e6e1cf",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: open ? "0 12px 40px rgba(14,42,23,.12)" : "none",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg,#12341f,#1a4a2c)",
          color: "#fff",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(127,191,107,.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#a7d493",
              flexShrink: 0,
            }}
          >
            <LeafSparkleIcon />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>UniFlora AI Assistant</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.75)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Ask about {commonName}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="uf-assistant-body"
          style={{
            background: "rgba(255,255,255,.12)",
            border: "1px solid rgba(255,255,255,.2)",
            color: "#fff",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            flexShrink: 0,
          }}
        >
          {open ? "Minimize" : "Open chat"}
        </button>
      </div>

      {open && (
        <div id="uf-assistant-body">
          <div
            ref={scrollRef}
            style={{
              height: "clamp(280px, 45vh, 380px)",
              overflowY: "auto",
              padding: "18px 16px",
              background: "#fbf9f1",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "92%",
                  background: msg.role === "user" ? "#2e6b3a" : "#fff",
                  color: msg.role === "user" ? "#fff" : "#33402f",
                  padding: "12px 14px",
                  borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  border: msg.role === "user" ? "none" : "1px solid #e6e1cf",
                  fontSize: 14.5,
                }}
              >
                {msg.role === "assistant" ? renderMarkdown(msg.content) : <p style={{ margin: 0, lineHeight: 1.5 }}>{msg.content}</p>}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", background: "#fff", border: "1px solid #e6e1cf", padding: "12px 16px", borderRadius: "14px 14px 14px 4px", fontSize: 14, color: "#8a9682" }}>
                <span className="uf-assistant-typing">Thinking</span>
              </div>
            )}
          </div>

          <div style={{ padding: "12px 16px", borderTop: "1px solid #e6e1cf", background: "#fff" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {suggested.slice(0, 4).map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={loading}
                  onClick={() => void sendMessage(q)}
                  style={{
                    background: "#eef0e2",
                    border: "1px solid #e0e2cf",
                    borderRadius: 999,
                    padding: "6px 12px",
                    fontSize: 12.5,
                    color: "#3f4a3a",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendMessage(input);
                  }
                }}
                placeholder={`Ask about ${commonName}…`}
                rows={1}
                disabled={loading}
                style={{
                  flex: 1,
                  resize: "none",
                  border: "1px solid #e6e1cf",
                  borderRadius: 10,
                  padding: "11px 14px",
                  fontSize: 14.5,
                  fontFamily: "inherit",
                  lineHeight: 1.4,
                  minHeight: 44,
                  outline: "none",
                  background: "#fbf9f1",
                }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  background: loading || !input.trim() ? "#a8c4a0" : "#2e6b3a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "11px 18px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  flexShrink: 0,
                }}
              >
                Send
              </button>
            </form>

            <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "#8a9682", lineHeight: 1.4 }}>
              {source === "openai"
                ? "Powered by UniFlora AI · Answers grounded in campus species data."
                : "Powered by UniFlora knowledge base · Add OPENAI_API_KEY for enhanced AI responses."}
              {" "}Not medical advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div style={{ marginTop: 30 }}>{panel}</div>

      {!open && (
        <button
          type="button"
          className="uf-assistant-fab"
          onClick={() => {
            setOpen(true);
            setTimeout(() => document.getElementById("uf-plant-assistant")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
          }}
          aria-label="Open AI assistant"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 900,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(145deg,#2e6b3a,#1a4a2c)",
            color: "#fff",
            border: "2px solid rgba(255,255,255,.3)",
            boxShadow: "0 8px 24px rgba(14,42,23,.35)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LeafSparkleIcon />
        </button>
      )}
    </>
  );
}
