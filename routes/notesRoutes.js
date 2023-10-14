const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notesController');
const verifyToken = require('../middleware/authMiddleware');

// Create a new note
router.post('/', verifyToken, noteController.createNote);

// Get all notes
router.get('/', noteController.getUserNotes);

// Update a note's checkbox items
router.put('/:noteId/update-checkbox/:listItemIndex', verifyToken, noteController.updateCheckbox);

// update note
router.put('/:noteId', verifyToken, noteController.updateNote);

// Delete a note
router.delete('/:noteId', verifyToken, noteController.deleteNote);

module.exports = router;
