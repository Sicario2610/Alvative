import { convert } from "html-to-text";
import axios from "axios";
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
    this.from = process.env.EMAIL_FROM!;
  }

  async send(subject: string, message: string) {
    const textContent = convert(message);

    const payload = {
      from: {
        email: this.from,
        name: "Abdulbasit Abdulrasheed",
      },
      to: [
        {
          email: this.to,
          name: this.firstName,
        },
      ],
      subject,
      html: message,
      text: textContent,
    };

    await axios.post("https://api.mailersend.com/v1/email", payload, {
      headers: {
        Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
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
