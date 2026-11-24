const { test, before, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const db = require("./setup");
const app = require("../server");
const ProductModel = require("../models/ProductModel");

const URL = "/api/products";

before(async () => await db.connect());
after(async () => await db.disconnect());
beforeEach(async () => await db.clear());

describe("GET /api/products", () => {
  test("возвращает 200 и массив", async () => {
    const res = await request(app).get(URL);
    assert.equal(res.status, 200, `статус ${res.status}: ${JSON.stringify(res.body)}`);
    assert.ok(Array.isArray(res.body) || Array.isArray(res.body.products));
  });

  test("сохраняет и возвращает title и price — дефект D4", async () => {
    await ProductModel.create({
      title: "Classic Cotton T-Shirt",
      price: 1299,
      images: ["https://example.com/t.png"],
      quantity: 10,
      sizes: ["S", "M", "L"],
    });
    const res = await request(app).get(URL);
    const list = Array.isArray(res.body) ? res.body : res.body.products;
    assert.ok(list?.length, `пустой ответ: ${JSON.stringify(res.body)}`);
    assert.equal(list[0].title, "Classic Cotton T-Shirt");
    assert.equal(list[0].price, 1299);
  });

  test("схема ProductModel содержит title и price как обязательные", () => {
    const paths = ProductModel.schema.paths;
    assert.ok(paths.title, "в схеме нет title");
    assert.ok(paths.price, "в схеме нет price");
    assert.equal(paths.title.isRequired, true);
    assert.equal(paths.price.isRequired, true);
  });

  test("без title документ не сохраняется", async () => {
    await assert.rejects(
      () => ProductModel.create({ price: 100, images: [], quantity: 1, sizes: ["M"] }),
      /title/
    );
  });

  test("GET /api/products/:id возвращает один товар", async () => {
    const p = await ProductModel.create({
      title: "One", price: 500, images: [], quantity: 1, sizes: ["M"],
    });
    const res = await request(app).get(`${URL}/${p._id}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.title, "One");
  });
});