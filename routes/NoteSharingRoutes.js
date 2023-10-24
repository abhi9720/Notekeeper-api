const express = require('express');
const sharingController = require('../controllers/NotesharingController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Define routes for sharing and managing shared notes
router.post('/', verifyToken, sharingController.shareNote);
router.get('/', verifyToken, sharingController.getSharedNotes);
router.put('/:sharedNoteId', verifyToken, sharingController.updateSharedNote);
router.delete('/:sharedNoteId', verifyToken, sharingController.unshareNote);

module.exports = router;
