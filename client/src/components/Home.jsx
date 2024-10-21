import { useState, useEffect } from 'react';
import Login from './Login'; 
import transformersBg from '../images/transformersag.jpg';
import vaultBg from '../images/vaultL1.jpg';

function Home() {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("https://vault-ministry-server.onrender.com/homemembers");
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
        <div style={{
            minHeight: '100vh',
            backgroundImage: 'url("/path-to-your-hero-pattern.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
        }}>
            <h1 style={{
                textAlign: 'center',
                fontSize: '3rem',
                fontWeight: '900',
                color: '#fff',
                marginBottom: '1rem',
                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.7)',
            }}>Vault Ministry</h1>

            <h2 style={{
                fontSize: '2rem',
                fontWeight: '900',
                color: '#fff',
                marginBottom: '2rem',
            }}>Registered Members</h2>
            
            <button 
                onClick={() => setIsModalOpen(true)} 
                style={{
                    backgroundColor: '#f97316',
                    color: '#fff',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer',
                    marginBottom: '1.5rem',
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            >
                Admin Login
            </button>

            <input
                type="text"
                placeholder="Search members"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    padding: '0.75rem',
                    border: '2px solid #fff',
                    borderRadius: '0.5rem',
                    transition: 'border-color 0.3s ease',
                    marginBottom: '1.5rem',
                    width: '100%',
                    maxWidth: '50%',
                    backgroundColor: '#fff',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
                }}
                onFocus={e => e.target.style.borderColor = '#fb923c'}
                onBlur={e => e.target.style.borderColor = '#fff'}
            />

            {loading ? (
                <p style={{
                    textAlign: 'center',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#fff',
                }}>Loading...</p>
            ) : error ? (
                <p style={{
                    color: '#fca5a5',
                    textAlign: 'center',
                    fontSize: '1.125rem',
                }}>{error}</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '1rem',
                    width: '100%',
                }}>
                    {filteredMembers.map((member) => (
                        <div
                            key={member.id}
                            style={{
                                position: 'relative',
                                padding: '1.5rem',
                                borderRadius: '0.75rem',
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                color: '#fff',
                                backgroundImage: member.group_name === 'Transformers'
                                    ? `url(${transformersBg})` 
                                    : `url(${vaultBg})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                minHeight: '200px',
                                transition: 'transform 0.3s ease',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        >
                            {/* Overlay */}
                            <div style={{
                                position: 'absolute',
                                inset: '0',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                borderRadius: '0.75rem',
                            }}></div>

                            {/* Text */}
                            <div style={{
                                position: 'relative',
                                zIndex: '10',
                            }}>
                                <p style={{
                                    fontWeight: '600',
                                    fontSize: '1.125rem',
                                }}>{`${member.first_name} ${member.last_name}`}</p>
                                <p>{`AG Group: ${member.group_name}`}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <Login isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

export default Home;
