import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuthStore } from "../store/useAuthStore";

describe("ProtectedRoute", () => {
  beforeEach(() => useAuthStore.setState({ token: null, username: null }));

  it("mengalihkan ke /login saat tidak terautentikasi", () => {
    render(
      <MemoryRouter initialEntries={["/secret"]}>
        <Routes>
          <Route path="/login" element={<div>LoginPage</div>} />
          <Route
            path="/secret"
            element={
              <ProtectedRoute>
                <div>Secret</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("LoginPage")).toBeInTheDocument();
  });

  it("menampilkan children saat terautentikasi", () => {
    useAuthStore.setState({ token: "xyz", username: "u" });
    render(
      <MemoryRouter initialEntries={["/secret"]}>
        <Routes>
          <Route
            path="/secret"
            element={
              <ProtectedRoute>
                <div>Secret</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Secret")).toBeInTheDocument();
  });
});
