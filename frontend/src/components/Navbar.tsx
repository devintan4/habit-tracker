import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-primary font-semibold"
      : "text-gray-600 hover:text-primary";

  return (
    <nav className="bg-white shadow px-4 py-3 flex space-x-4">
      <NavLink to="/habits" className={linkClass}>
        Habits
      </NavLink>
      <NavLink to="/stats" className={linkClass}>
        Stats
      </NavLink>
    </nav>
  );
}
