const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const ReminderScheduler = require('./services/ReminderScheduler');
const app = express();
const port = process.env.PORT || 3000;

// Load environment variables from .env file
dotenv.config();


const corsOptions = {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'UPDATE'],
    allowedHeaders: "*",
};



mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true },)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch(err => {
        console.log("Error in Connecting MongoDB", err);
    })



app.use(bodyParser.json());
app.use(cors(corsOptions));


const reminderScheduler = new ReminderScheduler();
reminderScheduler.start();

// API Routes
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/notesRoutes');
const NoteSharingRoutes = require('./routes/NoteSharingRoutes');
const NotebookSharingRoutes = require('./routes/NoteBookSharingRoutes');
const NoteBookRoutes = require('./routes/NoteBookRoutes');

app.use('/v1/auth', authRoutes);
app.use('/v1/note', noteRoutes);
app.use('/v1/shared-notes', NoteSharingRoutes);
app.use('/v1/shared-notebooks', NotebookSharingRoutes);
app.use('/v1/notebooks', NoteBookRoutes);

// Serve the Angular app from the 'public' directory
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
