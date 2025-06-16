import { Transporter } from "nodemailer";
import { IEmailService } from "../types/TypesAndInterfaces.ts";
import { tranporter } from "../config/emailConfig.ts";
export class EmailService implements IEmailService {
  private transporter: Transporter;
  private userName: string | undefined;
  constructor() {
    this.transporter = tranporter;
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    const mailOptions = {
      from: this.userName,
      to,
      subject,
      html: body,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch {
      throw new Error("Failed to send email");
    }
  }
}
