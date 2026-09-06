import { useState, useEffect } from 'react';

export default function MovieDetailsPage({ movie, profileId, onBack, onPlayMovie }) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('Season 1');
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  // Fetch suggestions based on the current movie's genre
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/movies/genre/${movie.genre}`);
        const data = await response.json();
        // Filter out the current movie from suggestions
        setSuggestions(data.filter(m => m.movies_id !== movie.movies_id));
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };
    fetchSuggestions();
    window.scrollTo(0, 0); // Scroll to top when opening detail page
  }, [movie]);

  const handleAddToWatchlist = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/watchlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profileId, movie_id: movie.movies_id }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(`Oops: ${data.error}`);
      } else {
        alert('Success: Added to My List!');
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  // Dummy episode lists for seasons
  const episodes = selectedSeason === 'Season 1' ? [
    { ep: 1, title: 'Pilot: The Beginning', duration: '45m', desc: 'The journey starts with unexpected twists and turns.' },
    { ep: 2, title: 'Deep Waters', duration: '50m', desc: 'Secrets are uncovered as alliances shift dramatically.' },
    { ep: 3, title: 'The Turning Point', duration: '42m', desc: 'An intense encounter changes everything for the main characters.' }
  ] : [
    { ep: 1, title: 'New Horizons', duration: '48m', desc: 'Returning with higher stakes and deeper mysteries.' },
    { ep: 2, title: 'Shadow Play', duration: '46m', desc: 'Trust is tested in the darkest hours of the mission.' }
  ];

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', color: 'white', paddingBottom: '60px' }}>
      
      {/* Back Button Navbar */}
      <div style={{ padding: '20px 40px', position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
        <button 
          onClick={onBack}
          style={{ background: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid #555', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
        >
          ← Back to Browse
        </button>
      </div>

      {/* Cinematic Banner Header */}
      <div style={{ position: 'relative', height: '500px', width: '100%' }}>
        <img 
          src={movie.thumbnail_url} 
          alt={movie.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,20,20,0.2) 40%, #141414 100%)' }} />
        
        {/* Title & Action Overlay */}
        <div style={{ position: 'absolute', bottom: '40px', left: '40px', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '15px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            {movie.title}
          </h1>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', fontSize: '15px', color: '#46d369', fontWeight: 'bold' }}>
            <span>98% Match</span>
            <span style={{ color: 'white' }}>2026</span>
            <span style={{ border: '1px solid grey', padding: '0 6px', color: 'white', fontSize: '12px', borderRadius: '3px' }}>HD</span>
            <span style={{ color: '#b3b3b3' }}>{movie.genre}</span>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={() => onPlayMovie(movie)}
              style={{ padding: '12px 30px', backgroundColor: 'white', color: 'black', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              ▶ Play Trailer
            </button>
            <button 
              onClick={handleAddToWatchlist}
              style={{ padding: '12px 25px', backgroundColor: 'rgba(109, 109, 110, 0.7)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {isInWatchlist ? '✓ Added to List' : '+ Add to List'}
            </button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#dddddd', marginBottom: '40px' }}>
          {movie.description || "An immersive cinematic experience available to stream right now on your custom platform. Follow the thrilling plot lines and deep character development through every scene."}
        </p>

        {/* Seasons & Episodes Section */}
        <div style={{ borderTop: '1px solid #333', paddingTop: '30px', marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Episodes</h2>
            
            {/* Season Selector Dropdown */}
            <select 
              value={selectedSeason} 
              onChange={(e) => setSelectedSeason(e.target.value)}
              style={{ padding: '8px 15px', backgroundColor: '#222', color: 'white', border: '1px solid #444', borderRadius: '4px', fontSize: '1rem', outline: 'none' }}
            >
              <option value="Season 1">Season 1</option>
              <option value="Season 2">Season 2</option>
            </select>
          </div>

          {/* Episode List Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {episodes.map((ep) => (
              <div 
                key={ep.ep}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1f1f1f', padding: '15px 20px', borderRadius: '8px', border: '1px solid #333' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#777' }}>{ep.ep}</span>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{ep.title}</h4>
                    <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>{ep.desc}</p>
                  </div>
                </div>
                <span style={{ fontSize: '0.9rem', color: '#888' }}>{ep.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions Section at the Bottom */}
        {suggestions.length > 0 && (
          <div style={{ borderTop: '1px solid #333', paddingTop: '30px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px' }}>More Like This</h2>
            <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none' }}>
              {suggestions.map((item) => (
                <div 
                  key={item.movies_id} 
                  onClick={() => window.location.reload()} // Or handle state transition
                  style={{ minWidth: '180px', flex: '0 0 auto', textAlign: 'center', cursor: 'pointer' }}
                >
                  <img 
                    src={item.thumbnail_url} 
                    alt={item.title} 
                    style={{ width: '180px', height: '250px', objectFit: 'cover', borderRadius: '6px', transition: 'transform 0.3s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <p style={{ fontSize: '14px', marginTop: '8px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}