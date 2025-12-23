import { Resend } from "resend";

let resend; // lazy initialization

export const sendEmail = async ({ email, subject, message }) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing");
    }

    if (!resend) {
      resend = new Resend(process.env.RESEND_API_KEY);
    }

    await resend.emails.send({
      from: "BookWorm <noreply@bookworm.app>", 
      to: email,
      subject,
      html: message,
    });

  } catch (error) {
    console.error("Resend Email Error:", error);
    throw new Error("Email could not be sent");
  }
};
