const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS eerst – laat alleen je frontend toe
app.use(cors({
  origin: 'https://therapy-frontend.onrender.com'
}));

// ✅ JSON parsing
app.use(express.json());

// ✅ PostgreSQL pool (Render gebruikt DATABASE_URL als env variable)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ✅ Route: alle data ophalen
app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM activities');
    res.json(result.rows.map(row => ({
      activityId: row.activity_id,
      likes: row.likes,
      participants: row.participants
    })));
  } catch (err) {
    console.error('Fout bij ophalen data:', err);
    res.status(500).send('Fout bij ophalen data');
  }
});

// ✅ Route: like toevoegen
app.post('/like/:activityId', async (req, res) => {
  const id = req.params.activityId;
  try {
    await pool.query('UPDATE activities SET likes = likes + 1 WHERE activity_id = $1', [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Fout bij liken:', err);
    res.status(500).send('Fout bij liken');
  }
});

// ✅ Route: deelnemer toevoegen
app.post('/signup/:activityId', async (req, res) => {
  const id = req.params.activityId;
  const name = req.body.name;
  try {
    await pool.query('UPDATE activities SET participants = array_append(participants, $1) WHERE activity_id = $2', [name, id]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Fout bij aanmelden:', err);
    res.status(500).send('Fout bij aanmelden');
  }
});

// ✅ Server starten
app.listen(port, () => {
  console.log(`Server draait op poort ${port}`);
});
