import { Link, useLocation } from "react-router-dom";
import { buttonVariants } from "./ui/button";

export default function Navbar() {
  const loc = useLocation().pathname;
  return (
    <nav className="bg-white shadow px-6 py-4 flex space-x-4">
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
    </nav>
  );
}
