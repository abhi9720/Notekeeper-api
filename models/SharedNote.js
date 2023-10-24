const mongoose = require('mongoose');

const sharedNoteSchema = new mongoose.Schema({
    note: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
    },
    sharedWith: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    permissions: {
        view: Boolean,
        edit: Boolean,
        delete: Boolean
    },
});

const SharedNote = mongoose.model('SharedNote', sharedNoteSchema);
module.exports = SharedNote;
