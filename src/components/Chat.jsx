import { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { auth, logout } from "../Firebase";
import { useNavigate } from "react-router-dom";

const socket = useMemo(() => io("http://localhost:3001", { transports: ["websocket"] }), []);

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/");
      } else {
        setUser(currentUser);
        socket.emit("registerUser", currentUser.displayName);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    socket.on("updateUsers", (userList) => {
      if (auth.currentUser) {
        setUsers(userList.filter((u) => u.name !== auth.currentUser.displayName));
      }
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("updateUsers");
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;
    socket.emit("sendMessage", { message, to: selectedUser.id });
    setMessages((prev) => [...prev, { from: "Você", message }]);
    setMessage("");
  };

  return (
    <div>
      <h2>Bem-vindo(a), {user?.displayName}</h2>
      <button onClick={logout}>Sair</button>

      <h3>Usuários online:</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id} onClick={() => setSelectedUser(u)}>
            {u.name} {selectedUser?.id === u.id && "(Selecionado)"}
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
