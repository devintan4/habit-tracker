import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HabitsPage from "./pages/HabitsPage";
import HabitDetailPage from "./pages/HabitDetailPage";
import StatsPage from "./pages/StatsPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/habits" replace />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/habits/:id" element={<HabitDetailPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>
    </div>
  );
}
