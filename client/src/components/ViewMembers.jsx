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
  }, [today]);

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
    <div style={{ minHeight: "100vh", padding: "20px", textAlign: "center", backgroundImage: "url('/image/viewbg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff7f00", marginBottom: "24px" }}>View Members</h1>

      <div style={{ marginBottom: "16px" }}>
        <label htmlFor="searchField" style={{ marginRight: "8px", fontSize: "1.125rem" }}>Search by:</label>
        <select
          id="searchField"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          style={{
            padding: "8px",
            border: "2px solid #ff7f00",
            borderRadius: "8px",
            outline: "none",
            transition: "border-color 0.3s ease",
          }}
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

      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder={`Search members by ${searchField}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            border: "2px solid #ccc",
            borderRadius: "8px",
            transition: "border-color 0.3s ease",
            width: "100%",
            maxWidth: "400px",
            outline: "none",
          }}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : filteredMembers.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
          {filteredMembers.map((member) => {
            const memberName = `${member.first_name} ${member.last_name}`;
            return (
              <div
                key={member.id}
                style={{
                  width: "250px",
                  margin: "20px",
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                <img
                  src="https://via.placeholder.com/100"
                  alt="Placeholder"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    border: "2px solid #000",
                    marginBottom: "16px",
                    objectFit: "cover",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                />
                <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>{memberName}</h3>
                <p>Firstname: {member.first_name}</p>
                <p>Lastname: {member.last_name}</p>
                <p>DOB: {member.dob}</p>
                <p>Student: {member.student}</p>
                <p>School: {member.school}</p>
                <p>Location: {member.location}</p>
                <p>Occupation: {member.occupation}</p>
                <button
                  onClick={() => markAttendance(memberName)}
                  style={{
                    marginTop: "8px",
                    padding: "10px",
                    backgroundColor: "#38a169",
                    color: "#fff",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  {attendanceMarked[memberName] ? "Attendance Marked" : "Mark Attendance"}
                </button>
                <button
                  onClick={() => deleteMember(member.id)}
                  style={{
                    marginTop: "8px",
                    padding: "10px",
                    backgroundColor: "#e53e3e",
                    color: "#fff",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No members found.</p>
      )}
    </div>
  );
}

export default ViewMembers;
