import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const notifyUsers = () => {
  

  
  cron.schedule("* */30 * * * *", async () => {
    
     try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const borrowers = await Borrow.find({
        dueDate: { $lt: oneDayAgo },
        returnDate: null,
        notified: false,
      }).populate("user book");

      

      for (const element of borrowers) {
        if (element.user?.email) {
          await sendEmail({
            email: element.user.email,
            subject: "Reminder for returning borrowed book",
            message: `Hello ${element.user.name},\n\nThis is a reminder that the book "${element.book.title}" you borrowed is due for return. 
            Please return it to the library as soon as possible.\n\nThank you.`,
          });

          element.notified = true;
          await element.save();

         
        }
      }
    } catch (error) {
      console.error("❌ Error in notifying users:", error);
    }
  });
};
