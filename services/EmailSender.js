const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs').promises;
const path = require('path');

class EmailSender {
    constructor () {
        this.transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.email,
                pass: process.env.password,
            },
        });
    }


    async renderTemplate(templateName, data) {
        try {
            console.log(data);
            const templatePath = path.join(__dirname, 'email_templates', `${templateName}.ejs`);

            console.log(templatePath);
            const template = await fs.readFile(templatePath, 'utf8');
            return ejs.render(template, data);
        } catch (error) {
            throw new Error(`Template rendering error: ${error.message}`);
        }
    }


    async sendEmail(to, subject, templateName, data) {

        const html = await this.renderTemplate(templateName, data);

        const mailOptions = {
            // from: 'your-email@example.com',
            to,
            subject,
            html,
        };

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    console.log("resolved ");
                    resolve(info);
                }
            });
        });
    }
}

module.exports = EmailSender;
