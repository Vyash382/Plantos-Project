import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  LogIn,
  UserPlus,
  Info,
  BookOpen,
  Mail,
  CalendarCheck,
  PlusSquare,
  LogOut,
  Sprout,
  Bell,
  User,
} from "lucide-react";
import { useRecoilState } from "recoil";
import { userAtom } from "../Recoil/UserAtom";

export default function Navbar({ open, setOpen }) {
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white text-yellow-800 w-full shadow-md fixed top-0 z-50 rounded-b-xl border-b border-yellow-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center text-yellow-800 font-serif text-2xl font-bold hover:text-yellow-900 transition"
        >
          <Sprout className="w-7 h-7 mr-2 text-yellow-600" />
          Plantos
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <NavLink to="/garden" icon={<Home />} label="Garden" />
              <NavLink to="/add-plant" icon={<PlusSquare />} label="Add Plant" />
              <NavLink to="/schedule" icon={<CalendarCheck />} label="Schedule" />
              <NavLink to="/profile" icon={<User />} label="Profile" />
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 text-yellow-800 border border-yellow-400 bg-white hover:bg-yellow-100 px-3 py-1 rounded shadow"
              >
                <Bell className="w-5 h-5" /> Notifications
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-yellow-800 border border-yellow-400 bg-white hover:bg-yellow-100 px-3 py-1 rounded shadow"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" icon={<LogIn />} label="Login" />
              <NavLink to="/register" icon={<UserPlus />} label="Sign Up" />
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-yellow-800 text-2xl focus:outline-none"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-yellow-300 px-6 py-4 space-y-3">
          {user ? (
            <>
              <MobileLink to="/garden">🌱 Garden</MobileLink>
              <MobileLink to="/add-plant">➕ Add Plant</MobileLink>
              <MobileLink to="/schedule">📅 Schedule</MobileLink>
              <MobileLink to="/profile">👤 Profile</MobileLink>
              <button
                onClick={() => {
                  setOpen(!open);
                  setMenuOpen(false);
                }}
                className="w-full text-left text-yellow-800 border border-yellow-400 bg-white px-3 py-2 rounded shadow hover:bg-yellow-100"
              >
                🔔 Notifications
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left text-yellow-800 border border-yellow-400 bg-white px-3 py-2 rounded shadow hover:bg-yellow-100"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <MobileLink to="/login">🔐 Login</MobileLink>
              <MobileLink to="/register">📝 Sign Up</MobileLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1 hover:text-yellow-900 transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileLink({ to, children }) {
  return (
    <Link
      to={to}
      className="block w-full text-yellow-800 border border-yellow-400 bg-white px-3 py-2 rounded shadow hover:bg-yellow-100"
    >
      {children}
    </Link>
  );
}
