const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notebookSchema = new Schema({
    name: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // Create array to store note as array
});

const Notebook = mongoose.model('Notebook', notebookSchema);
module.exports = Notebook;
