const express = require('express');
const router = express.Router();

// Placeholder for dedicated domain classification layer
router.get('/', (req, res) => res.json({ status: 'active', route: 'domains' }));

module.exports = router;
