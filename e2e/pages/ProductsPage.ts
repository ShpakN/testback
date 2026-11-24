import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage {
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId("search-input");
  }

  // ---------- навигация ----------

  async open() {
    await this.page.goto("/products", { waitUntil: "domcontentloaded" });
    await expect(this.productCards().first()).toBeVisible({ timeout: 20_000 });
  }

  async openProductDetails(title: string) {
    const card = this.cardByTitle(title);
    await expect(card).toBeVisible({ timeout: 10_000 });
    await card.getByTestId("product-card-title").click();
    await expect(this.page).toHaveURL(/\/products\/[a-zA-Z0-9]+$/, {
      timeout: 10_000,
    });
    await expect(this.page.getByTestId("product-details")).toBeVisible({
      timeout: 15_000,
    });
  }

  // ---------- локаторы ----------

  productCards(): Locator {
    return this.page.getByTestId("product-card");
  }

  cardByTitle(title: string): Locator {
    return this.productCards().filter({ hasText: title }).first();
  }

  // ---------- данные карточек ----------

  async firstProductTitle(): Promise<string> {
    const title = this.productCards().first().getByTestId("product-card-title");
    await expect(title).toBeVisible({ timeout: 15_000 });
    return (await title.innerText()).trim();
  }

  async getCardPrice(title: string): Promise<string> {
    const price = this.cardByTitle(title).getByTestId("product-price");
    await expect(price).toBeVisible({ timeout: 10_000 });
    return (await price.innerText()).replace(/\s+/g, " ").trim();
  }

  async getCardPriceNumber(title: string): Promise<number> {
    const raw = await this.getCardPrice(title);
    const digits = raw.replace(/[^\d.,]/g, "").replace(",", ".");
    return Number.parseFloat(digits);
  }

  async count(): Promise<number> {
    return this.productCards().count();
  }

  async expectCount(n: number) {
    await expect(this.productCards()).toHaveCount(n);
  }

  // ---------- поиск / фильтр ----------

  async search(text: string) {
    if (!(await this.searchInput.count())) return;
    await this.searchInput.fill(text);
    await this.page.waitForTimeout(300);
  }

  async clearSearch() {
    if (!(await this.searchInput.count())) return;
    await this.searchInput.fill("");
    await this.page.waitForTimeout(300);
  }

  async findProductByName(fragment: string): Promise<Locator> {
    await this.search(fragment);
    const card = this.cardByTitle(fragment);
    await expect(card).toBeVisible({ timeout: 10_000 });
    return card;
  }

  // ---------- корзина ----------

  async selectSize(title: string, size?: string) {
    const card = this.cardByTitle(title);
    await expect(card).toBeVisible({ timeout: 10_000 });

    if (size) {
      const sizeBtn = card.getByTestId(`size-${size}`);
      if (await sizeBtn.count()) {
        await sizeBtn.click();
        return;
      }
    }

    const anySize = card.locator('[data-testid^="size-"]').first();
    if (await anySize.count()) await anySize.click();
  }

  async addToCartByTitle(title: string, size?: string) {
    const card = this.cardByTitle(title);
    await expect(card).toBeVisible({ timeout: 10_000 });

    await this.selectSize(title, size);

    await card.getByTestId("add-to-cart").click();
  }

  // ---------- служебное ----------

  async isCatalogEmpty(): Promise<boolean> {
    return (await this.productCards().count()) === 0;
  }
}