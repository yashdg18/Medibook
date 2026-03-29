import { Link, useNavigate, useLocation } from "react-router-dom";

function DoctorNavbar({ doctor }) {
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    navigate("/doctor/login");
  };

  const isActive = (path) => location.pathname === path;

  const name = doctor
    ? `Dr. ${doctor.firstName} ${doctor.lastName}`
    : "Doctor";

  return (
    <nav className="navbar">
      <Link to="/doctor/dashboard" className="navbar-brand">
        <div className="logo-icon">🏥</div>
        <span>Medi<em>Book</em></span>
      </Link>

      <ul className="navbar-links">
        <li>
          <Link to="/doctor/dashboard"
            style={isActive("/doctor/dashboard") ? { background: "var(--primary-light)", color: "var(--primary)" } : {}}>
            🏠 Dashboard
          </Link>
        </li>
        <li>
          <Link to="/doctor/appointments"
            style={isActive("/doctor/appointments") ? { background: "var(--primary-light)", color: "var(--primary)" } : {}}>
            📋 Appointments
          </Link>
        </li>
        <li>
          <Link to="/doctor/profile"
            style={isActive("/doctor/profile") ? { background: "var(--primary-light)", color: "var(--primary)" } : {}}>
            👤 Profile
          </Link>
        </li>
      </ul>

      <div className="navbar-user">
        {/* Green badge to show this is a doctor */}
        <span style={{
          background: "#dcfce7", color: "#166534",
          padding: "3px 10px", borderRadius: 20,
          fontSize: "0.78rem", fontWeight: 700,
        }}>
          DOCTOR
        </span>
        <span className="user-name">{name}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default DoctorNavbar;
