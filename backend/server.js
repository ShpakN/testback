require("dotenv").config();

const app = require("./index");
const { connectDB, PORT } = require("./config/db");

if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      console.log("Connected to DataBase");
      app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
    } catch (e) {
      console.error(`${e} while connecting`);
      process.exit(1);
    }
  })();
}

module.exports = app;
