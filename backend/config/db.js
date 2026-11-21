require("dotenv").config();
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("В .env не задан MONGO_URI");
  }
  await mongoose.connect(uri);
};

module.exports = connectDB;
