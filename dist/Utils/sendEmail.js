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
exports.sendMail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendgridApiKey = process.env.SENDGRID_API_KEY;
if (!sendgridApiKey) {
    throw new Error('SENDGRID_API_KEY environment variable is not set');
}
mail_1.default.setApiKey(sendgridApiKey);
const sendMail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    const from = process.env.MAIL_USER;
    if (!from) {
        throw new Error('MAIL_USER environment variable is not set');
    }
    const msg = {
        to: to,
        from: from,
        subject: subject,
        html: html,
    };
    try {
        yield mail_1.default.send(msg);
        console.log(`Email sent successfully to ${to}`);
    }
    catch (error) {
        console.error('Error sending mail with SendGrid:', error);
        if (error) {
            console.error(error);
        }
        throw error;
    }
});
exports.sendMail = sendMail;
