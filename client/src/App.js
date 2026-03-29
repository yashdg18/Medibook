import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Patient pages
import HomePage        from "./pages/HomePage";
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import Doctors         from "./pages/Doctors";
import BookAppointment from "./pages/BookAppointment";
import Dashboard       from "./pages/Dashboard";

// Doctor pages
import DoctorLogin        from "./pages/doctor/DoctorLogin";
import DoctorRegister     from "./pages/doctor/DoctorRegister";
import DoctorDashboard    from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorProfile      from "./pages/doctor/DoctorProfile";

// Protected route for patients
function PatientRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// Protected route for doctors
function DoctorRoute({ children }) {
  const token = localStorage.getItem("doctorToken");
  if (!token) return <Navigate to="/doctor/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Patient auth ── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Patient protected ── */}
        <Route path="/"  element={<PatientRoute><HomePage /></PatientRoute>} />
        <Route path="/doctors" element={<PatientRoute><Doctors /></PatientRoute>} />
        <Route path="/book-appointment/:doctorId" element={<PatientRoute><BookAppointment /></PatientRoute>} />
        <Route path="/dashboard" element={<PatientRoute><Dashboard /></PatientRoute>} />

        {/* ── Doctor auth ── */}
        <Route path="/doctor/login"    element={<DoctorLogin />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />

        {/* ── Doctor protected ── */}
        <Route path="/doctor/dashboard"    element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />
        <Route path="/doctor/appointments" element={<DoctorRoute><DoctorAppointments /></DoctorRoute>} />
        <Route path="/doctor/profile"      element={<DoctorRoute><DoctorProfile /></DoctorRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
