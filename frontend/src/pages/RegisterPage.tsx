import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await register(username, password);
    if (ok) {
      await Swal.fire({
        icon: "success",
        title: "Register berhasil!",
        text: "Akun Anda telah dibuat. Silakan login.",
        confirmButtonText: "OK",
      });
      navigate("/login");
    } else {
      Swal.fire({
        icon: "error",
        title: "Gagal mendaftar",
        text: "Username sudah dipakai",
        confirmButtonText: "OK",
      });
      setError("Username sudah dipakai");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold">Register</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <button className="w-full bg-primary text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
