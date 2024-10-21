import { useState } from 'react';

function RegisterMembers() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [DOB, setDOB] = useState('');
    const [location, setLocation] = useState('');
    const [phone, setPhone] = useState('');
    const [isStudent, setIsStudent] = useState(false); 
    const [school, setSchool] = useState('');
    const [isVisitor, setIsVisitor] = useState(false); 
    const [willBeComing, setWillBeComing] = useState(false); 
    const [occupation, setOccupation] = useState('');
    const [group, setGroup] = useState('');
    const [leader, setLeader] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!firstName || !lastName || !DOB || !location || !phone || !occupation || !group) {
            setError('Please fill in all fields.');
            setIsSubmitting(false);
            return;
        }

        const newMember = {
            first_name: firstName,
            last_name: lastName,
            dob: DOB,
            location,
            phone,
            leader,
            is_student: isStudent,
            school: isStudent ? school : '',
            is_visitor: isVisitor,
            will_be_coming: isVisitor ? willBeComing : false,
            occupation,
            group,
            group_id: group
        };
        console.log(newMember)
        try {
            const response = await fetch('https://vault-ministry-server.onrender.com/adminregistry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMember),
            });

            if (response.ok) {
                setSuccess('Member registered successfully!');
                setFirstName('');
                setLastName('');
                setDOB('');
                setLocation('');
                setPhone('');
                setIsStudent(false); 
                setSchool('');
                setIsVisitor(false); 
                setWillBeComing(false); 
                setOccupation('');
                setLeader(false);
                setGroup('');
                setError(null);
            } else {
                setError('Failed to register member. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoBack = () => {
        window.history.back();
      };

    return (
        <div style={{ backgroundImage: 'url(/images/bg-image.jpg)', backgroundSize: 'cover', minHeight: '100vh', padding: '1rem' }}>
            <button onClick={handleGoBack} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <img src='/images/home.jpg' alt="arrow" style={{ width: '16px', height: '16px', marginRight: '8px' }} />Back
            </button>

            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}>
                <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#333' }}>Register a New Member</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label htmlFor="firstName" style={{ display: 'block', marginBottom: '8px', color: '#333' }}>First Name</label>
                        <input 
                            id="firstName"
                            type="text" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                            required 
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" style={{ display: 'block', marginBottom: '8px', color: '#333' }}>Last Name</label>
                        <input 
                            id="lastName"
                            type="text" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                            required 
                        />
                    </div>

                    <div>
                        <label htmlFor="DOB" style={{ display: 'block', marginBottom: '8px', color: '#333' }}>Date of Birth</label>
                        <input 
                            id="DOB"
                            type="date" 
                            value={DOB} 
                            onChange={(e) => setDOB(e.target.value)} 
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                            required 
                        />
                    </div>

                    <div>
                        <label htmlFor="location" style={{ display: 'block', marginBottom: '8px', color: '#333' }}>Location</label>
                        <input 
                            id="location"
                            type="text" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                            required 
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" style={{ display: 'block', marginBottom: '8px', color: '#333' }}>Phone</label>
                        <input 
                            id="phone"
                            type="tel" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                            required 
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input 
                            id="isStudent" 
                            type="checkbox" 
                            checked={isStudent} 
                            onChange={(e) => setIsStudent(e.target.checked)} 
                            style={{ marginRight: '8px' }}
                        />
                        <label htmlFor="isStudent" style={{ color: '#333' }}>Is Student?</label>
                    </div>

                    {isStudent && (
                        <div>
                            <label htmlFor="school" style={{ display: 'block', marginBottom: '8px', color: '#333' }}>School Name</label>
                            <input 
                                id="school"
                                type="text" 
                                value={school} 
                                onChange={(e) => setSchool(e.target.value)} 
                                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input 
                            id="isVisitor" 
                            type="checkbox" 
                            checked={isVisitor} 
                            onChange={(e) => setIsVisitor(e.target.checked)} 
                            style={{ marginRight: '8px' }}
                        />
                        <label htmlFor="isVisitor" style={{ color: '#333' }}>Is Visitor?</label>
                    </div>

                    {isVisitor && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input 
                                id="willBeComing" 
                                type="checkbox" 
                                checked={willBeComing} 
                                onChange={(e) => setWillBeComing(e.target.checked)} 
                                style={{ marginRight: '8px' }}
                            />
                            <label htmlFor="willBeComing" style={{ color: '#333' }}>Will be coming again?</label>
                        </div>
                    )}

                    <div>
                        <label htmlFor="occupation" style={{ display: 'block', marginBottom: '8px', color: '#333' }}>Occupation</label>
                        <input 
                            id="occupation"
                            type="text" 
                            value={occupation} 
                            onChange={(e) => setOccupation(e.target.value)} 
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>

                    <div>
                        <label htmlFor="group" style={{ display: 'block', marginBottom: '8px', color: '#333' }}>AG Group</label>
                        <select 
                            id="group" 
                            value={group} 
                            onChange={(e) => setGroup(e.target.value)} 
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                        >
                                <option value="" disabled>Select Group</option>
                                <option value="1">Transformers</option>
                                <option value="2">Relentless</option>
                                <option value="3">Innovators</option>
                                <option value="4">Pacesetters</option>
                                <option value="5">Ignition</option>
                                <option value="6">Gifted</option>
                                <option value="7">Visionaries</option>
                                <option value="8">Elevated</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input 
                            id="leader" 
                            type="checkbox" 
                            checked={leader} 
                            onChange={(e) => setLeader(e.target.checked)} 
                            style={{ marginRight: '8px' }}
                        />
                        <label htmlFor="leader" style={{ color: '#333' }}>Leader</label>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}

                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            padding: '12px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            marginTop: '16px',
                            transition: 'background-color 0.3s',
                            ...(isSubmitting && { backgroundColor: '#007bff80', cursor: 'not-allowed' })
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Register Member'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterMembers;
