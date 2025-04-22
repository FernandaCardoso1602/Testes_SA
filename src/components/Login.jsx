import { useEffect, useState } from "react";
import { login } from "../Firebase";
import "./Login.css";

function Login() {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleLogin = async () => {
    const loggedInUser = await login();
    if (loggedInUser) {
      setUser(loggedInUser);
      setShowPopup(true);
      setTimeout(() => {
        window.location.href = "/"; // Redireciona ao site principal
      }, 2000);
    }
  };

  return (
    <div className="login-container">
      <h2>Bem-vindo ao Chat</h2>
      <button onClick={handleLogin}>Entrar com Google</button>
      {showPopup && (
        <div className="popup">
          <p>Login bem-sucedido! Redirecionando...</p>
        </div>
      )}
    </div>
  );
}

export default Login;