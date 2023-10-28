const SharedNote = require('../models/SharedNote');
const Note = require('../models/Note');
const User = require('../models/User');

// Share a note with another user


const shareNote = async (req, res) => {
    try {
        const { noteId, sharedWith, permissions } = req.body;
        const authUserId = req.user?.id;
        console.log(noteId, sharedWith, permissions, authUserId);
        const note = await Note.findOne({ _id: noteId, createdBy: authUserId });

        if (!note) {
            return res.status(404).json({ error: 'Note not found or not owned by the authenticated user.' });
        }

        // Loop through the sharedWith array and process each email
        for (const email of sharedWith) {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: `User with email ${email} not found.` });
            }

            // Create a shared note entry for each user
            const sharedNote = new SharedNote({
                note: note._id,
                sharedWith: user._id,
                permissions,
            });

            // Save the shared note entry
            await sharedNote.save();

            // Update the user's sharedNotes field
            note.sharedWith.push(user._id);

            // Save changes to user and note
            await user.save();
        }

        await note.save();

        res.json({ message: 'Notes shared successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to share the note.' });
    }
};


// Get notes shared with the user
const getSharedNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Here", userId);

        // Find shared notes with the user
        const sharedNotes = await SharedNote.find({ sharedWith: userId }).populate('note');

        res.json(sharedNotes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch shared notes.' });
    }
};

// Update the permissions of a shared note
const updateSharedNote = async (req, res) => {
    try {
        const { sharedNoteId } = req.params;
        const { permissions } = req.body;
        const authUserId = req.user.id;

        // Validate the permissions object
        if (typeof permissions !== 'object' || permissions === null) {
            return res.status(400).json({ error: 'Invalid permissions object.' });
        }

        // Check if the authenticated user has the authorization to update this shared note
        const sharedNote = await SharedNote.findById(sharedNoteId).populate('note');

        if (!sharedNote) {
            return res.status(404).json({ error: 'Shared note not found.' });
        }

        // Check if the authenticated user can update this shared note
        if (sharedNote.note.createdBy.toString() !== authUserId) {
            return res.status(403).json({ error: 'Access denied. You do not have permission to update this shared note.' });
        }

        // Update the shared note's permissions
        const updatedSharedNote = await SharedNote.findByIdAndUpdate(sharedNoteId, { permissions }, { new: true });

        res.json(updatedSharedNote);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to update shared note permissions.' });
    }
};

// Unshare a note with a user
const unshareNote = async (req, res) => {
    try {
        const { sharedNoteId } = req.params;
        const authUserId = req.user?.id;

        // Check if the authenticated user has the authorization to unshare this note
        const sharedNote = await SharedNote.findById(sharedNoteId).populate('note');

        if (!sharedNote) {
            return res.status(404).json({ error: 'Shared note not found.' });
        }

        // Check if the authenticated user can unshare this shared note
        if (sharedNote.note.createdBy.toString() !== authUserId) {
            return res.status(403).json({ error: 'Access denied. You do not have permission to unshare this shared note.' });
        }

        // Remove the shared note reference from the user
        // await User.findByIdAndUpdate(sharedNote.sharedWith, { $pull: { sharedNotes: sharedNote._id } });

        // Remove the shared note reference from the note
        await Note.findByIdAndUpdate(sharedNote.note, { $pull: { sharedWith: sharedNote.sharedWith } });

        // Delete the shared note document
        await SharedNote.deleteOne({ _id: sharedNote._id });

        res.json(sharedNote);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to unshare the note.' });
    }
};


module.exports = { shareNote, getSharedNotes, updateSharedNote, unshareNote };
