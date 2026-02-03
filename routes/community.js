const express = require("express");
const router = express.Router();
const pool = require("../db");

/**
 * Create a community post
 */
router.post("/", async (req, res) => {
  const { user_id, disease_id, image_url, description } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO community_posts
      (user_id, disease_id, image_url, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [user_id, disease_id || null, image_url, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

/**
 * Get feed (latest posts)
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        cp.id,
        cp.image_url,
        cp.description,
        cp.created_at,
        d.name AS disease_name
      FROM community_posts cp
      LEFT JOIN diseases d ON cp.disease_id = d.id
      ORDER BY cp.created_at DESC
      LIMIT 50
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to load feed" });
  }
});

module.exports = router;
