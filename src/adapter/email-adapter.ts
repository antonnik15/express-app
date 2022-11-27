import nodemailer from 'nodemailer'
import {UserAccountDBType} from "../repositories/users-repositories/users-repository";


export const emailAdapter = {
    async sendEmailConfirmationMessage(user: UserAccountDBType) {

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
}


