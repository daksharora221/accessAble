import express from "express";
import pool from "../db/index.js";

const router = express.Router();

// ✅ Get all feedback for a specific place
router.get("/:place_id", async (req, res) => {
  const { place_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM feedback WHERE place_id = $1 ORDER BY created_at DESC",
      [place_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


// ✅ Add new feedback for a place and update average rating
router.post("/", async (req, res) => {
  const { place_id, username, rating, comment } = req.body;

  try {
    // 1️⃣ Insert new feedback
    const insertResult = await pool.query(
      `INSERT INTO feedback (place_id, username, rating, comment)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
      [place_id, username || "Anonymous", rating, comment]
    );

    // 2️⃣ Recalculate average rating for that place
    const avgResult = await pool.query(
      `SELECT COALESCE(AVG(rating), 0) AS avg_rating 
         FROM feedback 
         WHERE place_id = $1`,
      [place_id]
    );

    const avgRating = parseFloat(avgResult.rows[0].avg_rating).toFixed(1);

    // 3️⃣ Update the places table with the new average rating
    await pool.query(`UPDATE places SET rating = $1 WHERE id = $2`, [
      avgRating,
      place_id,
    ]);

    // 4️⃣ Respond with success message
    res.status(201).json({
      message: "Feedback added successfully",
      feedback: insertResult.rows[0],
      new_average: avgRating,
    });
  } catch (err) {
    console.error("Error adding feedback:", err);
    res.status(500).send("Server Error");
  }
});

export default router;