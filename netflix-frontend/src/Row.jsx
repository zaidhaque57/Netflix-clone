import { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import './Row.css';

export default function Row({ title, genre, profileId }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/movies/genre/${genre}`);
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, [genre]);

  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1, 
    },
  };

  const handleMovieClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl('');
    } else {
      // 1. If the movie has a direct video_key in the database, use it instantly!
      if (movie.video_key) {
        setTrailerUrl(movie.video_key);
      } else {
        // 2. Otherwise, fall back to searching via movie-trailer
        movieTrailer(movie.title || "")
          .then((url) => {
            if (url) {
              const urlParams = new URLSearchParams(new URL(url).search);
              setTrailerUrl(urlParams.get('v'));
            } else {
              setTrailerUrl('aqz-KE-bpKQ'); 
            }
          })
          .catch((error) => {
            console.log('Error finding trailer:', error);
            setTrailerUrl('aqz-KE-bpKQ'); 
          });
      }
    }
  };

  const handleAddToWatchlist = async (movieId) => {
    try {
      const response = await fetch('http://localhost:5001/api/watchlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile_id: profileId, movie_id: movieId }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Oops: ${data.error}`); 
      } else {
        alert('Success: Added to My List!');
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

 {movies.map((movie) => (
  <div key={movie.movies_id} className="poster-card" style={{ minWidth: '160px', flex: '0 0 auto', textAlign: 'center' }}>
    
    {/* Poster Image with proper movie scope */}
    <img 
      src={movie.thumbnail_url} 
      alt={movie.title} 
      className="poster-image"
      onClick={() => {
        if (typeof onPlayMovie === 'function') {
          onPlayMovie(movie);
        }
      }} 
      style={{ width: '160px', height: '230px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer', transition: 'transform 0.3s' }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    />
    
    <p style={{ color: 'white', fontSize: '14px', marginTop: '8px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {movie.title}
    </p>

    <button 
      className="add-button" 
      onClick={() => handleAddToWatchlist(movie.movies_id)}
      style={{ marginTop: '5px', backgroundColor: '#333', color: 'white', border: 'none', padding: '5px 10px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
    >
      + Add to List
    </button>
  </div>
))}

  return (
    <div className="row" style={{ marginBottom: '30px' }}>
      <h2 style={{ color: 'white', marginLeft: '20px', marginBottom: '10px' }}>{title}</h2>
      
      {/* Horizontal scrolling row */}
      <div className="row-posters" style={{ display: 'flex', overflowX: 'auto', padding: '20px', gap: '15px', scrollbarWidth: 'none' }}>
        {movies.map((movie) => (
          <div key={movie.movies_id} className="poster-card" style={{ minWidth: '160px', flex: '0 0 auto', textAlign: 'center' }}>
            
            {/* Poster Image */}
            <img 
              src={movie.thumbnail_url} 
              alt={movie.title} 
              className="poster-image"
              onClick={() => handleMovieClick(movie)} 
              style={{ width: '160px', height: '230px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer', transition: 'transform 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
            
            {/* Movie Title Clearly Visible Below Poster */}
            <p style={{ color: 'white', fontSize: '14px', marginTop: '8px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {movie.title}
            </p>

            {/* Add to Watchlist Button */}
            <button 
              className="add-button" 
              onClick={() => handleAddToWatchlist(movie.movies_id)}
              style={{ marginTop: '5px', backgroundColor: '#333', color: 'white', border: 'none', padding: '5px 10px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
            >
              + Add to List
            </button>
          </div>
        ))}
      </div>

      {/* Embedded Video Player Modal */}
      {trailerUrl && (
        <div className="video-modal" style={{ position: 'fixed', top: '10%', left: '15%', width: '70%', zIndex: 1000, background: '#141414', padding: '20px', borderRadius: '8px', boxShadow: '0px 0px 20px rgba(0,0,0,0.8)' }}>
          <button 
            className="close-video-btn" 
            onClick={() => setTrailerUrl('')}
            style={{ float: 'right', background: '#e50914', color: 'white', border: 'none', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px', marginBottom: '10px' }}
          >
            Close ✕
          </button>
          <YouTube videoId={trailerUrl} opts={opts} />
        </div>
      )}
    </div>
  );
}