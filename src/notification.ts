// utils/sendSMS.ts
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

export const sendSMS = async (to: string, message: string) => {
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to,
  });
};

export const sendWhatsApp = async (to: string, message: string) => {
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_WHATSAPP,
    to: `whatsapp:${to}`,
  });
};
