import nodemailer from 'nodemailer';
import config from '../config/configs.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.userNodemailer, 
        pass: config.passwordNodemailer
    }
});

export const sendEmail = async (email) => {
    await transporter.sendMail({
        from: 'CoderHouse 55575',
        to: email.to,
        subject: email.subject,
        html: email.html
    });
}