const express = require('express');
const router = express.Router();
const repoController = require('../controllers/repo.controller');

// Important: Specific routes must come before dynamic `/:owner/:repoName`

router.get('/search', repoController.searchRepos);
router.get('/hidden-gems', repoController.getHiddenGems);
router.get('/trending', repoController.getTrending);
router.get('/domains', repoController.getDomains);
router.get('/domain/:domain', repoController.getReposByDomain);

// Root
router.get('/', repoController.getRepos);

// Dynamic repo details
router.get('/:owner/:repoName/similar', repoController.getSimilarRepos);
router.get('/:owner/:repoName', repoController.getRepoDetails);

module.exports = router;
