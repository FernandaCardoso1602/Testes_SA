import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Chat.css";

const socket = io("http://localhost:3001", {
  transports: ["websocket"], // Garante que usa WebSockets
  reconnectionAttempts: 5, // Tenta se reconectar
  reconnectionDelay: 1000, // Tempo entre tentativas
});

function Chat({ username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!username) return;

    socket.emit("registerUser", username);

    socket.on("updateUsers", (userList) => {
      console.log("Lista de usuários atualizada:", userList);
      setUsers(userList.filter((user) => user.name !== username));
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("updateUsers");
      socket.off("receiveMessage");
    };
  }, [username]);

  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    const msgData = { message, to: selectedUser.id };
    socket.emit("sendMessage", msgData);

    setMessages((prevMessages) => [...prevMessages, { from: "Você", message }]);
    setMessage("");
  };

  return (
    <div>
      <h2>Bem-vindo(a), {username}</h2>
      <h3>Usuários online:</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => setSelectedUser(user)}>
            {user.name} {selectedUser?.id === user.id && "(Selecionado)"}
          </li>
        ))}
      </ul>

      <h3>Chat</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.from}:</strong> {msg.message}
          </li>
        ))}
      </ul>

      <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Digite sua mensagem" />
      <button disabled={!selectedUser} onClick={sendMessage}>
        Enviar
      </button>
    </div>
  );
}

export default Chat;
