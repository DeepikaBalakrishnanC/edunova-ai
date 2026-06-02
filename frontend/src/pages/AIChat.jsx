import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

export default function AIChat() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello 👋 I am your AI learning assistant. Ask me anything.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // SEND MESSAGE
  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const currentMessage = message;

    // USER MESSAGE
    const userMessage = {
      sender: "user",
      text: currentMessage,
    };

    setMessages((prev) => [...prev, userMessage]);

    setMessage("");

    setLoading(true);

    try {
      const res = await api.post("/ai/chat/", {
        message: currentMessage,
      });

      const aiReply = {
        sender: "ai",
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error(err);

      const errorMessage = err.response?.data?.error
        || err.response?.data?.detail
        || (err.request
          ? "The learning assistant service is unavailable. Please try again shortly."
          : "Something went wrong. Please try again.");

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            AI Learning Assistant
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Ask coding doubts, course questions, and get AI explanations instantly.
          </p>
        </div>

        {/* CHAT CONTAINER */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl h-[70vh] flex flex-col">
          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-6 py-4 rounded-3xl text-lg ${
                    msg.sender === "user"
                      ? "bg-blue-600"
                      : "bg-slate-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* LOADING */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 px-6 py-4 rounded-3xl">
                  <div className="flex gap-2">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce delay-100">•</span>
                    <span className="animate-bounce delay-200">•</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* INPUT AREA */}
          <div className="border-t border-slate-800 p-5 flex gap-4">
            <input
              type="text"
              placeholder="Ask your doubt..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-slate-800 p-4 rounded-2xl outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 transition px-8 rounded-2xl"
            >
              {loading ? "Sending" : "Send"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}