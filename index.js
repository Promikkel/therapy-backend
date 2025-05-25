
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// DATABASE CONFIG
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(cors({
  origin: 'https://therapy-frontend.onrender.com'
}));
app.use(express.json());

// Haal alle activiteiten op
app.get('/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM activities');
        res.json(result.rows.map(row => ({
            activityId: row.activity_id,
            likes: row.likes,
            participants: row.participants
        })));
    } catch (err) {
        res.status(500).send('Fout bij ophalen data');
    }
});

// Like toevoegen
app.post('/like/:activityId', async (req, res) => {
    const id = req.params.activityId;
    try {
        await pool.query('UPDATE activities SET likes = likes + 1 WHERE activity_id = $1', [id]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Fout bij liken');
    }
});

// Deelnemer toevoegen
app.post('/signup/:activityId', async (req, res) => {
    const id = req.params.activityId;
    const name = req.body.name;
    try {
        await pool.query('UPDATE activities SET participants = array_append(participants, $1) WHERE activity_id = $2', [name, id]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Fout bij aanmelden');
    }
});

app.listen(port, () => {
    console.log(`Server draait op poort ${port}`);
});
