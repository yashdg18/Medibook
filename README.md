# 🏥 MediBook — Doctor Appointment System (MERN Stack)

A full-stack MERN web app for booking and managing doctor appointments.

## ✨ Features
- Patient: Register, Login, Browse Doctors, Book Appointments, View Dashboard
- Doctor: Register, Login, Dashboard, Approve/Reject Appointments, Profile
- JWT Authentication with separate patient and doctor roles
- MongoDB Atlas cloud database
- Production-ready: React served from Express (single deployment)

## 🛠 Tech Stack
- **Frontend:** React 18, React Router v6, Axios, Pure CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcryptjs

---

## 🚀 Run Locally

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/doctor-appointment.git
cd doctor-appointment
npm install
cd client && npm install && cd ..
```

### 2. Create .env file
```bash
cp .env.example .env
```
Open `.env` and fill in:
```
PORT=8080
NODE_MODE=development
MONGO_URL=mongodb://localhost:27017/doctor-appointment
JWT_SECRET=mysecretkey123
```

### 3. Add Sample Doctors
```bash
node seedDoctors.js
```

### 4. Start Development
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

---

## ☁️ Deploy on Render

### Step 1 - Push to GitHub
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/doctor-appointment.git
git push -u origin main
```

### Step 2 - Create MongoDB Atlas
1. Go to mongodb.com/atlas → Free cluster
2. Database Access → Add user → username + password
3. Network Access → Allow from anywhere (0.0.0.0/0)
4. Connect → Drivers → Copy connection string

### Step 3 - Deploy on Render
1. render.com → New → Web Service
2. Connect GitHub repo
3. Settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `node server.js`
4. Environment Variables:
   - MONGO_URL = your Atlas connection string
   - JWT_SECRET = mysecretkey123
   - NODE_MODE = production
5. Click Deploy!

---

## 📁 Project Structure
```
medibook/
├── server.js              # Express server entry
├── package.json           # Root scripts & deps
├── .env                   # Environment variables (create this)
├── seedDoctors.js         # Add sample doctors
├── config/db.js           # MongoDB connection
├── middleware/
│   ├── authMiddleware.js  # Patient JWT check
│   └── doctorMiddleware.js# Doctor JWT check
├── models/
│   ├── userModel.js
│   ├── doctorModel.js
│   └── appointmentModel.js
├── controllers/
│   ├── userCtrl.js
│   ├── doctorCtrl.js
│   └── appointmentCtrl.js
├── routes/
│   ├── userRoutes.js
│   ├── doctorRoutes.js
│   └── appointmentRoutes.js
└── client/                # React app
    └── src/
        ├── App.js
        ├── index.css
        ├── components/
        │   ├── Navbar.js
        │   └── DoctorNavbar.js
        └── pages/
            ├── Login.js
            ├── Register.js
            ├── HomePage.js
            ├── Doctors.js
            ├── BookAppointment.js
            ├── Dashboard.js
            └── doctor/
                ├── DoctorLogin.js
                ├── DoctorRegister.js
                ├── DoctorDashboard.js
                ├── DoctorAppointments.js
                └── DoctorProfile.js
```

## 🔗 App URLs
| Page | URL |
|------|-----|
| Patient Login | /login |
| Patient Register | /register |
| Patient Home | / |
| Find Doctors | /doctors |
| Book Appointment | /book-appointment/:id |
| My Appointments | /dashboard |
| Doctor Login | /doctor/login |
| Doctor Register | /doctor/register |
| Doctor Dashboard | /doctor/dashboard |
| Doctor Appointments | /doctor/appointments |
| Doctor Profile | /doctor/profile |
