const express = require('express');
const sharedNotebookController = require('../controllers/NoteBooksharingController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', verifyToken, sharedNotebookController.createSharedNotebook);
router.get('/', verifyToken, sharedNotebookController.getSharedNotebooksByUser);
router.get('/:sharedNotebookId', verifyToken, sharedNotebookController.getSharedNotebookById);
router.put('/:sharedNotebookId', verifyToken, sharedNotebookController.updateSharedNotebook);
router.delete('/:sharedNotebookId', verifyToken, sharedNotebookController.deleteSharedNotebook);
router.get('/:sharedNotebookId/notes', verifyToken, sharedNotebookController.getSharedNotesBySharedNotebook);
router.post('/:sharedNotebookId/notes', verifyToken, sharedNotebookController.createSharedNote);
router.get('/:sharedNotebookId/notes/:sharedNoteId', verifyToken, sharedNotebookController.getSharedNote);
router.put('/:sharedNotebookId/notes/:sharedNoteId', verifyToken, sharedNotebookController.updateSharedNote);
router.delete('/:sharedNotebookId/notes/:sharedNoteId', verifyToken, sharedNotebookController.deleteSharedNote);
// router.get('/:sharedNotebookId/all-notes', verifyToken, sharedNotebookController.getAllNotesInSharedNotebook);


module.exports = router;
