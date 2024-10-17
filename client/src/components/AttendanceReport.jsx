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
        const response = await fetch('http://127.0.0.1:5555/reports');
        if (!response.ok) {
          throw new Error('Failed to fetch report data');
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
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2>Attendance Report</h2>
          <div>
            <h3>Total Members: {totalMembers}</h3>
            <h3>Attendance Percentage: {attendancePercentage}%</h3>
            <h3>Absent Members: {absentMembers}</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {/* Set the Pie chart container size */}
            <div style={{ width: '300px', height: '300px' }}>
              <Pie data={pieData} />
            </div>

            {/* Line chart can expand more horizontally */}
            <div style={{ width: '600px', height: '300px' }}>
              <Line data={lineData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceReport;
