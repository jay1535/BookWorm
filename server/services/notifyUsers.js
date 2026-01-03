import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateBookReturnReminderEmailTemplate } from "../utils/emailTemplates.js";

export const notifyUsers = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      const now = new Date();

      const borrowers = await Borrow.find({
        dueDate: { $lt: now },
        returnDate: null,
        notified: false,
      });

      for (const borrow of borrowers) {
        if (borrow.user?.email) {
          await sendEmail({
            email: borrow.user.email,
            subject: "📚 Reminder: Please return your borrowed book",
            message: generateBookReturnReminderEmailTemplate({
              userName: borrow.user.name,
              bookTitle: borrow.book.title,
              dueDate: new Date(borrow.dueDate).toLocaleDateString(),
            }),
          });

          borrow.notified = true;
          await borrow.save();
        }
      }
    } catch (error) {
      console.error("❌ Notify users error:", error);
    }
  });
};
