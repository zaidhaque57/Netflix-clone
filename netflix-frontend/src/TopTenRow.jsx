import { useState, useEffect } from 'react';

export default function TopTenRow({ profileId, onMovieClick }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/movies');
        const data = await response.json();
        if (Array.isArray(data)) {
          // Take top 10 movies for the ranking list
          setMovies(data.slice(0, 10));
        }
      } catch (err) {
        console.error('Error fetching top 10 movies:', err);
      }
    };
    fetchTopMovies();
  }, []);

  if (movies.length === 0) return null;

  return (
    <div className="row" style={{ marginBottom: '40px', paddingLeft: '20px' }}>
      <h2 style={{ color: 'white', marginBottom: '15px', fontSize: '1.4rem', fontWeight: 'bold' }}>
        🔥 Top 10 Movies Today
      </h2>
      
      <div style={{ display: 'flex', overflowX: 'auto', gap: '30px', paddingBottom: '15px', scrollbarWidth: 'none', alignItems: 'center' }}>
        {movies.map((movie, index) => (
          <div 
            key={movie.movies_id} 
            onClick={() => onMovieClick(movie)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
              flex: '0 0 auto',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {/* Large Netflix Top 10 Number Styling */}
            <span style={{ 
              fontSize: '110px', 
              fontWeight: '900', 
              color: '#141414', 
              WebkitTextStroke: '2px #555', 
              marginRight: '-20px', 
              zIndex: 2,
              userSelect: 'none',
              fontFamily: 'Impact, sans-serif'
            }}>
              {index + 1}
            </span>

            {/* Movie Poster */}
            <div style={{ zIndex: 3, position: 'relative' }}>
              <img 
                src={movie.thumbnail_url} 
                alt={movie.title} 
                style={{ width: '150px', height: '210px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.8)' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}