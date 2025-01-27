const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const http = require('http');
const multer = require('multer');
const imagekit = require('./imagekit-config');
const Vimeo = require('vimeo').Vimeo;
const app = express();
const server = http.createServer(app);
const client_id = '7d9e0c9442b7ab2a99a475fa22f5e67aa3b2b09e';
const client_secret = 'nsClLrSxoCQxdhDi1c90AlDL4qAztimELgoI9DC2UmcTf3SPCO3b0NxX5OZE5TX3Kpi1i0f0Lw5vSTtx92PSXZclyY3OXvSBowhBoOg30x6XQ5UQQqzFD7i311+Xj7tS';
const access_token = 'df25870717f8a6fb8653ce5c9a4e28a6';

const vimeoClient = new Vimeo(client_id, client_secret, access_token);
// Database connection configuration
// Database connection configuration
const pool = new Pool({
  user: 'postgres.fyicvakkuqjejskhmrwa',
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  database: 'postgres', // default Supabase database
  password: 'Hunzamabhisvo#19', // Enter your password here
  port: 6543,
})
;

// Set up CORS middleware
app.use(cors({ origin: true, credentials: true }));

// Middleware to parse JSON requests
app.use(express.json());

// Set up session middleware
app.use(
  session({
    store: new pgSession({
      pool: pool, // Use the existing PostgreSQL pool
      tableName: 'session', // Name of the table to store sessions
    }),
    secret: 'your_secret_key', // Replace with a secure secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
    },
  })
);

// Route to select and validate branch
app.post('/select-branch', async (req, res) => {
  try {
    const { branch_id } = req.body;

    // Ensure branch_id is provided
    if (!branch_id) {
      return res.status(400).json({ error: 'Branch ID is required' });
    }

    // Validate if branch exists in the database
    const branchResult = await pool.query('SELECT branch_id FROM public.branches WHERE branch_id = $1', [branch_id]);

    if (branchResult.rowCount === 0) {
      return res.status(404).json({ error: `Branch with ID ${branch_id} does not exist` });
    }

    // Store the branch ID in the session
    req.session.branch_id = branch_id;
    res.json({ message: `Branch ${branch_id} selected successfully`, branch_id });
  } catch (err) {
    console.error('Error setting branch in session:', err);
    res.status(500).json({ error: 'An error occurred while selecting the branch' });
  }
});

// Route to fetch all branches
app.get('/branches', async (req, res) => {
  try {
    const result = await pool.query('SELECT branch_id, "name", parent_branch_id, "location" FROM public.branches');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching branches:', err);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});
app.get('/sermons', async (req, res) => {
  try {
    // Fetch all sermon details from the database
    const result = await pool.query(
      `SELECT id, title, speaker, description, video_link, thumbnail, "date", branch_id
       FROM public.sermons`
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'No sermons found' });
    }

    // Send all sermon data as a JSON response
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching sermons:', err);
    res.status(500).json({ error: 'An error occurred while fetching the sermons' });
  }
});
// GET Featured Sermon
app.get('/featured', async (req, res) => {
  try {
    // Query to fetch the featured sermon
    const query = `
      SELECT id, title, speaker, description, video_link, thumbnail, "date", branch_id, is_featured, priority
      FROM public.sermons
      WHERE is_featured = TRUE
      ORDER BY priority ASC
      LIMIT 1;
    `;

    const result = await db.query(query);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]); // Send the featured sermon
    } else {
      res.status(404).json({ message: 'No featured sermon found' });
    }
  } catch (error) {
    console.error('Error fetching featured sermon:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Route to get the current branch from the session
app.get('/current-branch', (req, res) => {
  if (req.session.branch_id) {
    res.json({ branch_id: req.session.branch_id });
  } else {
    res.status(404).json({ error: 'No branch selected' });
  }
});
app.get('/devotions', async (req, res) => {
  try {
    // Check if branch_id is in the session or request
    const branchId = req.session.branch_id || req.query.branch_id;

    if (!branchId) {
      return res.status(400).json({ error: 'Branch ID is required' });
    }

    // Get the current date (without time)
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Query the devotions table for the selected branch and today's date
    const devotionsResult = await pool.query(
      `SELECT id, title, "content", created_at, branch_id, is_general
       FROM public.dailydevotions
       WHERE branch_id = $1 AND created_at::date = $2`,
      [branchId, currentDate]
    );

    if (devotionsResult.rowCount === 0) {
      return res.status(404).json({ error: 'No devotions found for this branch and date' });
    }

    // Send the devotion(s) as a JSON response
    res.json(devotionsResult.rows);
  } catch (err) {
    console.error('Error fetching devotions:', err);
    res.status(500).json({ error: 'An error occurred while fetching devotions' });
  }
});
app.get('/todays-word', async (req, res) => {
  try {
    // Check if branch_id is in the session or request
    const branchId = req.session?.branch_id || req.query.branch_id;

    if (!branchId) {
      return res.status(400).json({ error: 'Branch ID is required' });
    }

    // Get the current date (without time)
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Query the todays_word table for the selected branch and today's date
    const wordResult = await pool.query(
      `SELECT id, scripture, content, branch_id, date, created_at
       FROM public.todays_word
       WHERE branch_id = $1 AND date = $2`,
      [branchId, currentDate]
    );

    if (wordResult.rowCount === 0) {
      return res.status(404).json({ error: 'No word found for this branch and date' });
    }

    // Send the word(s) as a JSON response
    res.json(wordResult.rows);
  } catch (err) {
    console.error('Error fetching "Today`s Word":', err);
    res.status(500).json({ error: 'An error occurred while fetching "Today\'s Word"' });
  }
});


// Route to fetch all announcements for the current branch
app.get('/announcements', async (req, res) => {
  try {
    // Check if branch_id is in the session or request
    const branchId = req.session.branch_id || req.query.branch_id;

    if (!branchId) {
      return res.status(400).json({ error: 'Branch ID is required' });
    }

    // Query the announcements table for the selected branch
    const announcementsResult = await pool.query(
      'SELECT id, title, content, created_at FROM public.announcements WHERE branch_id = $1 ORDER BY created_at DESC',
      [branchId]
    );

    if (announcementsResult.rowCount === 0) {
      return res.status(404).json({ error: 'No announcements found for this branch' });
    }

    // Send the announcements as a JSON response
    res.json(announcementsResult.rows);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'An error occurred while fetching announcements' });
  }
});

