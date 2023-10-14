const express = require('express');
const router = express.Router();
const sharingController = require('../controllers/sharingController');

// Define routes for sharing and managing shared notes
router.post('/', sharingController.shareNote);
router.get('/:noteId/shared', sharingController.getSharedNotes);
router.put('/:sharedNoteId', sharingController.updateSharedNote);
router.delete('/:sharedNoteId', sharingController.unshareNote);

module.exports = router;
