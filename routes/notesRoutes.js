const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notesController');
const verifyToken = require('../middleware/authMiddleware');

// Create a new note
router.post('/', verifyToken, noteController.createNote);
router.get('/remainders', verifyToken, noteController.getRemainders)

router.get('/:notebookId', verifyToken, noteController.getUserNotesByNoteBook);
router.put('/:noteId', verifyToken, noteController.updateNote);
router.delete('/:noteId', verifyToken, noteController.deleteNote);

router.put('/:noteId/update-checkbox/', verifyToken, noteController.updateCheckbox);
router.put('/:noteId/pin', verifyToken, noteController.toggleNotePin);
router.get('/pinned/all', verifyToken, noteController.getPinnedNotes)



module.exports = router;
