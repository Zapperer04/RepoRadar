const express = require('express');
const router = express.Router();
const collectionsController = require('../controllers/collections.controller');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', collectionsController.getCollections);
router.post('/', collectionsController.createCollection);
router.get('/:id', collectionsController.getCollection);
router.put('/:id', collectionsController.updateCollection);
router.delete('/:id', collectionsController.deleteCollection);

router.post('/:id/repos', collectionsController.addRepoToCollection);
router.delete('/:id/repos/:savedRepoId', collectionsController.removeRepoFromCollection);

module.exports = router;
