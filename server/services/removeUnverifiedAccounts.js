import cron from "node-cron";
import { User } from "../models/userModel.js";

export const removeUnverifiedAccounts = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      const result = await User.deleteMany({
        createdAt: { $lt: thirtyMinutesAgo },
        accountVerified: false,
      });

      if (result.deletedCount > 0) {
        console.log(`🗑️ Deleted ${result.deletedCount} unverified users`);
      }
    } catch (error) {
      console.error("❌ Error deleting unverified users:", error);
    }
  });
};
