import { useState, useEffect } from 'react';

export default function WatchlistRow({ profileId }) {
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

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      const response = await fetch('http://localhost:5001/api/watchlist/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profileId, movie_id: movieId }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Oops: ${data.error}`);
      } else {
        // Remove the movie from state instantly without reloading the page
        setWatchlist(watchlist.filter((movie) => movie.movies_id !== movieId));
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  // If the watchlist is empty, don't render this row to avoid blank spaces
  if (watchlist.length === 0) return null;

  return (
    <div className="row" style={{ marginBottom: '30px' }}>
      <h2 style={{ color: 'white', marginLeft: '20px', marginBottom: '10px' }}>My List</h2>
      
      <div className="row-posters" style={{ display: 'flex', overflowX: 'auto', padding: '20px', gap: '15px', scrollbarWidth: 'none' }}>
        {watchlist.map((movie) => (
          <div key={movie.movies_id} className="poster-card" style={{ minWidth: '160px', flex: '0 0 auto', textAlign: 'center' }}>
            <img 
              src={movie.thumbnail_url} 
              alt={movie.title} 
              className="poster-image"
              style={{ width: '160px', height: '230px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
            />
            
            {/* Movie Title below poster */}
            <p style={{ color: 'white', fontSize: '14px', marginTop: '8px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {movie.title}
            </p>

            <button 
              onClick={() => handleRemoveFromWatchlist(movie.movies_id)}
              style={{ backgroundColor: '#e50914', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginTop: '5px', width: '100%', fontSize: '12px' }}
            >
              ✕ Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}