// Route to fetch a specific announcement by ID
app.get('/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Query the announcements table for the specific ID
    const announcementResult = await pool.query(
      'SELECT id, title, content, created_at FROM public.announcements WHERE id = $1',
      [id]
    );

    if (announcementResult.rowCount === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    // Send the specific announcement as a JSON response
    res.json(announcementResult.rows[0]);
  } catch (err) {
    console.error('Error fetching announcement:', err);
    res.status(500).json({ error: 'An error occurred while fetching the announcement' });
  }
});
// Set up multer storage (in-memory for simplicity)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST route to upload an image (e.g., poster)
app.post('/upload-poster', upload.single('poster'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Upload the image to ImageKit
  try {
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer, // The image file as a buffer
      fileName: req.file.originalname, // The name of the file
      folder: '/event-posters', // Optional: store images in a specific folder
    });

    // Respond with the URL of the uploaded image
    res.status(200).send({
      message: 'File uploaded successfully',
      fileUrl: uploadResponse.url, // URL to access the uploaded image
    });
  } catch (error) {
    res.status(500).send({
      message: 'Failed to upload image',
      error: error.message,
    });
  }
});

// Route to create a new announcement
app.post('/announcements', async (req, res) => {
  try {
    const branchId = req.session.branch_id || req.body.branch_id;
    const { title, content } = req.body;

    if (!branchId || !title || !content) {
      return res.status(400).json({ error: 'Branch ID, title, and content are required' });
    }

    // Insert the new announcement into the announcements table
    const result = await pool.query(
      'INSERT INTO public.announcements (branch_id, title, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id',
      [branchId, title, content]
    );

    res.status(201).json({ message: 'Announcement created successfully', id: result.rows[0].id });
  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(500).json({ error: 'An error occurred while creating the announcement' });
  }
});
// Route to fetch event posters for the current branch
app.get('/notices', async (req, res) => {
  try {
    // Retrieve the branch ID from the session
    const branchId = req.session.branch_id;

    // Check if the branch ID exists in the session
    if (!branchId) {
      return res.status(400).json({ error: 'Branch ID is required. Please select a branch first.' });
    }

    // Query the event_posters table for the posters associated with the branch
    const postersResult = await pool.query(
      `SELECT id, branch_id, event_name, poster_url, upload_time
       FROM public.event_posters
       WHERE branch_id = $1
       ORDER BY upload_time DESC`,
      [branchId]
    );

    // Check if any posters were found
    if (postersResult.rowCount === 0) {
      return res.status(404).json({ error: 'No event posters found for this branch.' });
    }

    // Send the posters as a JSON response
    res.json(postersResult.rows);
  } catch (err) {
    console.error('Error fetching event posters:', err);
    res.status(500).json({ error: 'An error occurred while fetching event posters.' });
  }
});
app.get('/vimeo-video/:videoId', (req, res) => {
  const { videoId } = req.params;

  // Vimeo API request to fetch video details
  vimeoClient.request(
    {
      method: 'GET',
      path: `/videos/${videoId}`,
    },
    (error, body) => {
      if (error) {
        console.error('Error fetching Vimeo video data:', error);
        return res.status(500).json({ message: 'Error fetching Vimeo video data' });
      }

      // Send Vimeo video data as JSON response
      res.json(body);
    }
  );
});

// Start the server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
