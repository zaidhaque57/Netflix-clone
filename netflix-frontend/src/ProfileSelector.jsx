import { useState, useEffect } from 'react';

export default function ProfileSelector({ userId, onSelectProfile }) {
  const [profiles, setProfiles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/profiles/${userId}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setProfiles(data);
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
      }
    };
    fetchProfiles();
  }, [userId]);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    try {
      const response = await fetch('http://localhost:5001/api/profiles/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, profile_name: newProfileName }),
      });

      const data = await response.json();
      if (response.ok) {
        setProfiles([...profiles, data]);
        setNewProfileName('');
        setShowAddModal(false);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error('Error adding profile:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#141414', color: 'white' }}>
      <h1 style={{ fontSize: '3.5rem', fontWeight: '500', marginBottom: '30px' }}>Who&apos;s watching?</h1>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        {profiles.map((profile) => (
          <div 
            key={profile.profile_id} 
            onClick={() => onSelectProfile(profile.profile_id)}
            style={{ textAlign: 'center', cursor: 'pointer', width: '130px' }}
          >
            <div 
              style={{ width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '3px solid transparent', transition: 'all 0.2s ease', margin: '0 auto' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'white'; e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.profile_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#e50914', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold' }}>
                  {profile.profile_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <p style={{ marginTop: '12px', fontSize: '1.2rem', color: 'grey', fontWeight: '500' }}>{profile.profile_name}</p>
          </div>
        ))}

        {/* Add Profile Button Card */}
        <div 
          onClick={() => setShowAddModal(true)}
          style={{ textAlign: 'center', cursor: 'pointer', width: '130px' }}
        >
          <div 
            style={{ width: '120px', height: '120px', borderRadius: '8px', border: '3px dashed #555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#555', margin: '0 auto', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'white'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#555'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            +
          </div>
          <p style={{ marginTop: '12px', fontSize: '1.2rem', color: 'grey', fontWeight: '500' }}>Add Profile</p>
        </div>
      </div>

      {/* Add Profile Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleCreateProfile} style={{ backgroundColor: '#181818', padding: '40px', borderRadius: '8px', width: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2>Add Profile</h2>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Add a profile for another person watching on this account.</p>
            <input 
              type="text" 
              placeholder="Name" 
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              required
              style={{ padding: '12px', backgroundColor: '#333', border: 'none', color: 'white', borderRadius: '4px', fontSize: '1rem', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                style={{ padding: '10px 20px', backgroundColor: 'transparent', color: 'white', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={{ padding: '10px 20px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}