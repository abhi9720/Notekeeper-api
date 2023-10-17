const Note = require('../models/Note');
const SharedNote = require('../models/SharedNote');
const User = require('../models/User');

// Create a new note
exports.createNote = async (req, res) => {
    try {
        const { title, color, body, listType, listItems, notebookId, remainderDate } = req.body;
        const createdBy = req.user.id;

        console.log(req.body, title, color, body, listType, listItems, notebookId, remainderDate);

        console.log(remainderDate ? true : false);
        const note = new Note({
            title,
            color,
            body,
            listType,
            listItems,
            createdBy,
            notebook: notebookId,
            isRemainder: remainderDate ? true : false,
            remainderDate: remainderDate ? new Date(remainderDate) : null,
        });

        console.log(note);

        const savedNote = await note.save();



        res.json(savedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create a new note.' });
    }
};

// Update a note's checkbox items

exports.updateCheckbox = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { listItemIndex, checked } = req.body;

        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({ error: 'Note not found.' });
        }

        note.listItems[listItemIndex].checked = checked;
        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update checkbox item.' });
    }
};

exports.getUserNotesByNoteBook = async (req, res) => {
    try {
        const userId = req.user.id;
        const { notebookId } = req.params;
        const notes = await Note.find({ createdBy: userId, notebook: notebookId }).populate('sharedWith');
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user-specific notes.' });
    }
};

// Get a specific note by ID
exports.getNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await Note.findById(noteId).populate('sharedWith');
        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch the note.' });
    }
};

// Update a note by ID
exports.updateNote = async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const createdBy = req.user.id;

        console.log(noteId, createdBy);
        // Check if the note belongs to the user
        const note = await Note.findOne({ _id: noteId, createdBy });
        if (!note) {
            return res.status(403).json({ error: 'Access denied. You do not have permission to update this note.' });
        }

        const { title, color, body, listType, listItems, reminder } = req.body;

        note.title = title;
        note.color = color;
        note.body = body;
        note.listType = listType;
        note.listItems = listItems;
        note.reminder = reminder;

        await note.save();


        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update the note.' });
    }
};

// Delete a note by ID
exports.deleteNote = async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const createdBy = req.user.id; // Assuming you're using Passport for authentication

        // Check if the note belongs to the user
        const note = await Note.findOne({ _id: noteId, createdBy });

        if (!note) {
            return res.status(403).json({ error: 'Access denied. You do not have permission to delete this note.' });
        }

        // Check if the note is shared with other users
        if (note.sharedWith.length > 0) {
            // Remove shared references in the SharedNote collection
            await SharedNote.deleteMany({ note: noteId });

            // Remove shared references from the note itself
            note.sharedWith = [];
            await note.save();
        }

        // Delete the note
        await Note.deleteOne({ _id: noteId });

        res.json({ message: 'Note deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete the note.' });
    }
};


exports.toggleNotePin = async (req, res) => {
    try {
        const { noteId } = req.params;
        const createdBy = req.user.id;
        const note = await Note.findOne({ _id: noteId, createdBy });


        if (!note) {
            return res.status(404).json({ error: 'Note not found.' });
        }

        // Toggle the isPinned status
        note.isPinned = !note.isPinned;

        // Save the updated note
        const updatedNote = await note.save();

        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle note pin status.' });
    }
};


exports.getPinnedNotes = async (req, res) => {

    try {
        const userId = req.user.id;

        const pinnedNotes = await Note.find({ createdBy: userId, isPinned: true }).populate("notebook");

        res.json(pinnedNotes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch pinned notes.' });
    }
};


exports.getRemainders = async (req, res) => {

    try {
        const userId = req.user.id;

        const remainder = await Note.find({ createdBy: userId, isRemainder: true });

        res.json(remainder);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch Remainder notes.' });
    }

}