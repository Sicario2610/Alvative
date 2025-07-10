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
exports.sendWhatsApp = exports.sendSMS = void 0;
// utils/sendSMS.ts
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = (0, twilio_1.default)(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const sendSMS = (to, message) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE,
        to,
    });
});
exports.sendSMS = sendSMS;
const sendWhatsApp = (to, message) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.messages.create({
        body: message,
        from: process.env.TWILIO_WHATSAPP,
        to: `whatsapp:${to}`,
    });
});
exports.sendWhatsApp = sendWhatsApp;
