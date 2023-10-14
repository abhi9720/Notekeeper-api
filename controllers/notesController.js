const Note = require('../models/Note');
const SharedNote = require('../models/SharedNote');
const User = require('../models/User');

// Create a new note
exports.createNote = async (req, res) => {
    try {
        const { title, color, body, listType, listItems, reminder } = req.body;
        const createdBy = req.user.id;


        const note = new Note({
            title,
            color,
            body,
            listType,
            listItems,
            createdBy,
            isReminder: reminder ? true : false,
            reminder: reminder ? new Date(reminder) : null,
        });

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
        const { noteId, listItemIndex } = req.params;
        const { checked } = req.body;

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

// Get all user-specific notes
exports.getUserNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const notes = await Note.find({ createdBy: userId }).populate('sharedWith');
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
        await Note.deleteOne({ _id: noteId });


        res.json({ message: 'Note deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete the note.' });
    }
};

