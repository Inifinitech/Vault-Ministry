import { useState, useEffect } from 'react';

function ViewMembers() {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('firstName');
    const [loading, setLoading] = useState(true);
    const [today] = useState(new Date());
    const [attendanceMarked, setAttendanceMarked] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5555/adminregistry");
                if (!response.ok) {
                    throw new Error('Failed to fetch members');
                }
                const data = await response.json();
                setMembers(data);
                setFilteredMembers(data);

                // Initialize attendance marked state for members
                const attendanceStatus = {};
                data.forEach(member => {
                    const memberName = `${member.first_name} ${member.last_name}`;
                    attendanceStatus[memberName] = member.attendance?.some(
                        attendance => new Date(attendance.date).toDateString() === today.toDateString()
                    ) || false;
                });
                setAttendanceMarked(attendanceStatus);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, [today]);

    useEffect(() => {
        const results = members.filter(member =>
            member[searchField]?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMembers(results);
    }, [searchTerm, searchField, members]);

    // Attendance system
    const markAttendance = async (memberName) => {
        // Check if today is Sunday (0)
        if (today.getDay() !== 0) {
            alert('Attendance can only be marked on Sundays!');
            return;
        }

        if (attendanceMarked[memberName]) {
            alert('Attendance already marked for today!');
            return;
        }

        setError(null); // Reset error before API call

        try {
            const response = await fetch(`http://127.0.0.1:5555/homemembers/${memberName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date: today.toISOString() }),
            });

            if (response.ok) {
                alert(`Attendance for ${memberName} marked successfully!`);
                setAttendanceMarked((prev) => ({
                    ...prev,
                    [memberName]: true,
                }));
            } else {
                throw new Error('Failed to mark attendance');
            }
        } catch (error) {
            setError(error, 'Failed to mark attendance. Please try again later.');
        }
    };

    return (
        <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-6">View Members</h1>
        
        <div className='mb-4'>
            <label htmlFor="searchField" className="mr-2 text-lg">Search by:</label>
            <select
                id='searchField'
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className='p-2 border-2 border-orange-500 rounded-md focus:border-orange-700 transition'
            >
                <option value="firstName">First Name</option>
                <option value="lastName">Last Name</option>
                <option value="DOB">Date of Birth</option>
                <option value="student">Student</option>
                <option value="school">School</option>
                <option value="location">Location</option>
                <option value="occupation">Occupation</option>
                <option value="visitor">Visitor</option>
                <option value="willBeComing">Will Be Coming</option>
            </select>
        </div>
        
        <div className='mb-4'>
            <input
                type="text"
                placeholder={`Search members by ${searchField}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='p-2 border-2 border-gray-300 rounded-md focus:border-orange-500 transition'
            />
        </div>

        {loading ? (
            <p aria-live="polite" className="text-center text-lg">Loading...</p>
        ) : error ? (
            <p className='text-red-500 text-center' aria-live="polite">{error}</p>
        ) : filteredMembers.length > 0 ? (
            filteredMembers.map((member) => {
                const memberName = `${member.first_name} ${member.last_name}`;
                return (
                    <div key={member.id} className="member-card p-4 bg-white border border-gray-200 rounded-lg shadow-lg mb-4 hover:shadow-xl transition">
                        <p className="text-lg font-semibold">{memberName}</p>
                        <p>{`DOB: ${member.dob}`}</p>
                        <p>{`Student: ${member.student}`}</p>
                        <p>{`School: ${member.school}`}</p>
                        <p>{`Location: ${member.location}`}</p>
                        <p>{`Occupation: ${member.occupation}`}</p>
                        <p>{`Visitor: ${member.is_visitor}`}</p>
                        <p>{`Will Be Coming: ${member.will_be_coming}`}</p>
                        <button onClick={() => markAttendance(memberName)}
                            className="mt-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                            Mark Attendance
                        </button>
                    </div>
                );
            })
        ) : (
            <p className="text-center text-lg">No members found.</p>
        )}
    </div>
    );
}

export default ViewMembers;
