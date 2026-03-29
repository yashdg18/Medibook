import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function DoctorLogin() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Doctors use the same login endpoint
      const res = await axios.post("/api/v1/user/login", form);

      if (res.data.success) {
        // Decode role from token to verify this is a doctor
        const payload = JSON.parse(atob(res.data.token.split(".")[1]));

        if (payload.role !== "doctor") {
          setError("This account is not a doctor account. Please use patient login.");
          setLoading(false);
          return;
        }

        localStorage.setItem("doctorToken", res.data.token);
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/doctor/dashboard"), 1000);
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
    <div className="auth-page">
      <div className="auth-box">
        {/* Logo */}
        <div className="auth-logo">
          <div className="logo-icon">🏥</div>
          <h2>Medi<em>Book</em></h2>
        </div>

        <div className="auth-title">
          <h3>Doctor Login</h3>
          <p>Sign in to manage your appointments</p>
        </div>

        {/* Role badge */}
        <div style={{
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: "var(--radius)", padding: "10px 14px",
          marginBottom: 20, display: "flex", alignItems: "center", gap: 8,
          fontSize: "0.88rem", color: "#166534", fontWeight: 500,
        }}>
          👨‍⚕️ Doctor Portal — Use your doctor credentials to sign in
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" name="email"
              placeholder="doctor@example.com" value={form.email}
              onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" name="password"
              placeholder="Enter your password" value={form.password}
              onChange={handleChange} required />
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In as Doctor"}
          </button>
        </form>

        <div className="auth-footer">
          New doctor? <Link to="/doctor/register">Register here</Link>
          <br />
          <span style={{ color: "var(--text-light)" }}>Are you a patient? </span>
          <Link to="/login">Patient login</Link>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;
