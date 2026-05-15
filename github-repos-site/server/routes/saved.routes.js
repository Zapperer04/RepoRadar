const express = require('express');
const router = express.Router();
const savedController = require('../controllers/saved.controller');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', savedController.getSavedRepos);
router.post('/', savedController.saveRepo);
router.delete('/:repoId', savedController.unsaveRepo);
router.get('/check/:owner/:repoName', savedController.checkSaved);

module.exports = router;
