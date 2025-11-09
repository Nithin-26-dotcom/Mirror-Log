import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  MessageSquare,
  X,
  HelpCircle,
  AlertTriangle,
  Info,
  MapPin,
  RefreshCw,
  User,
} from "lucide-react";

// Predefined questions
const predefinedQuestions = [
  {
    id: 1,
    text: "What should I do during a hurricane?",
    icon: <AlertTriangle className="text-blue-600 w-4 h-4" />,
  },
  {
    id: 2,
    text: "How can I prepare an emergency kit?",
    icon: <Info className="text-blue-600 w-4 h-4" />,
  },
  {
    id: 3,
    text: "Where are the nearest evacuation centers?",
    icon: <MapPin className="text-blue-600 w-4 h-4" />,
  },
  {
    id: 4,
    text: "What are the signs of a tsunami?",
    icon: <AlertTriangle className="text-blue-600 w-4 h-4" />,
  },
  {
    id: 5,
    text: "How can I volunteer for disaster relief?",
    icon: <HelpCircle className="text-blue-600 w-4 h-4" />,
  },
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm DisasterSafe Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleDrawer = () => setOpen(!open);
  const handleInputChange = (e) => setInput(e.target.value);
  const formatTime = (d) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const clearChat = () =>
    setMessages([
      {
        id: 1,
        text: "👋 Hello! I'm DisasterSafe Assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);

  const handleSendMessage = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      const botMessage = {
        id: messages.length + 2,
        text: data.response || "⚠️ No response from AI",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "❌ Sorry, I couldn’t process your request. Try again.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => e.key === "Enter" && handleSendMessage();
  const handlePredefinedQuestion = (q) => {
    setInput(q);
    handleSendMessage(q);
  };

  return (
    <>
      {/* Floating button - Only show if the chat is not open */}
      {!open && (
        <button
          onClick={toggleDrawer}
          className="fixed bottom-5 right-5 z-50 rounded-full bg-blue-600 p-4 text-white shadow-xl hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Drawer */}
      {open && (
        <div className="fixed right-0 bottom-0 sm:bottom-auto sm:top-16 h-[75%] sm:h-[90%] w-full sm:w-96 bg-white shadow-2xl flex flex-col z-40 rounded-t-2xl sm:rounded-none animate-slideUp sm:animate-slideIn">
          {/* Header */}
          <div className="flex items-center justify-between bg-blue-600 text-white p-3 rounded-t-2xl sm:rounded-none">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-800 rounded-full p-2">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h2 className="font-semibold">DisasterSafe Assistant</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={clearChat} className="hover:text-gray-200">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button onClick={toggleDrawer} className="hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Body (Suggested Questions inside scrollable area at top) */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-100">
            {/* Suggested Questions */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">Suggested Questions:</p>
              <ul className="space-y-1">
                {predefinedQuestions.map((q) => (
                  <li
                    key={q.id}
                    onClick={() => handlePredefinedQuestion(q.text)}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition"
                  >
                    {q.icon}
                    <span className="text-sm truncate text-black">{q.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex mb-3 ${msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {msg.sender === "bot" && (
                  <div className="bg-blue-600 text-white rounded-full p-2 mr-2 h-8 w-8 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <div
                    className={`px-3 py-2 rounded-lg text-sm max-w-xs shadow ${msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                  >
                    {msg.text}
                  </div>
                  <p
                    className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-right" : "text-left"
                      } text-gray-400`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
                {msg.sender === "user" && (
                  <div className="bg-gray-300 text-gray-800 rounded-full p-2 ml-2 h-8 w-8 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center mb-2">
                <div className="bg-blue-600 text-white rounded-full p-2 mr-2 h-8 w-8 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="px-3 py-2 bg-white rounded-lg text-sm flex items-center gap-2 shadow">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent animate-spin rounded-full" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                style={{ color: "black" }}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || loading}
                className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-1">
              ⚡ Powered by Gemini AI • For emergencies, call 911
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;