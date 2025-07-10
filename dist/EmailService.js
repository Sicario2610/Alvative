"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html_to_text_1 = require("html-to-text");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Email {
    constructor(user, url = null) {
        this.to = user.email;
        this.firstName = user.name.split(" ")[0];
        this.url = url;
        this.from = `Abdulbasit Abdulrasheed <${process.env.EMAIL_FROM}>`;
    }
    newTransport() {
        return nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.GMAIL_PASSWORD,
            },
        });
    }
    send(subject, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const textContent = (0, html_to_text_1.convert)(message);
            const mailOptions = {
                from: this.from,
                to: this.to,
                subject,
                html: message,
                text: textContent,
            };
            yield this.newTransport().sendMail(mailOptions);
        });
    }
    sendReceipt(amount, reference) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `
      <p>Hi ${this.firstName},</p>
      <p>Your order of amount <strong>₦${amount}</strong> with reference <strong>${reference}</strong> is successful.</p>
      <p>Expect delivery in a few days!</p>
      <p>Thanks for patronizing Alvative Watches.</p>
    `;
            yield this.send("Payment Confirmed 🎉✅", message);
        });
    }
    sendFailed(amount, reference) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `
          <p>Hi ${this.firstName},</p>
          <p>Your order of amount <strong>₦${amount}</strong> with reference <strong>${reference}</strong> failed.</p>
          <p>Thanks for patronizing Alvative Watches.</p>
        `;
            yield this.send("Payment failed ⚠️", message);
        });
    }
}
exports.default = Email;
