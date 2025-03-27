import { useState } from "react";
import Chat from "./components/Chat";

export default function App() {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (username.trim()) {
      setLoggedIn(true);
    }
  };

  return (
    <div>
      {!loggedIn ? (
        <div className="login-container">
          <h2>Escolha seu nome</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu nome..."
          />
          <button onClick={handleLogin}>Entrar</button>
        </div>
      ) : (
        <Chat username={username} />
      )}
    </div>
  );
}
