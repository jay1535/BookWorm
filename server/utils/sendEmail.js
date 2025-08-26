import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,  // fixed typo
    port: process.env.SMTP_PORT,        // fixed typo
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD   // fixed key
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,   // clearer naming
    subject,
    html: message,
  };

  await transporter.sendMail(mailOptions);
};
