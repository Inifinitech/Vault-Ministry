import { useState, useEffect } from 'react';

function AttendanceDetails() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMemberAttendance = async () => {
            try {
                const response = await fetch('/api/member-attendance');
                if (!response.ok) {
                    throw new Error('Failed to fetch attendance details');
                }
                const data = await response.json();
                setMembers(data);
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
                    <div className="mb-4">
                <button onClick={exportToCSV} className="p-2 bg-blue-500 text-white rounded mr-2">
                    Export to CSV
                </button>
                <button onClick={printReport} className="p-2 bg-green-500 text-white rounded">
                    Print Report
                </button>
            </div>
            {loading ? (
                <p aria-live="polite">Loading attendance details...</p>
            ) : error ? (
                <p className='text-red-500'>{error}</p>
            ) : (
                <table className='table-auto w-full'>
                    <thead>
                        <tr>
                            <th className='px-4 py-2'>Member Name</th>
                            <th className='px-4 py-2'>Date</th>
                            <th className='px-4 py-2'>Attendance Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id}>
                                <td className='border px-4 py-2'>{`${member.firstName} ${member.lastName}`}</td>
                                <td className='border px-4 py-2'>{member.attendanceDate}</td>
                                <td className={`border px-4 py-2 ${member.present ? 'text-green-500' : 'text-red-500'}`}>
                                    {member.present ? 'Present' : 'Absent'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}      
    </div>
  )
}

export default AttendanceDetails
