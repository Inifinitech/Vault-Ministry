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
    <div className="p-8">
      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-lg text-red-600">{error}</p>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Attendance Report</h2>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Total Members: {totalMembers}</h3>
            <h3 className="text-xl font-semibold">Attendance Percentage: {attendancePercentage}%</h3>
            <h3 className="text-xl font-semibold">Absent Members: {absentMembers}</h3>
          </div>

          <div className="flex flex-col md:flex-row justify-around items-center space-y-6 md:space-y-0">
            {/* Pie chart */}
            <div className="w-64 h-64">
              <Pie data={pieData} />
            </div>

            {/* Line chart */}
            <div className="w-full md:w-2/3 h-64">
              <Line data={lineData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceReport;
