const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
mongoose.set("strictQuery", false);

async function main() {
  try {
    await mongoose.connect(process.env.HOST_URI);
    console.log("Database connection successful!");

    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error("Error while connecting to database", error.message);
    process.exit(1);
  }
}

main();
