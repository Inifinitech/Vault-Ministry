import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const displayMembers = async () => {
      try {
        const response = await fetch("https://vault-ministry-server.onrender.com/homemembers");
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        setMembers(data);
        setTotalMembers(data.length);

        // Fetch attendance rate
        const displayAttendance = await fetch("https://vault-ministry-server.onrender.com/report");
        if (!displayAttendance.ok) {
          throw new Error('Cannot get the attendance rate');
        }
        const attendanceData = await displayAttendance.json();
        setAttendanceRate(attendanceData.attendanceRate);
      } catch (error) {
        setError(error);
      }
    };
    displayMembers();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #1D4ED8, #D946EF)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div>
        <h1 style={{
          textAlign: 'center',
          fontSize: '2.25rem',
          fontWeight: 'bold',
          padding: '1rem',
        }}>Vault Ministry Reg Desk</h1>
      </div>

      <header style={{
        backgroundColor: '#1E3A8A',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        color: 'white',
      }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          letterSpacing: '0.025em',
        }}>Admin Dashboard</h1>
      </header>

      <main style={{ flexGrow: 1, padding: '2.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            marginBottom: '2.5rem',
          }}>
            {[
              { title: 'Total Members', value: totalMembers ? totalMembers : 'Loading...' },
              { title: 'Total Groups', value: '8' },
              { title: 'Attendance Rate', value: `${attendanceRate}%` },
            ].map((stat, idx) => (
              <div key={idx} style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)',
                borderRadius: '0.5rem',
                transform: 'scale(1)',
                transition: 'transform 0.5s',
                cursor: 'pointer',
                ':hover': { transform: 'scale(1.05)' }
              }}>
                <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#4B5563' }}>{stat.title}</h2>
                <p style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#111827',
                }}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.5rem',
          }}>
            {[
              { to: '/register-member', label: 'Register New Member', color: '#16A34A' },
              { to: '/view-members', label: 'View All Members', color: '#2563EB' },
              { to: '/attendance-report', label: 'Attendance Report', color: '#7C3AED' },
              { to: '/attendance-details', label: 'Attendance Details', color: '#7C3AED' },
            ].map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                style={{
                  backgroundColor: link.color,
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'opacity 0.3s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer style={{
        backgroundColor: '#111827',
        color: 'white',
        padding: '1.5rem',
        textAlign: 'center',
      }}>
        <Footer />
      </footer>
    </div>
  );
}

export default AdminDashboard;
