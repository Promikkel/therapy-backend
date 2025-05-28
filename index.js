const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors({
  origin: "https://therapy-frontend.onrender.com"
}));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Endpoint om alle activiteiten op te halen
app.get("/data", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT activity_id, activity_name, likes FROM activities ORDER BY likes DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Database error bij ophalen data:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Endpoint om likes te verhogen
app.post("/like/:activityId", async (req, res) => {
  const { activityId } = req.params;
  try {
    await pool.query(
      "UPDATE activities SET likes = likes + 1 WHERE activity_id = $1",
      [activityId]
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Database error bij like:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Endpoint om deelnemers toe te voegen
app.post("/join/:activityId", async (req, res) => {
  const { activityId } = req.params;
  const { name } = req.body;
  try {
    await pool.query(
      "INSERT INTO participants (activity_id, name) VALUES ($1, $2)",
      [activityId, name]
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Database error bij join:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Endpoint om deelnemers op te halen per activiteit
app.get("/participants/:activityId", async (req, res) => {
  const { activityId } = req.params;
  try {
    const result = await pool.query(
      "SELECT name FROM participants WHERE activity_id = $1",
      [activityId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Database error bij ophalen deelnemers:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`Server draait op poort ${port}`);
});


// Endpoint voor ophalen van likes per activiteit
app.get("/likes", async (req, res) => {
  try {
    const result = await pool.query("SELECT activity_id, likes FROM activities");
    res.json(result.rows);
  } catch (error) {
    console.error("Fout bij ophalen likes:", error);
    res.status(500).json({ error: "Database error" });
  }
});
