import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { data } = await api.post("/users/login", { email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      if (data.userName) localStorage.setItem("userName", data.userName);

      toast.success("Login successful");
      navigate("/products");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-xl shadow p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <div>
          <label className="block text-sm mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white rounded py-2 disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center">
          Нет аккаунта? <Link to="/signup" className="underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;