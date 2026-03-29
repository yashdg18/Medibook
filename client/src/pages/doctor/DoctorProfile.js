import { useState, useEffect } from "react";
import axios from "axios";
import DoctorNavbar from "../../components/DoctorNavbar";

function DoctorProfile() {
  const [doctor,  setDoctor]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("doctorToken");
        const res   = await axios.get("/api/v1/doctor/doctor-info/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setDoctor(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const fields = [
    { label: "First Name",         value: doctor?.firstName },
    { label: "Last Name",          value: doctor?.lastName },
    { label: "Email",              value: doctor?.email },
    { label: "Phone",              value: doctor?.phone },
    { label: "Specialization",     value: doctor?.specialization },
    { label: "Experience",         value: `${doctor?.experience} years` },
    { label: "Consultation Fee",   value: `₹${doctor?.feesPerConsultation}` },
    { label: "Address",            value: doctor?.address },
    { label: "Available Timings",  value: `${doctor?.timings?.start} – ${doctor?.timings?.end}` },
    { label: "Website",            value: doctor?.website || "—" },
    { label: "Status",             value: doctor?.status },
  ];

  return (
    <div className="page-wrapper">
      <DoctorNavbar doctor={doctor} />

      <div className="main-content">
        <div className="page-title">
          <h1>My Profile</h1>
          <p>Your professional information visible to patients</p>
        </div>

        {/* Profile card */}
        <div className="card" style={{ maxWidth: 700 }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #059669, #047857)",
            padding: "32px 28px",
            display: "flex", alignItems: "center", gap: 20,
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 36, flexShrink: 0,
            }}>
              👨‍⚕️
            </div>
            <div>
              <h2 style={{ color: "white", fontWeight: 800, fontSize: "1.4rem", marginBottom: 4 }}>
                Dr. {doctor?.firstName} {doctor?.lastName}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem" }}>
                {doctor?.specialization}
              </p>
              <span style={{
                background: "rgba(255,255,255,0.2)", color: "white",
                padding: "2px 10px", borderRadius: 20,
                fontSize: "0.78rem", fontWeight: 700, marginTop: 6, display: "inline-block",
              }}>
                {doctor?.status?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Info grid */}
          <div className="card-body">
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 20,
            }}>
              {fields.map((field) => (
                <div key={field.label} style={{
                  padding: "14px 16px",
                  background: "var(--bg-light)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                }}>
                  <p style={{
                    fontSize: "0.75rem", fontWeight: 700,
                    color: "var(--text-light)", textTransform: "uppercase",
                    letterSpacing: "0.5px", marginBottom: 4,
                  }}>
                    {field.label}
                  </p>
                  <p style={{ fontWeight: 600, color: "var(--text-dark)", fontSize: "0.95rem" }}>
                    {field.value}
                  </p>
                </div>
              ))}
            </div>

            <p style={{ marginTop: 24, fontSize: "0.85rem", color: "var(--text-light)" }}>
              ℹ️ To update your profile information, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
