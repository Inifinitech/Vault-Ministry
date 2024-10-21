import { useState, useEffect } from 'react';

const styles = {
  container: {
    marginBottom: '1rem', // mb-4
  },
  button: {
    padding: '0.5rem', // p-2
    color: 'white',
    borderRadius: '0.25rem', // rounded
    marginRight: '0.5rem', // mr-2
  },
  exportButton: {
    backgroundColor: '#4299e1', // bg-blue-500
  },
  printButton: {
    backgroundColor: '#48bb78', // bg-green-500
  },
  loadingText: {
    ariaLive: 'polite',
  },
  errorText: {
    color: '#f56565', // text-red-500
  },
  table: {
    width: '100%', // w-full
    borderCollapse: 'collapse', // Table layout styling
  },
  th: {
    padding: '0.5rem 1rem', // px-4 py-2
    textAlign: 'left',
    borderBottom: '2px solid #e2e8f0', // Similar to Tailwind's border styling
  },
  td: {
    padding: '0.5rem 1rem', // px-4 py-2
    borderBottom: '1px solid #e2e8f0', // Similar to Tailwind's border styling
  },
  present: {
    color: '#48bb78', // text-green-500
  },
  absent: {
    color: '#f56565', // text-red-500
  },
};

function AttendanceDetails() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberAttendance = async () => {
      try {
        const response = await fetch('https://vault-ministry-server.onrender.com/attendancedetails');
        if (!response.ok) {
          throw new Error('Failed to fetch attendance details');
        }
        const data = await response.json();

        // Filter attendance records to only include Sundays
        const sundayAttendance = data.filter(member => {
          const attendanceDate = new Date(member.date);
          return attendanceDate.getDay() === 0; // 0 is Sunday
        });

        setMembers(sundayAttendance);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMemberAttendance();
  }, []);

  const exportToCSV = () => {
    // Generate CSV logic
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div>
      <div style={styles.container}>
        <button onClick={exportToCSV} style={{ ...styles.button, ...styles.exportButton }}>
          Export to CSV
        </button>
        <button onClick={printReport} style={{ ...styles.button, ...styles.printButton }}>
          Print Report
        </button>
      </div>
      {loading ? (
        <p style={styles.loadingText}>Loading attendance details...</p>
      ) : error ? (
        <p style={styles.errorText}>{error}</p>
      ) : members.length === 0 ? (
        <p>No attendance records available for Sundays.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Member Name</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td style={styles.td}>{`${member.first_name} ${member.last_name}`}</td>
                <td style={styles.td}>{member.date}</td>
                <td style={{ ...styles.td, ...(member.present ? styles.present : styles.absent) }}>
                  {member.present ? 'Present' : 'Absent'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AttendanceDetails;
