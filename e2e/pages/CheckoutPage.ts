import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export type ShippingData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  pinCode?: string;
};

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.page.goto("/checkout", { waitUntil: "domcontentloaded" });
  }

  /** Ждёт открытия страницы оформления и готовности формы. */
  async expectOpened() {
    await expect(this.page).toHaveURL(/\/checkout$/, { timeout: 10_000 });
    await expect(this.submitButton()).toBeVisible({ timeout: 15_000 });
  }

  /** Заполняет форму доставки. Поля ищутся по name= (как в Checkout.tsx). */
  async fillShipping(data: ShippingData = {}) {
    const values: Record<string, string> = {
      firstName: data.firstName ?? "E2E",
      lastName: data.lastName ?? "Tester",
      email: data.email ?? `e2e.${Date.now()}@example.com`,
      address: data.address ?? "ул. Ленина, 1",
      city: data.city ?? "Белгород",
      pinCode: data.pinCode ?? "308000",
    };

    for (const [name, value] of Object.entries(values)) {
      const input = this.page.locator(`form input[name="${name}"]`);
      await expect(input).toBeVisible({ timeout: 10_000 });
      await input.fill(value);
    }
  }

  /** Синоним fillShipping — чтобы работали оба имени. */
  async fillForm(data: ShippingData = {}) {
    await this.fillShipping(data);
  }

  async placeOrder() {
    const submit = this.submitButton();
    await expect(submit).toBeEnabled({ timeout: 10_000 });
    await submit.click();
  }

  submitButton(): Locator {
    return this.page.locator('form button[type="submit"]');
  }

  total(): Locator {
    return this.page.getByTestId("checkout-total");
  }
}