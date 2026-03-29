import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar user={user} />

      <div className="main-content">
        <div className="page-title">
          <h1>My Appointments</h1>
          <p>View and manage all your doctor appointments</p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "7px 18px",
                borderRadius: "var(--radius)",
                border: "1.5px solid",
                borderColor: filter === f ? "var(--primary)" : "var(--border)",
                background: filter === f ? "var(--primary)" : "var(--white)",
                color: filter === f ? "white" : "var(--text-mid)",
                fontWeight: 600,
                fontSize: "0.88rem",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {f === "all"
                ? `All (${appointments.length})`
                : `${f.charAt(0).toUpperCase() + f.slice(1)} (${appointments.filter((a) => a.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h4>No appointments found</h4>
                <p>
                  {filter === "all"
                    ? "You haven't booked any appointments yet."
                    : `No ${filter} appointments.`}
                </p>
                {filter === "all" && (
                  <Link to="/doctors" className="btn btn-primary">
                    Book an Appointment
                  </Link>
                )}
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Doctor</th>
                      <th>Specialization</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Fee</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((appt, index) => (
                      <tr key={appt._id}>
                        <td style={{ color: "var(--text-light)" }}>{index + 1}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span>👨‍⚕️</span>
                            <strong>
                              Dr. {appt.doctorInfo.firstName} {appt.doctorInfo.lastName}
                            </strong>
                          </div>
                        </td>
                        <td>{appt.doctorInfo.specialization}</td>
                        <td>{appt.date}</td>
                        <td>{appt.time}</td>
                        <td style={{ color: "var(--secondary)", fontWeight: 600 }}>
                          ₹{appt.doctorInfo.feesPerConsultation}
                        </td>
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

        {/* Book more */}
        <div style={{ marginTop: 24 }}>
          <Link to="/doctors" className="btn btn-primary">
            + Book Another Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
