import { test, expect } from '../fixtures/pages';
import { registerAndLogin } from '../support/helpers';

test.describe("Оформление заказа", () => {
  test("полный happy path: каталог → корзина → checkout → /placed", async ({
    page,
    products,
    cart,
    checkout,
    placed,
    registeredUser,
  }) => {
    void registeredUser;

    await products.open();
    const title = await products.firstProductTitle();

    await products.addToCartByTitle(title);
    await products.waitForToast("Added to cart Sucsessfully");

    await cart.open();
    await expect(cart.itemByTitle(title)).toBeVisible();
    await cart.proceedToCheckout();

    await checkout.fillForm();
    await checkout.placeOrder();

    await expect(page).toHaveURL(/\/placed$/);
    await expect(placed.successMessage()).toBeVisible();
  });

  test("checkout с пустой корзиной не создаёт заказ", async ({
    page,
    cart,
    checkout,
    registeredUser,
  }) => {
    void registeredUser;

    await cart.open();
    await expect(cart.emptyMessage()).toBeVisible();

    await checkout.open();
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page).not.toHaveURL(/\/placed$/);
  });
});