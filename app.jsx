import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./colors.css";

function Message({ message }) {
  return (
    <div className="w-full rounded-xl bg-surface border-2 border-outline p-3">
      <div className="text-xs text-muted mb-1">
        {message.name}
      </div>
      <div>{message.message}</div>
    </div>
  );
}

function App() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const getMessages = async () => {
    const response = await fetch("/api/messages");
    const data = await response.json();

    setMessages(data);
  };

  const saveMessage = async () => {
    if (!text.trim()) return;

    await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Anonymous",
        message: text,
      }),
    });

    setText("");
    await getMessages();
  };

  useEffect(() => {
    getMessages();

    const interval = setInterval(getMessages, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen items-start justify-center bg-dark text-muted p-8">
      <div className="w-full max-w-[600px] flex flex-col gap-3">
        <div className="w-full rounded-xl bg-surface border-2 border-outline p-3">
          <input
            type="text"
            placeholder="Any thoughts..."
            className="outline-0 focus:outline-0 w-full mb-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div
            className="ml-auto px-2.25 py-1 w-fit rounded-lg bg-accent flex justify-center items-center text-dark text-sm cursor-pointer"
            onClick={saveMessage}
          >
            Save
          </div>
        </div>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);