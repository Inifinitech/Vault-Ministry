import React, { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';

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
        const response = await fetch('/api/attendance-report');
        if (!response.ok) {
          throw new Error('Failed to fetch report data');
        }
        const data = await response.json();
        setTotalMembers(data.totalMembers);
        setAttendancePercentage(data.attendancePercentage);
        setAbsentMembers(data.absentMembers);
        setAttendanceTrends(data.attendanceTrends);
      } catch (err) {
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
          <div>
            <Pie data={pieData} />
            <Line data={lineData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceReport;
