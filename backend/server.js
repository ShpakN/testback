require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./index");
const { connection, PORT } = require("./config/db");

if (require.main === module) {
  (async () => {
    try {
      await connection;
      console.log("Connected to DataBase");
      app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
    } catch (e) {
      console.error(`${e} is giving while connecting`);
      process.exit(1);
    }
  })();
}

module.exports = app;