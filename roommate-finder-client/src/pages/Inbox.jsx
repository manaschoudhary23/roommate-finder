import { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { io } from "socket.io-client";
import ChatWindow from "./ChatWindow";
import "../styles/Inbox.css";

const socket = io("http://localhost:5000");

export default function Inbox() {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [chatPopup, setChatPopup] = useState(null);
  const [receiverName, setReceiverName] = useState("");

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/api/bookings/owner/${user._id}`)
      .then((res) => res.json())
      .then(setBookings);

    fetch(`http://localhost:5000/api/chat/inbox/${user.name}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        const unread = data.filter((m) => m.isRead === false).length;
        setUnreadCount(unread);
      });

    socket.on("new-message", (msg) => {
      if (msg.receiver === user.name || msg.sender === user.name) {
        const chatItem = {
          listingId: msg.listingId,
          sender: msg.sender,
          receiver: msg.receiver,
          lastMessage: msg.message,
          timestamp: msg.timestamp,
          isRead: false,
        };
        setMessages((prev) => [chatItem, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => socket.disconnect();
  }, [user]);

  const handleBookingResponse = (bookingId, status) => {
    fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setBookings((prev) =>
          prev.map((b) => (b._id === updated._id ? updated : b))
        );
      });
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return m.isRead === false;
    return true;
  });

  if (!user) return <p>Please login to view Inbox.</p>;

  return (
    <div className="inbox-container">
      <h2>
        📥 Inbox {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </h2>

      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("messages")}>Messages</button>
        <button onClick={() => setFilter("unread")}>Unread</button>
      </div>

      <div className="section">
        <h4>Booking Requests</h4>
        {bookings.map((b) => (
          <div key={b._id} className="item">
            <p>
              <strong>{b.requester?.name || "User"}</strong> requested <em>{b.listing?.title}</em>
            </p>
            <p>Status: {b.status}</p>
            {b.status === "pending" && (
              <div>
                <button onClick={() => handleBookingResponse(b._id, "accepted")}>
                  Accept
                </button>
                <button onClick={() => handleBookingResponse(b._id, "rejected")}>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="section">
        <h4>Messages</h4>
        {filteredMessages.map((m) => (
          <div key={m.listingId} className="item">
            <p>
              <strong>{m.sender === user.name ? m.receiver : m.sender}</strong>: {m.lastMessage}
            </p>
            {!m.isRead && <span className="unread-dot"></span>}
            <button
              onClick={() => {
                setChatPopup(m.listingId);
                setReceiverName(m.sender === user.name ? m.receiver : m.sender);
                fetch(`http://localhost:5000/api/chat/${m._id}/read`, { method: "PUT" });
                setUnreadCount((c) => Math.max(c - 1, 0));
              }}
            >
              Reply
            </button>
          </div>
        ))}
      </div>

      {chatPopup && (
        <ChatWindow
          roomId={chatPopup}
          receiverName={receiverName}
          onClose={() => setChatPopup(null)}
        />
      )}
    </div>
  );
}
