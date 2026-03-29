import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ date: "", time: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, doctorRes] = await Promise.all([
          axios.get("/api/v1/user/profile", { headers }),
          axios.get(`/api/v1/doctor/${doctorId}`, { headers }),
        ]);

        if (userRes.data.success) setUser(userRes.data.data);
        if (doctorRes.data.success) setDoctor(doctorRes.data.data);
      } catch (err) {
        setError("Failed to load doctor information.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/v1/appointment/book",
        { doctorId, date: form.date, time: form.time },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSuccess("Appointment booked successfully! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Today's date in yyyy-mm-dd format for min date
  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="page-wrapper">
        <Navbar user={user} />
        <div className="main-content">
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <h4>Doctor not found</h4>
            <Link to="/doctors" className="btn btn-primary">Back to Doctors</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar user={user} />

      <div className="main-content">
        <div className="book-page">
          {/* Page title */}
          <div className="page-title">
            <h1>Book Appointment</h1>
            <p>Select a date and time that works for you</p>
          </div>

          {/* Doctor Info Banner */}
          <div className="book-doctor-info">
            <div className="doctor-avatar" style={{ width: 52, height: 52 }}>👨‍⚕️</div>
            <div>
              <h4>Dr. {doctor.firstName} {doctor.lastName}</h4>
              <p>
                {doctor.specialization} · {doctor.experience} yrs exp ·{" "}
                <strong style={{ color: "var(--secondary)" }}>₹{doctor.feesPerConsultation}</strong>
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-light)", marginTop: 2 }}>
                Available: {doctor.timings?.start} – {doctor.timings?.end}
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <div className="card">
            <div className="card-header">
              <h3>📅 Select Date & Time</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Appointment Date</label>
                  <input
                    className="form-control"
                    type="date"
                    name="date"
                    min={today}
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Preferred Time</label>
                  <input
                    className="form-control"
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                  />
                  <small style={{ color: "var(--text-light)", fontSize: "0.8rem", marginTop: 4, display: "block" }}>
                    Doctor is available {doctor.timings?.start} – {doctor.timings?.end}
                  </small>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={submitting}
                    style={{ flex: 1 }}
                  >
                    {submitting ? "Booking..." : "Confirm Appointment"}
                  </button>
                  <Link to="/doctors" className="btn btn-outline" style={{ flex: 1, textAlign: "center" }}>
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
