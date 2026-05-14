const express = require('express');
const router = express.Router();

// Placeholder for dedicated intelligence routing layer
router.get('/', (req, res) => res.json({ status: 'active', route: 'hiddenGems' }));

module.exports = router;
