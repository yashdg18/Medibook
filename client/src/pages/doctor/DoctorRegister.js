import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function DoctorRegister() {
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    phone: "", address: "", specialization: "",
    experience: "", feesPerConsultation: "",
    timingStart: "09:00", timingEnd: "17:00", website: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/v1/doctor/register", form);
      if (res.data.success) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/doctor/login"), 1500);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ alignItems: "flex-start", paddingTop: 40 }}>
      <div className="auth-box" style={{ maxWidth: 600 }}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="logo-icon">🏥</div>
          <h2>Medi<em>Book</em></h2>
        </div>

        <div className="auth-title">
          <h3>Doctor Registration</h3>
          <p>Create your doctor account and start accepting patients</p>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Section: Account Info */}
          <div className="form-section-label">Account Information</div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" type="text" name="name"
                placeholder="Dr. John Doe" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input className="form-control" type="email" name="email"
                placeholder="doctor@example.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Password</label>
              <input className="form-control" type="password" name="password"
                placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input className="form-control" type="text" name="phone"
                placeholder="9876543210" value={form.phone} onChange={handleChange} required />
            </div>
          </div>

          {/* Section: Professional Info */}
          <div className="form-section-label" style={{ marginTop: 8 }}>Professional Information</div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Specialization</label>
              <select className="form-control" name="specialization" value={form.specialization} onChange={handleChange} required>
                <option value="">Select specialization</option>
                <option>Cardiologist</option>
                <option>Dermatologist</option>
                <option>Pediatrician</option>
                <option>Orthopedic Surgeon</option>
                <option>General Physician</option>
                <option>Neurologist</option>
                <option>Gynecologist</option>
                <option>ENT Specialist</option>
                <option>Ophthalmologist</option>
                <option>Psychiatrist</option>
                <option>Dentist</option>
                <option>Urologist</option>
              </select>
            </div>
            <div className="form-group">
              <label>Experience (years)</label>
              <input className="form-control" type="number" name="experience"
                placeholder="e.g. 10" min="0" value={form.experience} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Consultation Fee (₹)</label>
              <input className="form-control" type="number" name="feesPerConsultation"
                placeholder="e.g. 500" min="0" value={form.feesPerConsultation} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Clinic / Hospital Address</label>
              <input className="form-control" type="text" name="address"
                placeholder="e.g. Apollo Hospital, Pune" value={form.address} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Available From</label>
              <input className="form-control" type="time" name="timingStart"
                value={form.timingStart} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Available To</label>
              <input className="form-control" type="time" name="timingEnd"
                value={form.timingEnd} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Website (optional)</label>
            <input className="form-control" type="text" name="website"
              placeholder="https://yourwebsite.com" value={form.website} onChange={handleChange} />
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}
            style={{ marginTop: 8 }}>
            {loading ? "Registering..." : "Create Doctor Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already registered? <Link to="/doctor/login">Sign in here</Link>
          <br />
          <span style={{ color: "var(--text-light)" }}>Are you a patient? </span>
          <Link to="/login">Patient login</Link>
        </div>
      </div>
    </div>
  );
}

export default DoctorRegister;
