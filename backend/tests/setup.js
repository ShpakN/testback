process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const UserModel = require("../models/UserModel");

let mongod = null;
let connected = false;

async function connect() {
  if (connected) return;                      // защита от повторного вызова

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri(), { dbName: "edgistify-test" });
  connected = true;
}

async function clear() {
  if (mongoose.connection.readyState !== 1) return;
  const collections = await mongoose.connection.db.collections();
  for (const c of collections) await c.deleteMany({});
}

async function disconnect() {
  if (!connected) return;
  try {
    await mongoose.connection.dropDatabase();
  } catch (_) { /* база могла не создаться */ }
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
  connected = false;
}

async function createUser(overrides = {}) {
  const user = await UserModel.create({
    fullName: "E2E Tester",
    email: `test${Date.now()}${Math.random().toString(36).slice(2)}@mail.com`,
    password: "$2b$10$abcdefghijklmnopqrstuv",
    ...overrides,
  });

  const token = jwt.sign(
    { userId: user._id.toString(), userName: user.fullName },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { user, token, userId: user._id.toString() };
}

module.exports = { connect, clear, disconnect, createUser };