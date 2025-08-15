"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  time?: string;
};

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      role: "assistant",
      text: "Hello — I\u2019m your assistant. Ask me anything.",
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // auto-scroll to bottom when messages change
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setError(null);

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      time: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // This project has a simple example GET handler at /api/chat that returns example data.
      // We call it and then synthesize a short assistant reply from the returned JSON.
      const res = await fetch("/api/chat");
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();

      // Create a fallback reply from the example data.
      const first = Array.isArray(data) && data.length > 0 ? data[0] : null;
      const replyText = first?.description
        ? first.description
        : typeof data === "string"
        ? data
        : "I couldn't generate a reply from the server example."
        ;

      const assistantMessage: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: replyText,
        time: new Date().toLocaleTimeString(),
      };

      // Append assistant reply
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setMessages(prev => [
        ...prev,
        {
          id: `a-err-${Date.now()}`,
          role: "assistant",
          text: "Sorry, I couldn't reach the server. Try again.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "m-1",
        role: "assistant",
        text: "Hello — I\u2019m your assistant. Ask me anything.",
        time: new Date().toLocaleTimeString(),
      },
    ]);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-[#02102e] to-black p-6 md:p-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Card className="bg-[rgba(8,12,20,0.6)] border-transparent backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                Chat
              </CardTitle>
              <div className="text-sm text-slate-300/80 mt-1">Talk to the assistant — replies are generated from the local example endpoint.</div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex h-[60vh] max-h-[70vh] flex-col gap-4 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="flex flex-col gap-4">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex items-start ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                            : "bg-[rgba(255,255,255,0.03)] text-slate-200 border border-slate-800"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                        <div className="mt-1 text-[11px] opacity-50 text-right">{msg.time}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>
              </div>

              <div className="border-t border-slate-800 p-4">
                <div className="flex items-center gap-3">
                  <Input
                    className="bg-[#071126] text-white placeholder:text-slate-400"
                    placeholder={loading ? "Waiting for reply..." : "Type a message and press Enter"}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                  />
                  <Button onClick={sendMessage} disabled={loading || !input.trim()}>
                    {loading ? "Sending..." : "Send"}
                  </Button>
                  <Button variant="ghost" onClick={clearChat}>
                    Clear
                  </Button>
                </div>
                {error && (
                  <div className="mt-2 text-sm text-red-400">{error}</div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="text-sm text-muted-foreground">
              This demo uses the local <code className="rounded bg-muted px-1 py-[2px]">/api/chat</code> example
              endpoint for replies.
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
