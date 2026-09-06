import { useState, useEffect } from 'react';

export default function MyList({ profileId, onMovieClick }) {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/watchlist/${profileId}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setWatchlist(data);
        }
      } catch (err) {
        console.error('Error fetching watchlist:', err);
      }
    };

    if (profileId) {
      fetchWatchlist();
    }
  }, [profileId]);

  const handleRemove = async (movieId, e) => {
    e.stopPropagation(); // Prevent opening the movie details when clicking remove
    try {
      const response = await fetch('http://localhost:5001/api/watchlist/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profileId, movie_id: movieId }),
      });

      if (response.ok) {
        setWatchlist(watchlist.filter((movie) => movie.movies_id !== movieId));
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  return (
    <div style={{ padding: '40px', minHeight: '80vh', backgroundColor: '#141414', color: 'white' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '30px' }}>My List</h1>

      {watchlist.length === 0 ? (
        <p style={{ color: '#888', fontSize: '1.2rem' }}>Your list is currently empty. Explore categories and add some movies!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
          {watchlist.map((movie) => (
            <div 
              key={movie.movies_id} 
              onClick={() => onMovieClick(movie)}
              style={{ textAlign: 'center', cursor: 'pointer', background: '#1f1f1f', borderRadius: '6px', overflow: 'hidden', paddingBottom: '10px', transition: 'transform 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img 
                src={movie.thumbnail_url} 
                alt={movie.title} 
                style={{ width: '100%', height: '250px', objectFit: 'cover' }}
              />
              <p style={{ fontSize: '14px', marginTop: '10px', fontWeight: '500', padding: '0 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {movie.title}
              </p>
              
              <button 
                onClick={(e) => handleRemove(movie.movies_id, e)}
                style={{ marginTop: '8px', backgroundColor: '#e50914', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', width: '85%' }}
              >
                ✕ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}