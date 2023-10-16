const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const notebookController = require('../controllers/NoteBookController');

const router = express.Router();

router.post('/', verifyToken, notebookController.createNotebook);
router.get('/', verifyToken, notebookController.getNotebooks);
router.get('/:notebookId', verifyToken, notebookController.getNotebookById);
router.put('/:notebookId', verifyToken, notebookController.updateNotebook);
router.delete('/:notebookId', verifyToken, notebookController.deleteNotebook);




module.exports = router;
