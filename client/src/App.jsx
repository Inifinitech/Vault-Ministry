// App.jsx
import './app.css';
import { Route, Routes } from 'react-router-dom';
import RegisterMembers from './components/RegisterMembers';
import ViewMembers from './components/ViewMembers';
import AttendanceDetails from './components/AttendanceDetails';
import AttendanceReport from './components/AttendanceReport';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import Home from './components/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/admin-login" element={<Login />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/register-member" element={<RegisterMembers />} />
      <Route path="/view-members" element={<ViewMembers />} />
      <Route path="/attendance-report" element={<AttendanceReport />} />
      <Route path="/attendance-details" element={<AttendanceDetails />} />
    </Routes>
  );
}

export default App;
