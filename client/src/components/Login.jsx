import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Login = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginData = {
            username,
            password
        };

        try {
            const response = await fetch('http://127.0.0.1:5555/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                alert('Login successful');
                onClose();  // Optionally close the modal
                navigate('/admin-dashboard');  // Redirect to the Admin Dashboard
            } else {
                // Handle error
                setError(data.message);
            }
        } catch (error) {
            setError(error, 'An error occurred while logging in');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Admin Login</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full mb-4"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full mb-4"
                        required
                    />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 text-white py-2 px-4 rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
