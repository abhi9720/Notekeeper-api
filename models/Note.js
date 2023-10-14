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
    isReminder: { type: Boolean, default: false },
    reminder: {
        dateTime: Date,
    }
});

module.exports = mongoose.model('Note', noteSchema);
