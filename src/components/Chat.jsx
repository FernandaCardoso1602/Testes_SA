import { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Chat.css";
import { FaPaperPlane } from "react-icons/fa";

const socket = io("http://localhost:3001");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("update_users", (data) => {
      setUsers(data);
    });

    return () => {
      socket.off("receive_message");
      socket.off("update_users");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", { text: message, user: "Nanda" });
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chat</div>
      <div className="chat-users">
        <h3>Usuários Online</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.name}</li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.user === "Nanda" ? "user" : "other"}`}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;