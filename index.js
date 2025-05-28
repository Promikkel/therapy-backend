
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors({
  origin: "https://therapy-frontend.onrender.com"
}));
app.use(express.json());

// PostgreSQL connectie
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET /data: haal alle activiteiten op met likes
app.get("/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT activity_id, activity_name, likes FROM activities ORDER BY likes DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /like/:activityId: verhoog aantal likes
app.post("/like/:activityId", async (req, res) => {
  const activityId = req.params.activityId;
  try {
    await pool.query("UPDATE activities SET likes = likes + 1 WHERE activity_id = $1", [activityId]);
    res.json({ success: true });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /join/:activityId: voeg deelnemer toe
app.post("/join/:activityId", async (req, res) => {
  const activityId = req.params.activityId;
  const name = req.body.name;
  try {
    await pool.query("INSERT INTO participants (activity_id, name) VALUES ($1, $2)", [activityId, name]);
    res.json({ success: true });
  } catch (error) {
    console.error("Join error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`Server draait op poort ${port}`);
});
