import express from "express";
import pool from "../db/index.js";

const router = express.Router();

// Get nearby accessible places
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM places`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default router;
