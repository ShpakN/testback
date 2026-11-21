const { test, before, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const db = require("./setup");
const app = require("../server");
const ProductModel = require("../models/ProductModel");

const ADD_URL = "/api/cart/add";

let token, product;

before(async () => await db.connect());
after(async () => await db.disconnect());

beforeEach(async () => {
  await db.clear();
  ({ token } = await db.createUser());
  product = await ProductModel.create({
    title: "Classic Cotton T-Shirt",
    price: 1299,
    images: ["https://example.com/t.png"],
    quantity: 10,
    sizes: ["S", "M", "L"],
  });
});

const item = () => ({
  productId: product._id.toString(),
  title: product.title,
  price: product.price,
  size: "M",
});

describe("POST /api/cart/add", () => {
  test("400 при отсутствии images — дефект D3", async () => {
    const res = await request(app)
      .post(ADD_URL).set("Authorization", `Bearer ${token}`).send(item());
    assert.equal(res.status, 400, `статус ${res.status}: ${JSON.stringify(res.body)}`);
  });

  test("400 при images строкой — дефект D3", async () => {
    const res = await request(app)
      .post(ADD_URL).set("Authorization", `Bearer ${token}`)
      .send({ ...item(), images: "https://example.com/1.png" });
    assert.equal(res.status, 400, `статус ${res.status}: ${JSON.stringify(res.body)}`);
  });

  test("401 без токена", async () => {
    const res = await request(app).post(ADD_URL).send({ ...item(), images: [] });
    assert.equal(res.status, 401);
  });

  test("успешно при корректном payload", async () => {
    const res = await request(app)
      .post(ADD_URL).set("Authorization", `Bearer ${token}`)
      .send({ ...item(), images: product.images, quantity: 1 });
    assert.ok([200, 201].includes(res.status), `статус ${res.status}: ${JSON.stringify(res.body)}`);
  });
});
