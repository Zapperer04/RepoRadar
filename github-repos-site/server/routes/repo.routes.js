const express = require('express');
const RepoController = require('../controllers/repo.controller');

const router = express.Router();

router.get('/', (req, res) => res.json({ status: 'active', service: 'repositories API layer' }));
router.get('/readme/:owner/:repo', RepoController.getReadme);
router.get('/search', RepoController.searchRepos);
router.post('/explain', RepoController.explainRepo);

module.exports = router;
