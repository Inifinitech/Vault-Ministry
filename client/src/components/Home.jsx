import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';
import NavBar from './NavBar';
import './styles/Home.css';

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

    const navItems = [
        {
            id: "about",
            label: "About",
            popoverContent: (
                <div>
                    <h3>About Our Ministry</h3>
                    <p>
                        Established in 2024, we are growing to become a cornerstone of the community, offering spiritual guidance and support to individuals and families. Our ministry focuses on worship, fellowship, and service, ensuring that everyone has the opportunity to grow in their faith.
                    </p>
                    <h4>Core Values:</h4>
                    <ul>
                        <li><strong>Faith:</strong> Trusting in God's plan for our lives.</li>
                        <li><strong>Community:</strong> Building meaningful relationships within and outside our church.</li>
                        <li><strong>Service:</strong> Actively helping those in need.</li>
                        <li><strong>Growth:</strong> Encouraging spiritual growth through education and discipleship.</li>
                    </ul>
                    <p>
                        Join us as we strive to make a difference in our community and beyond.
                    </p>
                    <a href="/mission">Our Mission</a>
                    <a href="/events">Join Us</a>
                </div>
            )
        },
        {
            id: "services",
            label: "Services",
            popoverContent: (
                <div>
                    <p>Details about our church services:</p>
                    <ul>
                        <li><strong>Service Times:</strong> Join us every Sunday at 9:00 AM and 11:00 AM.</li>
                        <li><strong>Location:</strong> 123 Karen, Nairobi, Kenya.</li>
                        <li><strong>Women of Faith:</strong> Women fellowship : Wednesdays at 7:00 PM.</li>
                        <li><strong>Children's Program:</strong> KidZone is available during all services for children aged 2-12.</li>
                        <li><strong>Special Services:</strong> Monthly evening worship on the first Friday of each month at 7:00 PM.</li>
                    </ul>
                    <p>For more information on our additional offerings, please visit:</p>
                    <a href="/consulting">Consulting Services</a>
                    <a href="/support">Support our Ministry</a>
                </div>
            )
        },
        {
            id: "contact",
            label: "Contact Us",
            popoverContent: (
                <div>
                    <h3>We would love to hear from you!</h3>
                    <p>Whether you have questions, need support, or simply want to connect, our team is here to help.</p>
                    <h4>Ways to Connect:</h4>
                    <ul>
                        <li><strong>Contact Form:</strong> Fill out our contact form:<a href="/contact-form">Contact Form</a></li>
                        <li><strong>Visit Us:</strong> Check out our <a href="/locations">Our Locations</a> page to find a site near you and join us for a service or event.</li>
                        <li><strong>Email:</strong> You can also reach us at <a href="mailto:info@vaultministry.church">info@vaultministry.church</a>.</li>
                        <li><strong>+254 712 345 678</strong> or <strong>+254 123 456 789</strong></li>
                        <li><strong>Social Media:</strong> Follow us on our social media platforms</li>
                    </ul>
                </div>
            )
        },
    ];

    const adminLoginButton = {
        id: "admin-login",
        label: "Admin Login",
        // redirect to the admin page
        onClick: () => setIsModalOpen(true)
    };

    // You can now use adminLoginButton wherever needed



    return (
        <>
            <NavBar
                logoText="Vault Ministry"
                navItems={navItems}
            />

            <button id='admin-login-button'
                onClick={() => setIsModalOpen(true)}>
                Admin Login
            </button>

            <div
                className="min-h-screen bg-gradient-to-br from-indigo-400 to-purple-600 flex flex-col items-center justify-center p-6"
                id='image-background'
                style={{
                    backgroundImage: `url('/src/assets/Vault-M.jpeg')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top center',
                    backgroundSize: 'cover',
                    position: 'relative',
                    zIndex: -1,
                }}
            >
                {/* Overlay with tint for better text readability and border radius */}
                <div className="absolute inset-0 bg-black opacity-40" />
                <div className='home-title'>
                    <h1 id="banner-text" className="relative text-center text-5xl font-extrabold text-white mb-4">Vault Ministry</h1>

                    <h2 className="relative text-4xl font-bold text-white mb-8">Search Registered Members:</h2>
                </div>
            </div>

            <div className="user-interaction">

                <Link to={'/admin-dashboard'}>
                    <Login isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </Link>

                <input
                    id='search-input'
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
            </div>

            <footer>
                <p>&copy; 2024 All rights reserved</p>
                <p><a href="#terms">Terms of Service</a></p>
                <p><a href="#privacy">Privacy</a></p>
            </footer>

        </>
    );
}

export default Home;
