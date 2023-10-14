const SharedNote = require('../models/SharedNote');
const Note = require('../models/Note');
const User = require('../models/User');

// Share a note with another user
const shareNote = async (req, res) => {
    try {
        const { noteId, sharedWith, permissions } = req.body;

        // Check if the note and user exist
        const note = await Note.findById(noteId);
        const user = await User.findOne({ email: sharedWith });

        if (!note || !user) {
            return res.status(404).json({ error: 'Note or user not found.' });
        }

        // Create a shared note entry
        const sharedNote = new SharedNote({
            note: note._id,
            sharedWith: user._id,
            permissions,
        });

        // Save the shared note entry
        await sharedNote.save();

        // Update the user's sharedNotes field
        user.sharedNotes.push(sharedNote._id);
        await user.save();

        res.json(sharedNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to share the note.' });
    }
};

// Get notes shared with the user
const getSharedNotes = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find shared notes with the user
        const sharedNotes = await SharedNote.find({ sharedWith: userId }).populate('note');

        res.json(sharedNotes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shared notes.' });
    }
};

// Update the permissions of a shared note
const updateSharedNote = async (req, res) => {
    try {
        const { sharedNoteId } = req.params;
        const { permissions } = req.body;

        const sharedNote = await SharedNote.findByIdAndUpdate(sharedNoteId, { permissions }, { new: true });

        if (!sharedNote) {
            return res.status(404).json({ error: 'Shared note not found.' });
        }

        res.json(sharedNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update shared note permissions.' });
    }
};

// Unshare a note with a user
const unshareNote = async (req, res) => {
    try {
        const { sharedNoteId } = req.params;

        const sharedNote = await SharedNote.findByIdAndRemove(sharedNoteId);

        if (!sharedNote) {
            return res.status(404).json({ error: 'Shared note not found.' });
        }

        // Remove the shared note reference from the user
        await User.findByIdAndUpdate(sharedNote.sharedWith, { $pull: { sharedNotes: sharedNote._id } });

        res.json(sharedNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to unshare the note.' });
    }
};

module.exports = { shareNote, getSharedNotes, updateSharedNote, unshareNote };
