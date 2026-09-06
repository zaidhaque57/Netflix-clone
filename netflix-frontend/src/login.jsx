import { useState } from 'react';

export default function Login({ setLoggedInProfile }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show server error message if login failed
        setErrorMsg(data.error || 'Invalid email or password');
      } else {
        // Success! Pass the user_id up to App.jsx to trigger the Profile Selector
        setLoggedInProfile(data.user_id);
      }
    } catch (err) {
      console.error('Login request failed:', err);
      setErrorMsg('Something went wrong. Check backend connection.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#141414', color: 'white' }}>
      <h1 style={{ color: '#e50914', marginBottom: '20px' }}>NETFLIX CLONE</h1>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', background: 'rgba(0,0,0,0.75)', padding: '40px', borderRadius: '4px' }}>
        <h2 style={{ marginBottom: '20px' }}>Sign In</h2>
        
        {errorMsg && (
          <p style={{ color: '#e87c03', backgroundColor: '#e87c031a', padding: '10px', borderRadius: '4px', fontSize: '14px', marginBottom: '15px' }}>
            {errorMsg}
          </p>
        )}

        <input 
          type="email" 
          placeholder="Email or phone number" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '12px', marginBottom: '15px', background: '#333', border: 'none', color: 'white', borderRadius: '4px' }}
        />

        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '12px', marginBottom: '20px', background: '#333', border: 'none', color: 'white', borderRadius: '4px' }}
        />

        <button 
          type="submit" 
          style={{ padding: '12px', background: '#e50914', color: 'white', border: 'none', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}