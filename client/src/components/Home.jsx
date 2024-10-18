import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import Login from './Login'; 

function Home() {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5555/homemembers");
                if (!response.ok) {
                    throw new Error('Failed to fetch members');
                }
                const data = await response.json();
                setMembers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    const filteredMembers = members.filter(member =>
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-hero-pattern flex flex-col items-center justify-center p-6">
            <h1 className="text-center text-5xl font-extrabold text-white mb-4 shadow-md">Vault Ministry</h1>

            <h2 className="text-4xl font-extrabold text-white mb-8">Registered Members</h2>
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-orange-500 text-white py-3 px-6 rounded-lg shadow-lg transition duration-300 hover:bg-orange-600 transform hover:scale-105 mb-6"
            >
                Admin Login
            </button>

            <input
                type="text"
                placeholder="Search members"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-3 border-2 border-white rounded-md focus:border-orange-300 transition mb-6 w-full md:w-1/2 mx-auto bg-white shadow-lg"
            />

            {loading ? (
                <p aria-live="polite" className="text-center text-lg font-semibold text-white">Loading...</p>
            ) : error ? (
                <p className='text-red-300 text-center text-lg' aria-live="polite">{error}</p>
            ) : (
                <div className="flex flex-col space-y-4 w-full md:w-3/4 mx-auto">
                    {filteredMembers.map((member, index) => (
                        <div
                            key={member.id}
                            className={`p-6 rounded-lg shadow-xl ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition transform hover:scale-105`}
                        >
                            <p className="font-semibold text-lg">{`${member.first_name} ${member.last_name}`}</p>
                            <p className="text-gray-600">{`AG Group: ${member.group_name}`}</p>
                        </div>
                    ))}
                </div>
            )}
            
            <Login isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
        </div>
        
    );
    
    
}

export default Home;

