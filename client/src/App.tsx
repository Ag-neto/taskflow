import { useState } from "react";
import Login from "./Login";
import "./App.css";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  function logout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="logged-in">
      <h1 className="brand">TaskFlow</h1>
      <p>You are logged in. The board view comes next.</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}