import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD,
    },
});
export const sender = `"Trần Lê Anh Tuấn 👻" <${process.env.MAILER_USER}>`
// export const sendMail = await transporter.sendMail({
//     from: `"Trần Lê Anh Tuấn 👻" <${process.env.MAILER_USER}>`,
//     to: "0995086534ts@gmail.com",
//     subject: "Hello ✔",
//     text: "Hello world?",
//     html: "<b>Hello world?</b>",
// });