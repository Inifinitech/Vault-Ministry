import { Link } from 'react-router-dom'

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="">
        <h1 className="text-center text-4xl font-bold p-4">Vault Ministry Reg Desk</h1>
      </div>
      <header className="bg-blue-800 shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold tracking-wide">Admin Dashboard</h1>
      </header>
      
      <main className="flex-grow p-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 gap-8 mb-10">
            
            {[
              { title: 'Total Members', value: '120...' },
              { title: 'Total Groups', value: '8' },
              { title: 'Attendance Rate', value: '85%' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 shadow-xl rounded-lg transform transition duration-500 hover:scale-105">
                <h2 className="text-lg font-semibold text-gray-600">{stat.title}</h2>
                <p className="text-5xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          
          <div className="grid grid-cols-1 gap-6">
            {[
              { to: '/register-member', label: 'Register New Member', color: 'bg-green-600' },
              { to: '/view-members', label: 'View All Members', color: 'bg-blue-600' },
              { to: '/attendance-report', label: 'Attendance Report', color: 'bg-purple-600' },
              { to: '/attendance-details', label: 'Attendance Details', color: 'bg-purple-600' },
            ].map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                className={`${link.color} hover:opacity-90 text-white py-4 px-8 rounded-lg shadow-lg text-lg text-center font-semibold transition duration-300`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white p-6">
        <button className="text-red-500 hover:text-red-700 font-semibold transition">
          Logout
        </button>
      </footer>
    </div>
  );
}

export default AdminDashboard;
