import { useState } from 'react';

function RegisterMembers() {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [dob, setDOB] = useState('');
    const [location, setLocation] = useState('');
    const [phone, setPhone] = useState('');
    const [is_student, setIsStudent] = useState(false); 
    const [school, setSchool] = useState('');
    const [is_visitor, setIsVisitor] = useState(false); 
    const [will_be_coming, setWillBeComing] = useState(false); 
    const [occupation, setOccupation] = useState('');
    const [group, setGroup] = useState('');
    const [leader, setLeader] = useState(false); // Changed to boolean
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!first_name || !last_name || !dob || !location || !phone || !occupation || !group) {
            setError('Please fill in all fields.');
            setIsSubmitting(false);
            return;
        }

        const newMember = {
            first_name,
            last_name,
            dob,
            location,
            phone,
            leader,
            is_student, 
            school, 
            is_visitor, 
            will_be_coming, 
            occupation,
            group,
        };
        console.log('New Member Data:', JSON.stringify(newMember, null, 2));

        try {
            const response = await fetch('http://127.0.0.1:5555/adminregistry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMember),
            });

            console.log('Response:', response);

            if (response.ok) {
                const data = await response.json();
                setSuccess('Member registered successfully!');
                // Reset form fields
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
                setGroup('');
                setLeader(false);
                setError(null);
            } else {
                const errorData = await response.json();
                setError(`Failed to register member: ${errorData.message || 'Please try again.'}`);
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };
    

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Register a New Member</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="firstName">First Name</label>
                    <input 
                        id="firstName" 
                        type="text" 
                        value={first_name} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        className="w-full p-3 border border-gray-300 rounded-lg" 
                        required />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="lastName">Last Name</label>
                    <input 
                        id="lastName" 
                        type="text" 
                        value={last_name} 
                        onChange={(e) => setLastName(e.target.value)} 
                        className="w-full p-3 border border-gray-300 rounded-lg" 
                        required />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="DOB">Date of Birth</label>
                    <input 
                        id="DOB" 
                        type="date" 
                        value={dob} 
                        onChange={(e) => setDOB(e.target.value)} 
                        className="w-full p-3 border border-gray-300 rounded-lg" 
                        required />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="location">Location</label>
                    <input 
                        id="location" 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        className="w-full p-3 border border-gray-300 rounded-lg" 
                        required />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="phone">Phone</label>
                    <input 
                        id="phone" 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        className="w-full p-3 border border-gray-300 rounded-lg" 
                        required />
                </div>

                <div className="flex items-center">
                    <input 
                        id="isStudent" 
                        type="checkbox" 
                        checked={is_student} 
                        onChange={(e) => setIsStudent(e.target.checked)} 
                        className="mr-2" />
                    <label htmlFor="isStudent" className="text-gray-700">Is Student?</label>
                </div>

                {is_student && (
                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="school">School Name</label>
                        <input 
                            id="school" 
                            type="text" 
                            value={school} 
                            onChange={(e) => setSchool(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg" />
                    </div>
                )}

                <div className="flex items-center">
                    <input 
                        id="isVisitor" 
                        type="checkbox" 
                        checked={is_visitor}
                        onChange={(e) => setIsVisitor(e.target.checked)} 
                        className="mr-2" />
                    <label htmlFor="isVisitor" className="text-gray-700">Is Visitor?</label>
                </div>

                {is_visitor && (
                    <div className="flex items-center">
                        <input 
                            id="willBeComing" 
                            type="checkbox" 
                            checked={will_be_coming} 
                            onChange={(e) => setWillBeComing(e.target.checked)} 
                            className="mr-2" />
                        <label htmlFor="willBeComing" className="text-gray-700">Will be coming again?</label>
                    </div>
                )}

                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="occupation">Occupation</label>
                    <input 
                        id="occupation" 
                        type="text" 
                        value={occupation} 
                        onChange={(e) => setOccupation(e.target.value)} 
                        className="w-full p-3 border border-gray-300 rounded-lg" />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="group">AG Group</label>
                    <select 
                        id="group" 
                        value={group} 
                        onChange={(e) => setGroup(e.target.value)} 
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                    >
                        <option value="" disabled>Select Group</option>
                        <option value="Transformers">Transformers</option>
                        <option value="Relentless">Relentless</option>
                        <option value="Innovators">Innovators</option>
                        <option value="Pacesetters">Pacesetters</option>
                        <option value="Ignition">Ignition</option>
                        <option value="Gifted">Gifted</option>
                        <option value="Visionaries">Visionaries</option>
                        <option value="Elevated">Elevated</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="leader">Is Leader?</label>
                    <input 
                        id="leader" 
                        type="checkbox" 
                        checked={leader}
                        onChange={(e) => setLeader(e.target.checked)} 
                        className="mr-2" />
                </div>

                {error && <p className="text-red-600">{error}</p>}
                {success && <p className="text-green-600">{success}</p>}

                <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                    {isSubmitting ? 'Submitting...' : 'Register Member'}
                </button>
            </form>
        </div>
    );
}

export default RegisterMembers;