import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function HomePage() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, apptRes] = await Promise.all([
          axios.get("/api/v1/user/profile", { headers }),
          axios.get("/api/v1/appointment/my-appointments", { headers }),
        ]);

        if (userRes.data.success) setUser(userRes.data.data);
        if (apptRes.data.success) setAppointments(apptRes.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const pending  = appointments.filter((a) => a.status === "pending").length;
  const approved = appointments.filter((a) => a.status === "approved").length;
  const total    = appointments.length;

  // Show 3 most recent appointments on home
  const recent = appointments.slice(0, 3);

  return (
    <div className="page-wrapper">
      <Navbar user={user} />

      <div className="main-content">
        {/* Hero */}
        <div className="hero">
          <div className="hero-content">
            <h1>
              Your Health,<br />Our Priority 💙
            </h1>
            <p>
              Book appointments with trusted doctors in minutes.
              Manage your health journey all in one place.
            </p>
            <Link to="/doctors" className="btn">
              Find a Doctor →
            </Link>
          </div>
          <div className="hero-image">🩺</div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">📋</div>
            <div className="stat-info">
              <h4>{total}</h4>
              <p>Total Appointments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">⏳</div>
            <div className="stat-info">
              <h4>{pending}</h4>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div className="stat-info">
              <h4>{approved}</h4>
              <p>Confirmed</p>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Appointments</h3>
            <Link to="/dashboard" className="btn btn-outline" style={{ padding: "6px 14px", fontSize: "0.85rem" }}>
              View All
            </Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {recent.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h4>No appointments yet</h4>
                <p>Book your first doctor appointment today</p>
                <Link to="/doctors" className="btn btn-primary">
                  Browse Doctors
                </Link>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Specialization</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((appt) => (
                      <tr key={appt._id}>
                        <td>
                          <strong>
                            Dr. {appt.doctorInfo.firstName} {appt.doctorInfo.lastName}
                          </strong>
                        </td>
                        <td>{appt.doctorInfo.specialization}</td>
                        <td>{appt.date}</td>
                        <td>{appt.time}</td>
                        <td>
                          <span className={`badge badge-${appt.status}`}>
                            {appt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
          <Link to="/doctors" className="btn btn-primary">
            👨‍⚕️ Find Doctors
          </Link>
          <Link to="/dashboard" className="btn btn-outline">
            📋 All Appointments
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
