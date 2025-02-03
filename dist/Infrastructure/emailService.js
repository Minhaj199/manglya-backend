var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
export class EmailService {
    constructor() {
        this.userName = process.env.GOOGLE_USERNAME;
        this.password = process.env.GOOGLE_PASSWORD;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.userName,
                pass: this.password,
            },
        });
    }
    sendEmail(to, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: this.userName,
                to,
                subject,
                html: body,
            };
            try {
                const result = yield this.transporter.sendMail(mailOptions);
            }
            catch (error) {
                console.error('Error sending email:', error);
                throw new Error('Failed to send email');
            }
        });
    }
}
