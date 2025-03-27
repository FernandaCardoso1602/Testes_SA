import { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (!username.trim()) return; // Evita login sem nome
    onLogin(username); // Passa o nome para o chat
  };

  return (
    <div>
      <h2>Escolha seu nome</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Digite seu nome"
      />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
};

export default Login;
