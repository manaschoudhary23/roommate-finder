import { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { UserContext } from "../UserContext";
import Picker from "emoji-picker-react";
import "../styles/Chat.css";

const socket = io("http://localhost:5000");

export default function Chat({ roomId, receiverName }) {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (!roomId) return;

    fetch(`http://localhost:5000/api/chat/${roomId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));

    const handleReceive = (msg) => {
      if (msg.listingId === roomId) {
        setMessages((prev) => [...prev, msg]);
        if (initialLoadDone.current) scrollToBottom();
      }
    };

    socket.on("receiveMessage", handleReceive);

    const delay = setTimeout(() => {
      initialLoadDone.current = true;
    }, 500);

    return () => {
      socket.off("receiveMessage", handleReceive);
      clearTimeout(delay);
      initialLoadDone.current = false;
    };
  }, [roomId]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const msgData = {
      listingId: roomId,
      sender: user.name,
      receiver: receiverName,
      message: newMessage,
    };

    fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msgData),
    })
      .then((res) => res.json())
      .then(() => {
        setMessages((prev) => [...prev, { ...msgData, timestamp: Date.now() }]);
        setNewMessage("");
        scrollToBottom();
      })
      .catch((err) => console.error("Error sending message:", err));
  };

  const onEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="chat-section shadow mt-4">
      <h5 className="bg-primary text-white text-center py-2 mb-0">💬 Chat</h5>

      <div className="chat-box">
        {messages.length === 0 ? (
          <p className="text-muted text-center">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.sender === user?.name ? "own" : ""
              }`}
            >
              <strong>{msg.sender}:</strong> <span>{msg.message}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {user ? (
        <div className="chat-input">
          <button
            className="emoji-btn"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            😊
          </button>

          <input
            type="text"
            className="form-control"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button className="btn btn-primary ms-2" onClick={sendMessage}>
            ➤
          </button>
        </div>
      ) : (
        <p className="text-center text-muted my-2">
          Login to participate in chat.
        </p>
      )}

      {showEmojiPicker && (
        <div className="emoji-picker">
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
}
