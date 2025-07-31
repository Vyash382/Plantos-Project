import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "../Recoil/UserAtom";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await axios.post("https://plantos-backend.onrender.com/api/user/login", {
      username,
      password,
    });

    if (response.data.type) {
      localStorage.setItem("token", response.data.token);
      setUser(username);
      alert("Login Successful");
      navigate("/");
    } else {
      alert(response.data.message);
    }
  };

  return (
    <div
      className="pt-24 w-full min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1492496913980-501348b61469?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="absolute inset-0 bg-white opacity-80"></div>

      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-2xl border border-yellow-200 p-8 backdrop-blur-sm mx-4">
        <h1 className="text-4xl font-extrabold text-yellow-800 text-center mb-4 font-serif tracking-wide drop-shadow-lg">
          🌿 Plantos
        </h1>
        <p className="text-yellow-700 text-center mb-6 italic text-sm sm:text-base">
          Care for your green friends
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-yellow-800 text-sm mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded bg-white border border-yellow-300 text-yellow-800 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="your_username"
            />
          </div>
          <div>
            <label className="block text-yellow-800 text-sm mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-white border border-yellow-300 text-yellow-800 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 transition duration-200 text-white p-3 rounded font-semibold shadow"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-yellow-700 text-sm mt-6">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="underline hover:text-yellow-800"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
