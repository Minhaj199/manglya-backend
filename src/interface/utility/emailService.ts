import nodemailer,{Transporter} from 'nodemailer'
import { IEmailService } from '../../types/TypesAndInterfaces.ts'; 
import dotenv from 'dotenv'
dotenv.config()
export class EmailService implements IEmailService{
    private transporter: Transporter;
    private userName:string|undefined
    private password:string|undefined
    constructor() {
        this.userName=process.env.GOOGLE_USERNAME
        this.password=process.env.GOOGLE_PASSWORD
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.userName,
                pass: this.password,
            },
        });
    }

    async sendEmail(to: string, subject: string, body: string): Promise<void> {  
        const mailOptions = {
            from: this.userName,
            to,
            subject,
            html: body,
        };

        try {
          const result=  await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
}
