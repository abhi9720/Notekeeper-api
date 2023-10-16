const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notebookSchema = new Schema({
    name: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }

});

const Notebook = mongoose.model('Notebook', notebookSchema);
module.exports = Notebook;
