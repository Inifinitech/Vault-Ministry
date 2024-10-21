import { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components
ChartJS.register(ArcElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const styles = {
  container: {
    backgroundImage: 'url("/path/to/your/background.jpg")', // Replace with your actual image path
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    minHeight: '100vh',
    padding: '3.5rem', // p-14
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: 'white',
    fontSize: '1.5rem', // text-2xl
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalMembers: {
    color: 'white',
    fontSize: '1.25rem', // text-xl
    fontWeight: '600',
    textAlign: 'center',
  },
  chartsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: '1.5rem', // space-y-6
  },
  pieChart: {
    width: '24rem', // w-96
    height: '24rem', // h-96
    borderRadius: '0.5rem',
    background: 'linear-gradient(to right, #00bcd4, #00acc1)', // from-cyan-500
  },
  lineChart: {
    width: '100%',
    maxWidth: '40rem', // md:w-2/3
    height: '16rem', // h-64
    borderRadius: '0.5rem',
    background: 'linear-gradient(to right, #f9f9f9, #eceff1)', // from-gray-50
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '1.125rem', // text-lg
    color: '#718096', // text-gray-600
  },
  errorText: {
    textAlign: 'center',
    fontSize: '1.125rem', // text-lg
    color: '#f56565', // text-red-600
  },
  '@media (min-width: 768px)': {
    chartsContainer: {
      flexDirection: 'row', // md:flex-row
    },
  },
};

function AttendanceReport() {
  const [totalMembers, setTotalMembers] = useState(0);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [absentMembers, setAbsentMembers] = useState(0);
  const [attendanceTrends, setAttendanceTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
          const response = await fetch('https://vault-ministry-server.onrender.com/reports');
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setTotalMembers(data.totalMembers);
          setAttendancePercentage(data.attendancePercentage);
          setAbsentMembers(data.absentMembers);
          setAttendanceTrends(data.attendanceTrends);
      } catch (err) {
          console.error("Error fetching attendance data:", err.message);
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

    fetchAttendanceData();
  }, []);

  const pieData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [attendancePercentage, 100 - attendancePercentage],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  const lineData = {
    labels: attendanceTrends.map((item) => item.date),
    datasets: [
      {
        label: 'Attendance Trend',
        data: attendanceTrends.map((item) => item.percentage),
        fill: false,
        borderColor: '#42a5f5',
      },
    ],
  };

  return (
    <div style={styles.container}>
      {loading ? (
        <p style={styles.loadingText}>Loading...</p>
      ) : error ? (
        <p style={styles.errorText}>{error}</p>
      ) : (
        <div style={styles.chartsContainer}>
          <h2 style={styles.header}>Attendance Report</h2>

          <div style={styles.totalMembers}>
            <h3>Total Members: {totalMembers}</h3>
            <h3>Attendance Percentage: {attendancePercentage}%</h3>
            <h3>Absent Members: {absentMembers}</h3>
          </div>

          <div style={styles.chartsContainer}>
            {/* Pie chart */}
            <div style={styles.pieChart}>
              <Pie data={pieData} />
            </div>

            {/* Line chart */}
            <div style={styles.lineChart}>
              <Line data={lineData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceReport;
