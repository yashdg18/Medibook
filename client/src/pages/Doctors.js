import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Doctors() {
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, doctorRes] = await Promise.all([
          axios.get("/api/v1/user/profile", { headers }),
          axios.get("/api/v1/doctor/all", { headers }),
        ]);

        if (userRes.data.success) setUser(userRes.data.data);
        if (doctorRes.data.success) setDoctors(doctorRes.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = doctors.filter(
    (d) =>
      d.firstName.toLowerCase().includes(search.toLowerCase()) ||
      d.lastName.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Finding doctors...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar user={user} />

      <div className="main-content">
        <div className="page-title">
          <h1>Find a Doctor</h1>
          <p>Browse our network of verified doctors and book instantly</p>
        </div>

        {/* Search bar */}
        <div style={{ marginBottom: "28px" }}>
          <input
            className="form-control"
            style={{ maxWidth: "420px" }}
            type="text"
            placeholder="🔍  Search by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👨‍⚕️</div>
            <h4>No doctors found</h4>
            <p>
              {doctors.length === 0
                ? "No approved doctors are available yet."
                : "No results match your search."}
            </p>
          </div>
        ) : (
          <div className="doctors-grid">
            {filtered.map((doctor) => (
              <div className="doctor-card" key={doctor._id}>
                <div className="doctor-card-header">
                  <div className="doctor-avatar">👨‍⚕️</div>
                  <div className="info">
                    <h4>Dr. {doctor.firstName} {doctor.lastName}</h4>
                    <p>{doctor.specialization}</p>
                  </div>
                </div>

                <div className="doctor-card-body">
                  <div className="doctor-meta">
                    <div className="doctor-meta-item">
                      <span>🏥</span>
                      <span>{doctor.address}</span>
                    </div>
                    <div className="doctor-meta-item">
                      <span>⏱️</span>
                      <span>{doctor.experience} yrs experience</span>
                    </div>
                    <div className="doctor-meta-item">
                      <span>🕐</span>
                      <span>
                        {doctor.timings?.start} – {doctor.timings?.end}
                      </span>
                    </div>
                    <div className="doctor-meta-item">
                      <span>💰</span>
                      <span className="doctor-fee">
                        ₹{doctor.feesPerConsultation} / visit
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/book-appointment/${doctor._id}`}
                    className="btn btn-primary btn-full"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Doctors;
