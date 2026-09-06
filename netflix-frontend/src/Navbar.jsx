import { useState } from 'react';

export default function Navbar({ activeTab, setActiveTab, currentProfile, onOpenEdit, onSwitchProfiles, onSignOut, onOpenSearch }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#141414', borderBottom: '1px solid #333', position: 'sticky', top: 0, zIndex: 100 }}>
      
      {/* Left Section: Logo & Symbol Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
        <h1 
          style={{ color: '#e50914', margin: 0, fontSize: '1.8rem', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '1px' }} 
          onClick={() => setActiveTab('Home')}
        >
          NETFLIX
        </h1>
        
        {/* Symbol / Icon Navigation Menu */}
        <ul style={{ display: 'flex', listStyle: 'none', gap: '25px', margin: 0, padding: 0, fontSize: '15px', fontWeight: '500', alignItems: 'center' }}>
          
          {/* Home Symbol */}
          <li 
            onClick={() => setActiveTab('Home')}
            style={{ cursor: 'pointer', color: activeTab === 'Home' ? 'white' : '#b3b3b3', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}
          >
            <span>🏠</span> <span className="nav-text" style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>Home</span>
          </li>

          {/* Search Symbol */}
          <li 
            onClick={() => {
              setActiveTab('Home');
              // Scroll down smoothly to the search bar if on home
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            style={{ cursor: 'pointer', color: '#b3b3b3', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
          >
            <span>🔍</span> Search
          </li>

          {/* Movies / Categories Symbol */}
          <li 
            onClick={() => setActiveTab('Rom-Com')}
            style={{ cursor: 'pointer', color: ['Rom-Com', 'Thriller', 'Anime', 'Education'].includes(activeTab) ? 'white' : '#b3b3b3', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
          >
            <span>🎬</span> Movies
          </li>

          {/* Trending / Top 10 Symbol */}
          <li 
            onClick={() => setActiveTab('Home')}
            style={{ cursor: 'pointer', color: '#b3b3b3', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
          >
            <span>🔥</span> Trending
          </li>

          {/* Plus / My List Symbol */}
          <li 
            onClick={() => setActiveTab('My List')}
            style={{ cursor: 'pointer', color: activeTab === 'My List' ? 'white' : '#b3b3b3', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
          >
            <span>➕</span> My List
          </li>

        </ul>
      </div>

      {/* Right Section: Profile Avatar & Overlay Dropdown Menu */}
      <div style={{ position: 'relative' }}>
        <div 
          onClick={() => setShowDropdown(!showDropdown)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          {currentProfile?.avatar_url ? (
            <img 
              src={currentProfile.avatar_url} 
              alt={currentProfile.profile_name} 
              style={{ width: '38px', height: '38px', borderRadius: '4px', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '38px', height: '38px', borderRadius: '4px', backgroundColor: '#e50914', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {currentProfile?.profile_name?.charAt(0).toUpperCase() || 'N'}
            </div>
          )}
          <span style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>▼</span>
        </div>

        {/* Overlay Dropdown Menu */}
        {showDropdown && (
          <div style={{ position: 'absolute', right: 0, top: '50px', backgroundColor: 'rgba(0,0,0,0.95)', border: '1px solid #333', borderRadius: '4px', width: '180px', padding: '10px 0', display: 'flex', flexDirection: 'column', boxShadow: '0px 4px 12px rgba(0,0,0,0.8)', zIndex: 200 }}>
            <button 
              onClick={() => { setShowDropdown(false); onOpenEdit(); }}
              style={{ background: 'none', border: 'none', color: 'white', padding: '10px 20px', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Edit Profile
            </button>
            <button 
              onClick={() => { setShowDropdown(false); onSwitchProfiles(); }}
              style={{ background: 'none', border: 'none', color: 'white', padding: '10px 20px', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Switch Profiles
            </button>
            <button 
              onClick={() => { setShowDropdown(false); onSignOut(); }}
              style={{ background: 'none', border: 'none', color: 'white', padding: '10px 20px', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Sign Out of Netflix
            </button>
          </div>
        )}
      </div>

    </div>
  );
}