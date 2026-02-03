const express = require("express");
const router = express.Router();
const pool = require("../db");

/**
 * Save a share/report
 */
router.post("/", async (req, res) => {
  const { report_id, user_name, message, image_url, share_type } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO shared_reports
       (report_id, user_name, message, image_url, share_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [report_id, user_name, message, image_url, share_type]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save report share" });
  }
});

/**
 * Get all shares/reports
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sr.id, sr.report_id, sr.user_name, sr.message, sr.image_url, sr.share_type, sr.created_at
      FROM shared_reports sr
      ORDER BY sr.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch shared reports" });
  }
});

module.exports = router;
