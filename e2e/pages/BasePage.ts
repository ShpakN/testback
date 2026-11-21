import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async waitForToast(text: string | RegExp) {
    const toast = this.page.locator('.Toastify__toast', { hasText: text });
    await expect(toast).toBeVisible({ timeout: 15_000 });
    return toast;
  }

  async waitToastDisappear(text: string | RegExp) {
    await expect(
      this.page.locator('.Toastify__toast', { hasText: text })
    ).toBeHidden({ timeout: 15_000 });
  }

  protected navLink(name: string): Locator {
    return this.page.locator('nav').getByRole('link', { name, exact: true });
  }
}
