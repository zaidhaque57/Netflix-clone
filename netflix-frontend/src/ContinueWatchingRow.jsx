import { useState, useEffect } from 'react';

export default function ContinueWatchingRow({ profileId, onMovieClick }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/history/${profileId}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setHistory(data);
        }
      } catch (err) {
        console.error('Error fetching continue watching:', err);
      }
    };

    if (profileId) {
      fetchHistory();
    }
  }, [profileId]);

  if (history.length === 0) return null;

  return (
    <div className="row" style={{ marginBottom: '30px' }}>
      <h2 style={{ color: 'white', marginLeft: '20px', marginBottom: '10px' }}>Continue Watching</h2>
      
      <div className="row-posters" style={{ display: 'flex', overflowX: 'auto', padding: '20px', gap: '15px', scrollbarWidth: 'none' }}>
        {history.map((movie) => (
          <div 
            key={movie.movies_id} 
            onClick={() => onMovieClick(movie)}
            className="poster-card" 
            style={{ minWidth: '180px', flex: '0 0 auto', textAlign: 'center', cursor: 'pointer', background: '#1f1f1f', borderRadius: '4px', overflow: 'hidden' }}
          >
            <div style={{ position: 'relative' }}>
              <img 
                src={movie.thumbnail_url} 
                alt={movie.title} 
                style={{ width: '180px', height: '110px', objectFit: 'cover', display: 'block' }}
              />
              {/* Play Icon Overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem' }}>
                  ▶
                </div>
              </div>
              {/* Red Progress Bar */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', backgroundColor: '#333' }}>
                <div style={{ width: '45%', height: '100%', backgroundColor: '#e50914' }} />
              </div>
            </div>
            
            <p style={{ color: 'white', fontSize: '13px', padding: '10px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
              {movie.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}