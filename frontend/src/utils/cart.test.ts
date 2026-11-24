import { describe, it, expect } from "vitest";
import { calculateTotal, buildCartPayload } from "./cart";

describe("calculateTotal", () => {
  it("суммирует цену с количеством", () => {
    const items = [
      { price: "1299", quantity: 2 },
      { price: 500, quantity: 1 },
    ];
    expect(calculateTotal(items as any)).toBe(3098);
  });

  it("на пустой корзине возвращает 0", () => {
    expect(calculateTotal([])).toBe(0);
  });
});

describe("buildCartPayload — защита от дефекта D3", () => {
  it("всегда отдаёт images массивом", () => {
    const payload = buildCartPayload({
      _id: "abc", title: "T-Shirt", price: "1299", sizes: ["M"],
    } as any);
    expect(Array.isArray(payload.images)).toBe(true);
  });

  it("приводит price к числу", () => {
    const payload = buildCartPayload({
      _id: "abc", title: "T-Shirt", price: "1299", images: [], sizes: ["M"],
    } as any);
    expect(typeof payload.price).toBe("number");
    expect(payload.price).toBe(1299);
  });
});
describe("buildCartPayload — ветвления", () => {
  it("images строкой превращает в массив из одного элемента", () => {
    const payload = buildCartPayload({
      _id: "abc", title: "T-Shirt", price: "1299",
      images: "https://example.com/1.png", sizes: ["M"],
    } as any);
    expect(payload.images).toEqual(["https://example.com/1.png"]);
  });

  it("пустая строка images даёт пустой массив", () => {
    const payload = buildCartPayload({
      _id: "abc", title: "T-Shirt", price: "1299",
      images: "   ", sizes: ["M"],
    } as any);
    expect(payload.images).toEqual([]);
  });

  it("null images даёт пустой массив", () => {
    const payload = buildCartPayload({
      _id: "abc", title: "T-Shirt", price: "1299",
      images: null, sizes: ["M"],
    } as any);
    expect(payload.images).toEqual([]);
  });

  it("images отсутствует — пустой массив", () => {
    const payload = buildCartPayload({
      _id: "abc", title: "T-Shirt", price: "1299", sizes: ["M"],
    } as any);
    expect(payload.images).toEqual([]);
  });

  it("берёт размер из sizes, если size не задан", () => {
    const payload = buildCartPayload({
      _id: "abc", title: "T-Shirt", price: "1299",
      images: [], sizes: ["L", "XL"],
    } as any);
    expect(payload.size).toBe("L");
  });

  it("предпочитает явный size", () => {
    const payload = buildCartPayload({
      _id: "abc", title: "T-Shirt", price: "1299",
      images: [], sizes: ["L"], size: "S",
    } as any);
    expect(payload.size).toBe("S");
  });

  it("без size и sizes подставляет M", () => {
    const payload = buildCartPayload({
      _id: "abc", title: "T-Shirt", price: "1299", images: [],
    } as any);
    expect(payload.size).toBe("M");
  });

  it("quantity по умолчанию 1", () => {
    const payload = buildCartPayload({
      _id: "abc", title: "T-Shirt", price: "1299",
      images: [], sizes: ["M"],
    } as any);
    expect(payload.quantity).toBe(1);
  });

  it("quantity берётся из товара", () => {
    const payload = buildCartPayload({
      _id: "abc", title: "T-Shirt", price: "1299",
      images: [], sizes: ["M"], quantity: 3,
    } as any);
    expect(payload.quantity).toBe(3);
  });
});

describe("calculateTotal — ветвления", () => {
  it("quantity по умолчанию = 1", () => {
    expect(calculateTotal([{ price: "100", quantity: undefined as any }])).toBe(100);
  });

  it("корректно считает строковые и числовые цены вместе", () => {
    expect(
      calculateTotal([
        { price: "1999", quantity: 1 },
        { price: 1, quantity: 1 },
      ])
    ).toBe(2000);
  });
});