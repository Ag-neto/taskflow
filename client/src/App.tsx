import { useState } from "react";
import Login from "./Login";
import BoardView from "./BoardView";
import "./App.css";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  function logout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;
  return <BoardView onLogout={logout} />;
}