import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    try {
      const api_url = process.env.REACT_APP_API_URL;
      const url = `${api_url}/users/login`;
      // call your login API here
      const user = { username, password };
      const response = await axios.post(url, user);

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/"); // Home page
      }
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.error_msg;

        if (status === 403) {
          window.alert(message);
        } else if (status === 400) {
          window.alert("Invalid username or password");
        } else {
          window.alert(message || "Something went wrong");
        }
      }
      // No response from server
      else {
        window.alert("Server not reachable. Try again later.");
      }
    }
  };

  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
          <p className="mt-2 text-sm text-gray-500">Login to continue</p>
        </div>

        {/* username */}
        <div className="mb-5">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="username"
            required
            placeholder="enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                       focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                       focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white
                     hover:bg-blue-700 active:scale-[0.98] transition-all duration-200">
          Sign In
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?
          <span className="ml-1 cursor-pointer font-medium text-blue-600 hover:underline">
            <Link to="/create-account">Sign up</Link>
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
