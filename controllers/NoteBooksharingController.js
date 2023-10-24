const SharedNotebook = require('../models/SharedNotebook');
const Notebook = require('../models/Notebook');
const User = require('../models/User');

// Have to review 
//  Create a Shared Notebook
exports.createSharedNotebook = async (req, res) => {
    try {
        const { notebookId, sharedWith, permissions } = req.body;
        const createdBy = req.user.id;

        // Check if the user creating the shared notebook has access to it
        const notebook = await Notebook.findOne({ _id: notebookId, createdBy });
        if (!notebook) {
            return res.status(403).json({ error: 'You do not have permission to share this notebook.' });
        }

        const sharedNotebook = new SharedNotebook({
            notebook: notebookId,
            user: sharedWith,
            permissions,
        });

        const savedSharedNotebook = await sharedNotebook.save();

        res.json(savedSharedNotebook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create a shared notebook.' });
    }
};

// Get All Shared Notebooks for a User
exports.getSharedNotebooksByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const sharedNotebooks = await SharedNotebook.find({ user: userId }).populate('notebook');

        res.json(sharedNotebooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch shared notebooks.' });
    }
};

// Get Shared Notebook by ID
exports.getSharedNotebookById = async (req, res) => {
    try {
        const sharedNotebookId = req.params.sharedNotebookId;
        const sharedNotebook = await SharedNotebook.findOne({ _id: sharedNotebookId });

        if (!sharedNotebook) {
            return res.status(404).json({ error: 'Shared notebook not found.' });
        }

        res.json(sharedNotebook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch shared notebook.' });
    }
};

// Update Shared Notebook Permissions
exports.updateSharedNotebook = async (req, res) => {
    try {
        const sharedNotebookId = req.params.sharedNotebookId;
        const { permissions } = req.body;

        const updatedSharedNotebook = await SharedNotebook.findByIdAndUpdate(
            sharedNotebookId,
            { permissions },
            { new: true }
        );

        if (!updatedSharedNotebook) {
            return res.status(404).json({ error: 'Shared notebook not found.' });
        }

        res.json(updatedSharedNotebook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update shared notebook.' });
    }
};

// Delete Shared Notebook
exports.deleteSharedNotebook = async (req, res) => {
    try {
        const sharedNotebookId = req.params.sharedNotebookId;
        const deletedSharedNotebook = await SharedNotebook.findByIdAndRemove(sharedNotebookId);

        if (!deletedSharedNotebook) {
            return res.status(404).json({ error: 'Shared notebook not found.' });
        }

        res.json(deletedSharedNotebook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete shared notebook.' });
    }
};


// Get All Shared Notes in a Shared Notebook -  need to test this endpoint
exports.getSharedNotesBySharedNotebook = async (req, res) => {
    try {
        const sharedNotebookId = req.params.sharedNotebookId;
        const sharedNotes = await SharedNotebook.findOne({ _id: sharedNotebookId }).populate({
            path: 'notebook',
            populate: {
                path: 'notes',
                model: 'Note',
            },
        });

        if (!sharedNotes) {
            return res.status(404).json({ error: 'Shared notebook not found.' });
        }

        res.json(sharedNotes.notebook.notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch shared notes.' });
    }
};

// Create a Shared Note within a Shared Notebook
exports.createSharedNote = async (req, res) => {
    try {
        const sharedNotebookId = req.params.sharedNotebookId;
        const { title, body } = req.body;

        // Check if the user creating the shared note has access to the shared notebook
        const sharedNotebook = await SharedNotebook.findOne({ _id: sharedNotebookId });
        if (!sharedNotebook) {
            return res.status(403).json({ error: 'You do not have permission to share notes in this notebook.' });
        }

        const note = new Note({
            title,
            body,
            createdBy: req.user.id,
            isSharedNote: true,
            sharedWith: sharedNotebookId,
        });

        const savedNote = await note.save();

        res.json(savedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create a shared note.' });
    }
};

// Get Shared Note by ID within a Shared Notebook
exports.getSharedNote = async (req, res) => {
    try {
        const sharedNotebookId = req.params.sharedNotebookId;
        const sharedNoteId = req.params.sharedNoteId;

        const sharedNotebook = await SharedNotebook.findOne({ _id: sharedNotebookId });
        if (!sharedNotebook) {
            return res.status(403).json({ error: 'You do not have permission to access this note.' });
        }

        const note = await Note.findOne({ _id: sharedNoteId });

        if (!note) {
            return res.status(404).json({ error: 'Shared note not found.' });
        }

        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch shared note.' });
    }
};

// Update Shared Note Permissions within a Shared Notebook
exports.updateSharedNote = async (req, res) => {
    try {
        const sharedNotebookId = req.params.sharedNotebookId;
        const sharedNoteId = req.params.sharedNoteId;
        const { permissions } = req.body;

        // Check if the user updating permissions has access to the shared notebook
        const sharedNotebook = await SharedNotebook.findOne({ _id: sharedNotebookId });
        if (!sharedNotebook) {
            return res.status(403).json({ error: 'You do not have permission to update permissions for this note.' });
        }

        const updatedNote = await Note.findByIdAndUpdate(sharedNoteId, { permissions }, { new: true });

        if (!updatedNote) {
            return res.status(404).json({ error: 'Shared note not found.' });
        }

        res.json(updatedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update shared note permissions.' });
    }
};

// Delete Shared Note within a Shared Notebook
exports.deleteSharedNote = async (req, res) => {
    try {
        const sharedNotebookId = req.params.sharedNotebookId;
        const sharedNoteId = req.params.sharedNoteId;

        // Check if the user deleting the shared note has access to the shared notebook
        const sharedNotebook = await SharedNotebook.findOne({ _id: sharedNotebookId });
        if (!sharedNotebook) {
            return res.status(403).json({ error: 'You do not have permission to delete this note.' });
        }

        const deletedNote = await Note.findByIdAndRemove(sharedNoteId);

        if (!deletedNote) {
            return res.status(404).json({ error: 'Shared note not found.' });
        }

        res.json(deletedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete shared note.' });
    }
};
