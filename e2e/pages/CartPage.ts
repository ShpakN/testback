import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.page.goto("/cart", { waitUntil: "domcontentloaded" });
  }

  items(): Locator {
    return this.page.getByTestId("cart-item");
  }

  itemByTitle(title: string): Locator {
    return this.items().filter({ hasText: title }).first();
  }

  /** РџСЂРѕРІРµСЂСЏРµС‚, С‡С‚Рѕ С‚РѕРІР°СЂ СЃ С‚Р°РєРёРј РЅР°Р·РІР°РЅРёРµРј РµСЃС‚СЊ РІ РєРѕСЂР·РёРЅРµ. */
  async expectItem(title: string) {
    await expect(this.itemByTitle(title)).toBeVisible({ timeout: 15_000 });
  }

  emptyMessage(): Locator {
    return this.page.getByTestId("cart-empty");
  }

  async removeItem(title: string) {
    const item = this.itemByTitle(title);
    await expect(item).toBeVisible({ timeout: 10_000 });
    await item.getByTestId("cart-remove").click();
  }

  /** РљР°Рє РІ С‚РµСЃС‚Рµ: proccedToCheckout (СЃ РѕРїРµС‡Р°С‚РєРѕР№) + РїСЂР°РІРёР»СЊРЅРѕРµ РЅР°РїРёСЃР°РЅРёРµ. */
  async proccedToCheckout() {
    await this.proceedToCheckout();
  }

  async proceedToCheckout() {
    const btn = this.page.getByTestId("cart-checkout");
    await expect(btn).toBeVisible({ timeout: 10_000 });
    await btn.click();
    await expect(this.page).toHaveURL(/\/checkout$/, { timeout: 10_000 });
  }

  async expectItemRemoved(title: string) {
    await expect(this.itemByTitle(title)).toHaveCount(0, { timeout: 10000 });
  }
}
