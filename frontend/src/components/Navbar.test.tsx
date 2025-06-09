import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuthStore } from "../store/useAuthStore";

beforeEach(() => {
  useAuthStore.setState({ token: null, username: null });
});

describe("Navbar (unauthenticated)", () => {
  it("menampilkan link Login & Register", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });
});

describe("Navbar (authenticated)", () => {
  it("menampilkan Habits, Stats, Hello & Logout", () => {
    useAuthStore.setState({ token: "t", username: "u" });
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText("Habits")).toBeInTheDocument();
    expect(screen.getByText("Stats")).toBeInTheDocument();
    expect(screen.getByText("Hello, u")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
});
