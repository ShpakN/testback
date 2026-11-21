import { test, expect } from "../fixtures/pages";

test.describe("Добавление товара в корзину", () => {
  test("после логина товар добавляется, и он виден в корзине", async ({
    page,
    products,
    cart,
    registeredUser,
  }) => {
    void registeredUser;

    await products.open();
    const title = await products.firstProductTitle();

    await products.addToCartByTitle(title);
    await products.waitForToast("Added to cart Sucsessfully");

    await cart.open();
    await expect(cart.itemByTitle(title)).toBeVisible();
    await expect(page).toHaveURL(/\/cart$/);
  });

  test("гость не может добавить в корзину", async ({ page, products }) => {
    await products.open();
    const title = await products.firstProductTitle();

    await products.addToCartByTitle(title);
    await products.waitForToast(/log in|login/i);

    await expect(page).toHaveURL(/\/products/);
  });

  test("удаление товара из корзины", async ({ page, products, cart, registeredUser }) => {
    void registeredUser;

    await products.open();
    const title = await products.firstProductTitle();

    await products.addToCartByTitle(title);
    await products.waitForToast("Added to cart Sucsessfully");

    await cart.open();
    await expect(cart.itemByTitle(title)).toBeVisible();

    await cart.removeItem(title);
    await expect(cart.itemByTitle(title)).toHaveCount(0);
  });
});