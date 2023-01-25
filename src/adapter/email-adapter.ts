import nodemailer from 'nodemailer'
import {UserAccountDB} from "../repositories/mongoose/types";

export class EmailAdapter {
    async sendEmailConfirmationMessage(user: UserAccountDB) {

        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "foritincubator@gmail.com",
                pass: "jjcsencsxikhstoj"
            }
        })
        const mailOptions = {
            from: "Anton's Service <foritincubator@gmail.com>",
            to: user.accountData.email,
            subject: "confirmation registration",
            text: `https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}`
        }
        await transport.sendMail(mailOptions);
    }
    async sendRecoveryCode(user: UserAccountDB, recoveryCode: string) {

        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "foritincubator@gmail.com",
                pass: "jjcsencsxikhstoj"
            }
        })
        const mailOptions = {
            from: "Anton's Service <foritincubator@gmail.com>",
            to: user.accountData.email,
            subject: "Recovery Password",
            text: `https://somesite.com/password-recovery?recoveryCode=${recoveryCode}`
        }
        await transport.sendMail(mailOptions);
    }
}
