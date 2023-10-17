const schedule = require('node-schedule');
const Note = require('../models/Note');
const User = require('../models/User');
const EmailSender = require('./EmailSender');

class ReminderScheduler {
    constructor () {
        this.job = null;
    }

    async start() {
        // Create a job to run every minute
        console.log("cron job running");
        const fifteenMinutesFromNow = new Date(Date.now() + 15 * 60 * 1000);

        schedule.scheduleJob('*/1 * * * *', async () => {
            console.log("running.........");
            try {
                const notes = await Note.find({
                    remainderDate: { $lte: fifteenMinutesFromNow },
                    hasSentReminder: false,
                });


                for (const note of notes) {
                    // Find the user associated with the note
                    const user = await User.findById(note.createdBy);
                    console.log("senidng email ");
                    const data = {
                        title: note.title,
                        body: note.body,
                        url: process.env.frontendURL + "/dashboard/remainder",
                    };
                    await this.sendEmail(user.email, "Remainder: " + note.title, "remainder_email_templates", data);

                    note.hasSentReminder = true;
                    await note.save();
                    console.log("note.hasSentReminder = true");
                }
            } catch (error) {
                console.error('Error in ReminderScheduler:', error);
            }
        });
    }

    async sendEmail(to, subject, templateName, data) {
        console.log(to, subject, templateName, data);

        new EmailSender().sendEmail(to, subject, templateName, data)
    }
}

module.exports = ReminderScheduler;
