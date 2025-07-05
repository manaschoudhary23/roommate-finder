import Chat from "./Chat";
import "../styles/ChatWindow.css";

export default function ChatWindow({ roomId, receiverName, onClose }) {
  return (
    <div className="chat-popup-wrapper"> 
      <button className="close-btn" onClick={onClose}>X</button>
      <Chat roomId={roomId} receiverName={receiverName} />
    </div>
  );
}
