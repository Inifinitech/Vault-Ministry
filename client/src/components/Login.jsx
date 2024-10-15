const Login = ({ isOpen, onClose }) => {
    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Admin Login</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        placeholder="Username"
                        className="border border-gray-300 p-2 rounded w-full mb-4"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border border-gray-300 p-2 rounded w-full mb-4"
                    />
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="bg-red-500 text-white py-2 px-4 rounded mr-2">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Login</button>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default Login