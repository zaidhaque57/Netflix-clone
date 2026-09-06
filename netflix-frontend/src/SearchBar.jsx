import { useState } from 'react';

export default function SearchBar({ onMovieClick }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    if (searchQuery.trim() === '') {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/movies/search?q=${searchQuery}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setResults(data);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <div style={{ padding: '20px 30px' }}>
      {/* Search Input */}
      <input 
        type="text"
        placeholder="Search for movies, genres, or shows..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '12px 20px',
          backgroundColor: '#222',
          border: '1px solid #444',
          color: 'white',
          borderRadius: '4px',
          fontSize: '1rem',
          outline: 'none',
          marginBottom: '20px'
        }}
      />

      {/* Search Results Row */}
      {results.length > 0 && (
        <div>
          <h3 style={{ color: 'white', marginBottom: '15px' }}>Search Results</h3>
          <div style={{ display: 'flex', overflowX: 'auto', gap: '15px', paddingBottom: '10px', scrollbarWidth: 'none' }}>
            {results.map((movie) => (
              <div 
                key={movie.movies_id} 
                onClick={() => onMovieClick && onMovieClick(movie)}
                style={{ minWidth: '160px', flex: '0 0 auto', textAlign: 'center', cursor: 'pointer' }}
              >
                <img 
                  src={movie.thumbnail_url} 
                  alt={movie.title} 
                  style={{ width: '160px', height: '230px', objectFit: 'cover', borderRadius: '4px', transition: 'transform 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <p style={{ color: 'white', fontSize: '14px', marginTop: '8px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {movie.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}