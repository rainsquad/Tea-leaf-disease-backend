const express = require("express");
const router = express.Router();
const pool = require("../db");

/**
 * Save GPS location of a disease report
 */
router.post("/", async (req, res) => {
  const { disease_id, latitude, longitude, severity_override, notes } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO disease_reports
       (disease_id, latitude, longitude, severity_override, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [disease_id, latitude, longitude, severity_override, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save disease report" });
  }
});

/**
 * Get all disease reports
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        dr.id,
        dr.latitude,
        dr.longitude,
        dr.severity_override,
        dr.notes,
        dr.created_at,
        d.name AS disease_name
      FROM disease_reports dr
      JOIN diseases d ON dr.disease_id = d.id
      ORDER BY dr.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch disease reports" });
  }
});

module.exports = router;
