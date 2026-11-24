import { test, expect } from "../fixtures/pages";

test.describe("Поиск товара", () => {
  test("каталог загружается и содержит товары", async ({ products }) => {
    await products.open();
    const count = await products.productCards().count();
    expect(count).toBeGreaterThan(0);
  });

  test("поиск по фрагменту названия находит товар", async ({ products }) => {
    await products.open();

    const firstName = await products.firstProductTitle();
    const fragment = firstName.split(" ")[0].slice(0, 4);

    const card = await products.findProductByName(fragment);
    await expect(card).toBeVisible();
    await expect(card.getByTestId("product-card-title")).toContainText(fragment);
  });

  test("переход в карточку товара по клику", async ({ page, products }) => {
    await products.open();

    const firstTitle = await products.firstProductTitle();
    await products.openProductDetails(firstTitle);

    await expect(page).toHaveURL(/\/products\/[a-zA-Z0-9]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(firstTitle);
  });

  test("фильтр по названию скрывает несовпадающие товары", async ({ products }) => {
    await products.open();
    const firstName = await products.firstProductTitle();
    await products.findProductByName(firstName.slice(0, 4));
    await expect(products.productCards()).toHaveCount(1);
  });
});