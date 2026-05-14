const express = require('express');
const RepoController = require('../controllers/repo.controller');
const router = express.Router();

// Forward search queries to dedicated controller handler
router.get('/', RepoController.searchRepos);

module.exports = router;
