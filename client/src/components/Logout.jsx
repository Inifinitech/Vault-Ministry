import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('https://vault-ministry-server.onrender.com/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                
                alert(data.message);
                navigate('/'); 
            } else {
                throw new Error('Failed to log out');
            }
        } catch (error) {
            alert('Error logging out: ' + error.message);
        }
    };

    return (
        <footer className="bg-gray-900 text-white p-6">
            <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-semibold transition"
            >
                Logout
            </button>
        </footer>
    );
}

export default Logout;
