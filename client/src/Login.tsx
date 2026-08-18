import { useState } from "react";
import api from "./api";

interface Props {
  onLogin: () => void;
}

export default function Login({ onLogin }: Props) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const path = isRegister ? "/auth/register" : "/auth/login";
      const body = isRegister ? { email, password, name } : { email, password };
      const res = await api.post(path, body);
      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="brand">TaskFlow</h1>
        <h2>{isRegister ? "Create account" : "Welcome back"}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">{isRegister ? "Sign up" : "Log in"}</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="switch">
          {isRegister ? "Already have an account? " : "No account yet? "}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Log in" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}