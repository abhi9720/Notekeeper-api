const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sharedNotebookSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    notebook: { type: Schema.Types.ObjectId, ref: 'Notebook' },
    permissions: {
        view: Boolean,
        edit: Boolean,
        delete: Boolean,
    },
});

const SharedNotebook = mongoose.model('SharedNotebook', sharedNotebookSchema);
module.exports = SharedNotebook;
