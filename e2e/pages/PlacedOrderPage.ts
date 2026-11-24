import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PlacedOrderPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  successMessage(): Locator {
    return this.page.getByTestId("order-placed");
  }

  async expectPlaced() {
    await expect(this.page).toHaveURL(/\/placed$/, { timeout: 15_000 });
    await expect(this.successMessage()).toBeVisible({ timeout: 15_000 });
  }
}