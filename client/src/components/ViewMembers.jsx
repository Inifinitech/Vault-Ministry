import { useState, useEffect } from "react";

function ViewMembers() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("firstName");
  const [loading, setLoading] = useState(true);
  const [today] = useState(new Date());
  const [attendanceMarked, setAttendanceMarked] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("https://vault-ministry-server.onrender.com/homemembers");
        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }
        const data = await response.json();
        setMembers(data);
        setFilteredMembers(data);

        const attendanceStatus = {};
        data.forEach((member) => {
          const memberName = `${member.first_name} ${member.last_name}`;
          attendanceStatus[memberName] =
            member.attendance?.some(
              (attendance) =>
                new Date(attendance.date).toDateString() ===
                today.toDateString()
            ) || false;
        });
        setAttendanceMarked(attendanceStatus);
      } catch (error) {
        setError("Failed to fetch members: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [today]); // Fetch only once when the component mounts

  useEffect(() => {
    const results = members.filter((member) =>
      member[searchField]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(results);
  }, [searchTerm, searchField, members]);

  const markAttendance = async (memberName) => {
    if (today.getDay() !== 0) {
      alert("Attendance can only be marked on Sundays!");
      return;
    }

    if (attendanceMarked[memberName]) {
      alert("Attendance already marked for today!");
      return;
    }

    setError(null);

    try {
      const response = await fetch(
        `https://vault-ministry-server.onrender.com/homemembers/${memberName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date: today.toISOString() }),
        }
      );

      if (response.ok) {
        alert(`Attendance for ${memberName} marked successfully!`);
        setAttendanceMarked((prev) => ({
          ...prev,
          [memberName]: true,
        }));
      } else {
        throw new Error("Failed to mark attendance");
      }
    } catch (error) {
      setError("Failed to mark attendance: " + error.message);
    }
  };

  const deleteMember = async (memberId) => {
    console.log("Deleting member with ID:", memberId); // Check if this logs the correct ID
    const confirmDelete = window.confirm("Are you sure you want to delete this member?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`https://vault-ministry-server.onrender.com/adminsearch/${memberId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete member");
      }
  
      alert("Member deleted successfully!");
      // Update the state
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== memberId)
      );
      setFilteredMembers((prevFilteredMembers) =>
        prevFilteredMembers.filter((member) => member.id !== memberId)
      );
    } catch (error) {
      setError("Failed to delete member: " + error.message);
    }
  };
  

  return (
    <div className="min-h-screen bg-view-page bg-cover bg-center">
      <button></button>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-6">
          View Members
        </h1>

        <div className="mb-4">
          <label htmlFor="searchField" className="mr-2 text-lg">
            Search by:
          </label>
          <select
            id="searchField"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="p-2 border-2 border-orange-500 rounded-md focus:border-orange-700 transition"
          >
            <option value="first_name">First Name</option>
            <option value="last_name">Last Name</option>
            <option value="dob">Date of Birth</option>
            <option value="phone">Phone</option>
            <option value="school">School</option>
            <option value="location">Location</option>
            <option value="occupation">Occupation</option>
            <option value="is_student">Student</option>
            <option value="will_be_coming">Will Be Coming</option>
          </select>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder={`Search members by ${searchField}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border-2 border-gray-300 rounded-md focus:border-orange-500 transition"
          />
        </div>

        {loading ? (
          <p aria-live="polite" className="text-center text-lg">
            Loading...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center" aria-live="polite">
            {error}
          </p>
        ) : filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMembers.map((member) => {
              const memberName = `${member.first_name} ${member.last_name}`;
              return (
                <div
                  key={member.id}
                  className="member-card p-4 bg-white border border-gray-200 rounded-lg shadow-lg mb-4 hover:shadow-xl transition"
                >
                  <img
                    src="https://via.placeholder.com/100"
                    alt="Placeholder"
                    className="w-24 h-24 rounded-full border-2 border-black mb-4 object-cover mx-auto"
                  />
                  <p className="text-lg font-semibold text-center">
                    {memberName}
                  </p>
                  <p className="text-center">{`Firstname: ${member.first_name}`}</p>
                  <p className="text-center">{`Lastname: ${member.last_name}`}</p>
                  <p className="text-center">{`DOB: ${member.dob}`}</p>
                  <p className="text-center">{`Student: ${member.student}`}</p>
                  <p className="text-center">{`School: ${member.school}`}</p>
                  <p className="text-center">{`Location: ${member.location}`}</p>
                  <p className="text-center">{`Occupation: ${member.occupation}`}</p>
                  <p className="text-center">{`Visitor: ${member.is_visitor}`}</p>
                  <p className="text-center">{`Will Be Coming: ${member.will_be_coming}`}</p>
                  <button
                    onClick={() => markAttendance(memberName)}
                    className="mt-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition w-full"
                  >
                    Mark Attendance
                  </button>
                  <button onClick={() => deleteMember(member.id)}>Delete</button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-lg">No members found.</p>
        )}
      </div>
    </div>
  );
}

export default ViewMembers;
