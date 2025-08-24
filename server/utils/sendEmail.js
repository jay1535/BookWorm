import nodemailer from "nodemailer";
export const sendEmail = async ({sendEmail, subject, message})=>{
    const transporter = nodemailer.createTransport({
        host : process.env.SMTP_HOST,
        service:process.env.SMPT_SERVICE,
        port: process.env.SMPT_PORT,
        auth:{
            user : process.env.SMTP_MAIL,
            password : process.env.SMTP_PASSWORD

        },
    });

    const mailOptions = {
        from : process.env.SMTP_MAIL,
        to:sendEmail, 
        subject,
        html:message

    }
 
    await transporter.sendMail(mailOptions)
}