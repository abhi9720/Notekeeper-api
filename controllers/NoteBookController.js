const Notebook = require('../models/Notebook')

exports.createNotebook = async (req, res) => {
    try {
        const { name } = req.body;
        const createdBy = req.user.id;
        const notebook = new Notebook({
            name,
            createdBy,
        });

        await notebook.save();
        res.json(notebook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create a Notebook.' });
    }
};


exports.getNotebooks = async (req, res) => {
    try {
        const authUserId = req.user.id;

        const noteBooks = await Notebook.find({ createdBy: authUserId })

        if (!noteBooks) {
            return res.status(404).json({ message: "NoteBook Not Found" })
        }

        res.json(noteBooks)

    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch Notebooks' });
    }
}


exports.getNotebookById = async (req, res) => {
    try {
        const authUserId = req.user.id;
        const { notebookId } = req.params
        const noteBook = await Notebook.findOne({ _id: notebookId, createdBy: authUserId });

        if (!noteBook) {
            return res.status(404).json({ error: 'Notebook not found or not owned by the authenticated user.' });
        }
        res.json(noteBook)
    }
    catch (error) {

    }
}


exports.updateNotebook = async (req, res) => {
    try {
        const { notebookId } = req.params;
        const { name } = req.body;
        const createdBy = req.user.id; // Get the ID of the authenticated user

        const notebook = await Notebook.findOne({ _id: notebookId, createdBy });

        if (!notebook) {
            return res.status(404).json({ error: 'Notebook not found or not owned by the authenticated user.' });
        }

        notebook.name = name; // Update the notebook name
        await notebook.save();
        res.json(notebook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update the notebook.' });
    }
};


exports.deleteNotebook = async (req, res) => {
    try {
        const { notebookId } = req.params;
        const createdBy = req.user.id; // Get the ID of the authenticated user

        const notebook = await Notebook.findOne({ _id: notebookId, createdBy });

        if (!notebook) {
            return res.status(404).json({ error: 'Notebook not found or not owned by the authenticated user.' });
        }

        await Notebook.deleteOne({ _id: notebook._id });
        res.json({ message: 'Notebook deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete the notebook.' });
    }
};