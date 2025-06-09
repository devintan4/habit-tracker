import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const auth = useAuthStore((s) => s.isAuthenticated());
  return auth ? children : <Navigate to="/login" replace />;
}
