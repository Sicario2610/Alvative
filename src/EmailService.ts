import { convert } from "html-to-text";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

interface User {
  email: string;
  name: string;
}

export default class Email {
  to: string;
  firstName: string;
  url: string | null;
  from: string;

  constructor(user: User, url: string | null = null) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Abdulbasit Abdulrasheed <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async send(subject: string, message: string) {
    const textContent = convert(message);
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: message,
      text: textContent,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendReceipt(amount: number, reference: string) {
    const message = `
      <p>Hi ${this.firstName},</p>
      <p>Your order of amount <strong>₦${amount}</strong> with reference <strong>${reference}</strong> is successful.</p>
      <p>Expect delivery in a few days!</p>
      <p>Thanks for patronizing Alvative Watches.</p>
    `;
    await this.send("Payment Confirmed 🎉✅", message);
  }
  async sendFailed(amount: number, reference: string) {
    const message = `
          <p>Hi ${this.firstName},</p>
          <p>Your order of amount <strong>₦${amount}</strong> with reference <strong>${reference}</strong> failed.</p>
          <p>Thanks for patronizing Alvative Watches.</p>
        `;
    await this.send("Payment failed ⚠️", message);
  }
}
