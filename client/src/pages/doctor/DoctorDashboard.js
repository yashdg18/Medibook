import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DoctorNavbar from "../../components/DoctorNavbar";

function DoctorDashboard() {
  const [doctor,       setDoctor]       = useState(null);
  const [stats,        setStats]        = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [recent,       setRecent]       = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("doctorToken");
        const res   = await axios.get("/api/v1/doctor/doctor-info/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setDoctor(res.data.data.doctor);
          setStats(res.data.data.stats);
          setRecent(res.data.data.appointments);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <DoctorNavbar doctor={doctor} />

      <div className="main-content">
        {/* Welcome hero */}
        <div className="hero" style={{ background: "linear-gradient(135deg, #059669 0%, #047857 100%)" }}>
          <div className="hero-content">
            <h1>
              Welcome back,<br />
              Dr. {doctor?.firstName} 👋
            </h1>
            <p>
              {doctor?.specialization} · {doctor?.experience} years experience<br />
              {doctor?.address}
            </p>
            <Link to="/doctor/appointments" className="btn">
              View Appointments →
            </Link>
          </div>
          <div className="hero-image">🩺</div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">📋</div>
            <div className="stat-info">
              <h4>{stats.total}</h4>
              <p>Total Appointments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">⏳</div>
            <div className="stat-info">
              <h4>{stats.pending}</h4>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div className="stat-info">
              <h4>{stats.approved}</h4>
              <p>Approved</p>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Appointments</h3>
            <Link to="/doctor/appointments"
              className="btn btn-outline"
              style={{ padding: "6px 14px", fontSize: "0.85rem" }}>
              View All
            </Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {recent.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h4>No appointments yet</h4>
                <p>Patients will appear here once they book with you</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((appt) => (
                      <tr key={appt._id}>
                        <td><strong>{appt.userInfo?.name}</strong></td>
                        <td>{appt.date}</td>
                        <td>{appt.time}</td>
                        <td>
                          <span className={`badge badge-${appt.status}`}>{appt.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick info card */}
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header"><h3>Your Info</h3></div>
          <div className="card-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Specialization", value: doctor?.specialization },
                { label: "Experience",     value: `${doctor?.experience} years` },
                { label: "Consultation Fee", value: `₹${doctor?.feesPerConsultation}` },
                { label: "Available",      value: `${doctor?.timings?.start} – ${doctor?.timings?.end}` },
                { label: "Phone",          value: doctor?.phone },
                { label: "Address",        value: doctor?.address },
              ].map((item) => (
                <div key={item.label}>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-light)", fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>
                    {item.label}
                  </p>
                  <p style={{ fontWeight: 600, color: "var(--text-dark)" }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
