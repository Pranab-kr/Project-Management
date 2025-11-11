import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/connection.js";

const PORT = process.env.PORT ?? 8000;


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });
