require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'h@quezaid419',
    database: 'NETFLIX'
}).promise();

// POST: Bulletproof Login (Safe against column name mismatches)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for:", email);

        // Fetch the user by email only
        const [users] = await db.query('SELECT * FROM USER WHERE email = ? LIMIT 1', [email]);

        if (users.length === 0) {
            console.log("Login failed: Email not found.");
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users[0];
        
        // Check whichever password column exists in your table (password_hash or password)
        const storedPassword = user.password_hash || user.password;

        if (storedPassword !== password) {
            console.log("Login failed: Incorrect password.");
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        console.log("Login successful for user_id:", user.user_id);
        res.json({ 
            message: 'Login successful', 
            user_id: user.user_id
        });

    } catch (error) {
        console.error('Server Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// POST: Add a new profile safely (handles manual IDs or Auto-Increment)
app.post('/api/profiles/add', async (req, res) => {
    try {
        const { user_id, profile_name, avatar_url } = req.body;
        const defaultAvatar = avatar_url || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png';

        // 1. Find the highest existing profile_id to generate a safe manual ID if needed
        const [maxIdResult] = await db.query('SELECT MAX(profile_id) as maxId FROM PROFILE');
        const nextId = (maxIdResult[0].maxId || 0) + 1;

        // 2. Insert with explicit profile_id to avoid auto-increment errors
        await db.query(
            'INSERT INTO PROFILE (profile_id, user_id, profile_name, avatar_url) VALUES (?, ?, ?, ?)',
            [nextId, user_id, profile_name, defaultAvatar]
        );

        res.status(201).json({ 
            message: 'Profile created successfully', 
            profile_id: nextId,
            profile_name,
            avatar_url: defaultAvatar
        });
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ error: error.message || 'Server error creating profile' });
    }
});

// PUT: Update profile name or avatar
app.put('/api/profiles/update', async (req, res) => {
    try {
        const { profile_id, profile_name, avatar_url } = req.body;

        await db.query(
            'UPDATE PROFILE SET profile_name = ?, avatar_url = ? WHERE profile_id = ?',
            [profile_name, avatar_url, profile_id]
        );

        res.status(200).json({ 
            message: 'Profile updated successfully', 
            profile_id, 
            profile_name, 
            avatar_url 
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Server error updating profile' });
    }
});

// GET: Fetch all profiles for a specific user_id
app.get('/api/profiles/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [profiles] = await db.query('SELECT * FROM PROFILE WHERE user_id = ?', [userId]);
        res.json(profiles);
    } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).json({ error: 'Server error fetching profiles' });
    }
});

// GET: Fetch movies by a specific genre
app.get('/api/movies/genre/:genre', async (req, res) => {
    try {
        const { genre } = req.params;
        const [movies] = await db.query('SELECT * FROM MOVIES WHERE genre = ?', [genre]);
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET: Search movies by title
app.get('/api/movies/search', async (req, res) => {
    try {
        const { query } = req.query;
        // Use wildcards (%) so it matches partial titles (e.g., "Inception" matches "The Inception")
        const searchQuery = `%${query}%`;
        
        const [movies] = await db.query('SELECT * FROM MOVIES WHERE title LIKE ?', [searchQuery]);
        res.json(movies);
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: 'Server error during search' });
    }
});

// GET: Fetch all movies
app.get('/api/movies', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM MOVIES');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching all movies:', error);
        res.status(500).json({ error: 'Server error fetching movies' });
    }
});

// POST: Add a movie to a profile's watchlist
app.post('/api/watchlist/add', async (req, res) => {
    try {
        const { profile_id, movie_id } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO WATCHLIST (profile_id, movies_id) VALUES (?, ?)', 
            [profile_id, movie_id]
        );
        
        res.status(201).json({
            message: 'Successfully added to My List!',
            watchlist_id: result.insertId
        });
        
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'This movie is already in your list.' });
        }
        console.error('Error adding to watchlist:', error);
        res.status(500).json({ error: 'Failed to add movie to watchlist' });
    }
});

// GET: Fetch the watchlist for a specific profile
app.get('/api/watchlist/:profileId', async (req, res) => {
    try {
        const profileId = req.params.profileId;
        
        const [movies] = await db.query(`
            SELECT MOVIES.* 
            FROM WATCHLIST 
            JOIN MOVIES ON WATCHLIST.movies_id = MOVIES.movies_id 
            WHERE WATCHLIST.profile_id = ?
        `, [profileId]);
        
        res.json(movies);
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        res.status(500).json({ error: 'Failed to fetch watchlist' });
    }
});

// GET: Fetch continue watching list for a profile
app.get('/api/history/:profile_id', async (req, res) => {
    try {
        const { profile_id } = req.params;
        const [rows] = await db.query(
            `SELECT m.*, h.progress_seconds, h.last_watched 
             FROM WATCH_HISTORY h 
             JOIN MOVIES m ON h.movie_id = m.movies_id 
             WHERE h.profile_id = ? 
             ORDER BY h.last_watched DESC`,
            [profile_id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching watch history:', error);
        res.status(500).json({ error: 'Server error fetching history' });
    }
});

// POST: Save or update watch progress when playing a movie
app.post('/api/history/save', async (req, res) => {
    try {
        const { profile_id, movie_id, progress_seconds } = req.body;
        
        // Check if entry already exists
        const [existing] = await db.query(
            'SELECT * FROM WATCH_HISTORY WHERE profile_id = ? AND movie_id = ?',
            [profile_id, movie_id]
        );

        if (existing.length > 0) {
            await db.query(
                'UPDATE WATCH_HISTORY SET progress_seconds = ?, last_watched = CURRENT_TIMESTAMP WHERE profile_id = ? AND movie_id = ?',
                [progress_seconds || 0, profile_id, movie_id]
            );
        } else {
            await db.query(
                'INSERT INTO WATCH_HISTORY (profile_id, movie_id, progress_seconds) VALUES (?, ?, ?)',
                [profile_id, movie_id, progress_seconds || 0]
            );
        }

        res.status(200).json({ message: 'Progress saved successfully' });
    } catch (error) {
        console.error('Error saving watch history:', error);
        res.status(500).json({ error: 'Server error saving progress' });
    }
});

// DELETE: Remove a movie from a profile's watchlist
app.delete('/api/watchlist/remove', async (req, res) => {
    try {
        const { profile_id, movie_id } = req.body;
        
        await db.query(
            'DELETE FROM WATCHLIST WHERE profile_id = ? AND movies_id = ?', 
            [profile_id, movie_id]
        );
        
        res.json({ message: 'Successfully removed from My List!' });
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        res.status(500).json({ error: 'Failed to remove movie from watchlist' });
    }
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});