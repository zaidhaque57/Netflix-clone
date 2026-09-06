import { useState, useEffect } from 'react';
import Row from './Row';
import WatchlistRow from './WatchlistRow';
import MyList from './MyList';
import Login from './login';
import ProfileSelector from './ProfileSelector';
import MovieDetailsPage from './MovieDetailsPage';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import Banner from './Banner';
import ContinueWatchingRow from './ContinueWatchingRow';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import TopTenRow from './TopTenRow';
import './index.css';

export default function App() {
  const [userId, setUserId] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // State for storing active profile details (avatar, name)
  const [currentProfile, setCurrentProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  const opts = {
    height: '390',
    width: '100%',
    playerVars: { autoplay: 1 },
  };

  const openEditModal = () => {
    setEditName(currentProfile?.profile_name || '');
    setEditAvatar(currentProfile?.avatar_url || '');
    setShowDropdown(false);
    setShowEditModal(true);
  };

  // Fetch profile details when profileId changes
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId) return;
      try {
        const response = await fetch(`http://localhost:5001/api/profiles/${userId}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          const matched = data.find(p => p.profile_id === Number(profileId));
          if (matched) setCurrentProfile(matched);
        }
      } catch (err) {
        console.error('Error fetching profile avatar:', err);
      }
    };
    fetchProfileData();
  }, [profileId, userId]);

  // Single, unified handlePlayMovie function with Watch History tracking
  const handlePlayMovie = (movie) => {
    fetch('http://localhost:5001/api/history/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_id: profileId, movie_id: movie.movies_id, progress_seconds: 120 })
    }).catch(err => console.error("Error saving history:", err));

    if (movie.video_key) {
      setTrailerUrl(movie.video_key);
    } else {
      movieTrailer(movie.title || "")
        .then((url) => {
          if (url) {
            const urlParams = new URLSearchParams(new URL(url).search);
            setTrailerUrl(urlParams.get('v'));
          } else {
            setTrailerUrl('aqz-KE-bpKQ');
          }
        })
        .catch(() => setTrailerUrl('aqz-KE-bpKQ'));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault(); 
    try {
      const response = await fetch('http://localhost:5001/api/profiles/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          profile_id: profileId, 
          profile_name: editName, 
          avatar_url: editAvatar 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCurrentProfile(data);
        setShowEditModal(false);
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error('Error updating profile network request:', err);
      alert("Network error updating profile. Check server terminal.");
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  // Authentication & Selection guards (Must be at the top before main render)
  if (!userId) {
    return <Login setLoggedInProfile={(id) => setUserId(id)} />;
  }

  if (!profileId) {
    return <ProfileSelector userId={userId} onSelectProfile={(pId) => setProfileId(pId)} />;
  }

  if (selectedMovie) {
    return (
      <>
        {trailerUrl && (
          <div className="video-modal" style={{ position: 'fixed', top: '10%', left: '50%', width: '90%', maxWidth: '900px', zIndex: 2000, background: '#141414', padding: '20px', borderRadius: '8px', transform: 'translateX(-50%)', boxShadow: '0px 0px 20px rgba(0,0,0,0.8)' }}>
            <button 
              onClick={() => setTrailerUrl('')}
              style={{ float: 'right', background: '#e50914', color: 'white', border: 'none', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px', marginBottom: '10px' }}
            >
              Close ✕
            </button>
            <YouTube videoId={trailerUrl} opts={opts} />
          </div>
        )}

        <MovieDetailsPage 
          movie={selectedMovie} 
          profileId={profileId} 
          onBack={() => setSelectedMovie(null)} 
          onPlayMovie={handlePlayMovie} 
        />
      </>
    );
  }

  return (
    <div className="app" style={{ backgroundColor: '#141414', minHeight: '100vh', color: 'white', paddingBottom: '50px' }}>
      
      {/* Symbol-Driven Navigation Bar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentProfile={currentProfile}
        onOpenEdit={openEditModal}
        onSwitchProfiles={() => setProfileId(null)}
        onSignOut={() => { setUserId(null); setProfileId(null); }}
      />

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleUpdateProfile} style={{ backgroundColor: '#181818', padding: '40px', borderRadius: '8px', width: '90%', maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '20px', color: 'white' }}>
            <h2>Edit Profile</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Profile Name</label>
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                style={{ padding: '12px', backgroundColor: '#333', border: 'none', color: 'white', borderRadius: '4px', fontSize: '1rem', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Avatar Image URL</label>
              <input 
                type="text" 
                value={editAvatar}
                onChange={(e) => setEditAvatar(e.target.value)}
                required
                style={{ padding: '12px', backgroundColor: '#333', border: 'none', color: 'white', borderRadius: '4px', fontSize: '1rem', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => setShowEditModal(false)}
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

      {/* Global Video Modal */}
      {trailerUrl && (
        <div className="video-modal" style={{ position: 'fixed', top: '10%', left: '50%', width: '90%', maxWidth: '900px', zIndex: 1000, background: '#141414', padding: '20px', borderRadius: '8px', transform: 'translateX(-50%)', boxShadow: '0px 0px 20px rgba(0,0,0,0.8)' }}>
          <button 
            onClick={() => setTrailerUrl('')}
            style={{ float: 'right', background: '#e50914', color: 'white', border: 'none', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px', marginBottom: '10px' }}
          >
            Close ✕
          </button>
          <YouTube videoId={trailerUrl} opts={opts} />
        </div>
      )}

      {/* Main Home Feed */}
      {activeTab === 'Home' && (
        <>
          <Banner profileId={profileId} onPlayMovie={handleMovieClick} />
          <SearchBar onMovieClick={handleMovieClick} />
          <TopTenRow profileId={profileId} onMovieClick={handleMovieClick} />
          <ContinueWatchingRow profileId={profileId} onMovieClick={handleMovieClick} />
          <WatchlistRow profileId={profileId} />
        </>
      )}

      {/* My List View */}
      {activeTab === 'My List' && (
        <MyList profileId={profileId} onMovieClick={handleMovieClick} />
      )}

      {/* Genre Rows */}
      <div style={{ marginTop: activeTab === 'Home' ? '0' : '40px' }}>
        {activeTab === 'Home' && (
          <>
            <Row title="Trending Rom-Coms" genre="Rom-Com" profileId={profileId} onPlayMovie={handleMovieClick} />
            <Row title="Cinematic Thrillers" genre="Thriller" profileId={profileId} onPlayMovie={handleMovieClick} />
            <Row title="Animation & Studio Ghibli Styles" genre="Anime" profileId={profileId} onPlayMovie={handleMovieClick} />
            <Row title="Tech & Education" genre="Education" profileId={profileId} onPlayMovie={handleMovieClick} />
          </>
        )}

        {activeTab === 'Rom-Com' && <Row title="Romance & Comedy Collection" genre="Rom-Com" profileId={profileId} onPlayMovie={handleMovieClick} />}
        {activeTab === 'Thriller' && <Row title="Suspenseful Thrillers" genre="Thriller" profileId={profileId} onPlayMovie={handleMovieClick} />}
        {activeTab === 'Anime' && <Row title="Anime & Artistic Realms" genre="Anime" profileId={profileId} onPlayMovie={handleMovieClick} />}
        {activeTab === 'Education' && <Row title="Computer Science & Technology" genre="Education" profileId={profileId} onPlayMovie={handleMovieClick} />}
      </div>
    </div>
  );
}