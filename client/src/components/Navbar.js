import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link to="/" className="navbar-brand">
        <div className="logo-icon">🏥</div>
        <span>Medi<em>Book</em></span>
      </Link>

      {/* Navigation links */}
      <ul className="navbar-links">
        <li>
          <Link
            to="/"
            style={isActive("/") ? { background: "var(--primary-light)", color: "var(--primary)" } : {}}
          >
            🏠 Home
          </Link>
        </li>
        <li>
          <Link
            to="/doctors"
            style={isActive("/doctors") ? { background: "var(--primary-light)", color: "var(--primary)" } : {}}
          >
            👨‍⚕️ Doctors
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard"
            style={isActive("/dashboard") ? { background: "var(--primary-light)", color: "var(--primary)" } : {}}
          >
            📋 My Appointments
          </Link>
        </li>
      </ul>

      {/* User section */}
      <div className="navbar-user">
        {user && <span className="user-name">Hi, {user.name?.split(" ")[0]} 👋</span>}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
