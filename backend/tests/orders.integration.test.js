const { test, before, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const db = require("./setup");
const app = require("../server");
const OrderModel = require("../models/OrderModel");

const CREATE_URL = "/api/orders/create";   // OrderRoutes.js:7

let token, userId;

before(async () => await db.connect());
after(async () => await db.disconnect());
beforeEach(async () => {
  await db.clear();
  ({ token, userId } = await db.createUser());
});

describe("POST /api/orders/create", () => {
  test("401 без токена", async () => {
    const res = await request(app)
      .post(CREATE_URL)
      .send({ products: [], totalPrice: 0, shippingAddress: {} });
    assert.equal(res.status, 401, `статус ${res.status}: ${JSON.stringify(res.body)}`);
  });

  test("401 при невалидном токене", async () => {
    const res = await request(app)
      .post(CREATE_URL)
      .set("Authorization", "Bearer not.a.token")
      .send({ products: [], totalPrice: 0, shippingAddress: {} });
    assert.equal(res.status, 401);
  });

  test("создаёт заказ с реальным userId — дефект D11", async () => {
    const payload = {
      products: [
        { productId: "64b0c0ffee00000000000001", title: "T-Shirt", price: 1299, quantity: 1, size: "M" },
      ],
      totalPrice: 1299,
      shippingAddress: {
        fullName: "E2E Tester",
        address: "ул. Ленина, 1",
        city: "Белгород",
        postalCode: "308000",
        phone: "+79000000000",
      },
    };

    const res = await request(app)
      .post(CREATE_URL)
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    assert.ok([200, 201].includes(res.status), `статус ${res.status}: ${JSON.stringify(res.body)}`);

    const order = await OrderModel.findOne({}).lean();
    assert.ok(order, "заказ не создан");
    assert.equal(String(order.userId), userId, "userId должен браться из токена, а не из тела");
    assert.equal(order.totalPrice, 1299);
    assert.equal(order.products.length, 1);
  });

  test("игнорирует userId из тела — защита от подмены", async () => {
  const res = await request(app)
    .post(CREATE_URL)
    .set("Authorization", `Bearer ${token}`)
    .send({
      products: [
        { productId: "64b0c0ffee00000000000001", title: "T-Shirt", price: 1299, quantity: 1, size: "M" },
      ],
      totalPrice: 1299,
      shippingAddress: {
        fullName: "E2E Tester",
        address: "ул. Ленина, 1",
        city: "Белгород",
        postalCode: "308000",
        phone: "+79000000000",
      },
      userId: "000000000000000000000000",   // ← единственное «лишнее» поле
    });

  assert.equal(res.status, 201, `статус ${res.status}: ${JSON.stringify(res.body)}`);

  const order = await OrderModel.findOne({}).lean();
  assert.ok(order, "заказ не создан");
  assert.equal(
    String(order.userId),
    userId,
    "userId должен браться из токена, а не из тела"
  );
});
});