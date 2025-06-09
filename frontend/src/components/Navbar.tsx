import { Link, useLocation, useNavigate } from "react-router-dom";
import { buttonVariants } from "./ui/button";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {
  const loc = useLocation().pathname;
  const isAuth = useAuthStore((s) => s.isAuthenticated());
  const logout = useAuthStore((s) => s.logout);
  const username = useAuthStore((s) => s.username);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="space-x-4">
        {isAuth && (
          <>
            <Link
              to="/habits"
              className={buttonVariants({
                variant: loc.startsWith("/habits") ? "default" : "ghost",
              })}
            >
              Habits
            </Link>
            <Link
              to="/stats"
              className={buttonVariants({
                variant: loc === "/stats" ? "default" : "ghost",
              })}
            >
              Stats
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {isAuth ? (
          <>
            <span className="text-gray-700">Hello, {username}</span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className={buttonVariants({ variant: "ghost" })}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={buttonVariants({
                variant: loc === "/login" ? "default" : "ghost",
              })}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={buttonVariants({
                variant: loc === "/register" ? "default" : "ghost",
              })}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
