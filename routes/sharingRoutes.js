const express = require('express');
const router = express.Router();
const sharingController = require('../controllers/sharingController');
const verifyToken = require('../middleware/authMiddleware');

// Define routes for sharing and managing shared notes
router.post('/', verifyToken, sharingController.shareNote);
router.get('/', verifyToken, sharingController.getSharedNotes);
router.put('/:sharedNoteId', verifyToken, sharingController.updateSharedNote);
router.delete('/:sharedNoteId', verifyToken, sharingController.unshareNote);

module.exports = router;
