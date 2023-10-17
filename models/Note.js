const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: String,
    color: String,
    body: String,
    listType: String,
    listItems: [
        {
            label: String,
            checked: Boolean,
        },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isRemainder: { type: Boolean, default: false },
    remainderDate: {
        type: Date,
    },
    isPinned: { type: Boolean, default: false },
    notebook: { type: Schema.Types.ObjectId, ref: 'Notebook' },
    hasSentReminder: { type: Boolean, default: false },
});

module.exports = mongoose.model('Note', noteSchema);
