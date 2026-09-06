import { useState, useEffect } from 'react';

// Accept onPlayMovie as a prop from App.jsx
export default function Banner({ profileId, onPlayMovie }) {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBannerMovies = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/movies/genre/Rom-Com');
        const data = await response.json();
        if (data.length > 0) {
          setMovies(data);
        }
      } catch (err) {
        console.error('Error fetching banner movies:', err);
      }
    };
    fetchBannerMovies();
  }, []);

  // Auto-slide timer (every 6 seconds)
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  return (
    <header 
      className="banner"
      style={{
        height: "450px",
        position: "relative",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "30px",
        overflow: "hidden"
      }}
    >
      <img 
        src={currentMovie.thumbnail_url} 
        alt={currentMovie.title}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          zIndex: 0
        }}
      />

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(180deg, transparent, rgba(20,20,20,0.9), #141414)', zIndex: 1 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.2)', zIndex: 1 }} />

      {/* Left Scroll Arrow */}
      <button 
        onClick={handlePrev}
        style={{
          position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%',
          width: '45px', height: '45px', fontSize: '1.2rem', cursor: 'pointer', zIndex: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(229, 9, 20, 0.8)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
      >
        ❮
      </button>

      {/* Right Scroll Arrow */}
      <button 
        onClick={handleNext}
        style={{
          position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%',
          width: '45px', height: '45px', fontSize: '1.2rem', cursor: 'pointer', zIndex: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(229, 9, 20, 0.8)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
      >
        ❯
      </button>

      {/* Banner content */}
      <div className="banner-contents" style={{ zIndex: 2, maxWidth: '600px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          {currentMovie.title}
        </h1>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.4', marginBottom: '1.2rem', textShadow: '1px 1px 3px black' }}>
          {currentMovie.description || "Stream the best cinematic experiences right here on your custom platform."}
        </p>
        <div className="banner-buttons">

         {/* Banner Play Button */}
        <button 
          onClick={() => {
            if (typeof onPlayMovie === 'function') {
              onPlayMovie(currentMovie);
            } else {
            console.log("Playing:", currentMovie.title);
            }        
          }}
            style={{ padding: '10px 24px', backgroundColor: 'white', color: 'black', fontWeight: 'bold', fontSize: '1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
            ▶Play
        </button>

        </div>
      </div>
    </header>
  );
}