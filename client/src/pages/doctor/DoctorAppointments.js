import { useState, useEffect } from "react";
import axios from "axios";
import DoctorNavbar from "../../components/DoctorNavbar";

function DoctorAppointments() {
  const [doctor,       setDoctor]       = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [filter,       setFilter]       = useState("all");
  const [updating,     setUpdating]     = useState("");  // id of the row being updated
  const [message,      setMessage]      = useState({ text: "", type: "" });

  const token   = localStorage.getItem("doctorToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, apptRes] = await Promise.all([
        axios.get("/api/v1/doctor/doctor-info/profile",      { headers }),
        axios.get("/api/v1/doctor/doctor-info/appointments", { headers }),
      ]);
      if (profileRes.data.success)  setDoctor(profileRes.data.data);
      if (apptRes.data.success)     setAppointments(apptRes.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (appointmentId, status) => {
    setUpdating(appointmentId);
    setMessage({ text: "", type: "" });
    try {
      const res = await axios.post(
        "/api/v1/doctor/doctor-info/update-status",
        { appointmentId, status },
        { headers }
      );
      if (res.data.success) {
        setMessage({ text: res.data.message, type: "success" });
        // Update row locally — no need to re-fetch
        setAppointments((prev) =>
          prev.map((a) => (a._id === appointmentId ? { ...a, status } : a))
        );
      } else {
        setMessage({ text: res.data.message, type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Something went wrong.", type: "error" });
    } finally {
      setUpdating("");
    }
  };

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
      <DoctorNavbar doctor={doctor} />

      <div className="main-content">
        <div className="page-title">
          <h1>Patient Appointments</h1>
          <p>Approve or reject appointment requests from patients</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`} style={{ marginBottom: 20 }}>
            {message.text}
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: "7px 18px", borderRadius: "var(--radius)",
                border: "1.5px solid",
                borderColor: filter === f ? "var(--primary)" : "var(--border)",
                background:  filter === f ? "var(--primary)"  : "var(--white)",
                color:       filter === f ? "white"            : "var(--text-mid)",
                fontWeight: 600, fontSize: "0.88rem", cursor: "pointer",
              }}>
              {f === "all"
                ? `All (${appointments.length})`
                : `${f.charAt(0).toUpperCase() + f.slice(1)} (${appointments.filter((a) => a.status === f).length})`
              }
            </button>
          ))}
        </div>

        {/* Appointments table */}
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h4>No appointments found</h4>
                <p>
                  {filter === "all"
                    ? "No patients have booked with you yet."
                    : `No ${filter} appointments.`}
                </p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Patient Name</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((appt, index) => (
                      <tr key={appt._id}>
                        <td style={{ color: "var(--text-light)" }}>{index + 1}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span
                              style={{
                                width: 32, height: 32, borderRadius: "50%",
                                background: "var(--primary-light)",
                                display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: 14, flexShrink: 0,
                              }}>
                              👤
                            </span>
                            <strong>{appt.userInfo?.name}</strong>
                          </div>
                        </td>
                        <td style={{ color: "var(--text-mid)" }}>{appt.userInfo?.email}</td>
                        <td>{appt.date}</td>
                        <td>{appt.time}</td>
                        <td>
                          <span className={`badge badge-${appt.status}`}>{appt.status}</span>
                        </td>
                        <td>
                          {appt.status === "pending" ? (
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                onClick={() => handleStatus(appt._id, "approved")}
                                disabled={updating === appt._id}
                                style={{
                                  padding: "5px 12px", borderRadius: "var(--radius)",
                                  background: "#dcfce7", color: "#166534",
                                  border: "1px solid #bbf7d0",
                                  fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
                                  opacity: updating === appt._id ? 0.6 : 1,
                                }}>
                                {updating === appt._id ? "..." : "✓ Approve"}
                              </button>
                              <button
                                onClick={() => handleStatus(appt._id, "rejected")}
                                disabled={updating === appt._id}
                                style={{
                                  padding: "5px 12px", borderRadius: "var(--radius)",
                                  background: "#fee2e2", color: "#991b1b",
                                  border: "1px solid #fecaca",
                                  fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
                                  opacity: updating === appt._id ? 0.6 : 1,
                                }}>
                                {updating === appt._id ? "..." : "✗ Reject"}
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorAppointments;
