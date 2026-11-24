import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class Navbar extends BasePage {
  logoutButton = () => this.page.getByRole('button', { name: 'Logout' });
  loginLink = () => this.page.locator('nav').getByRole('link', { name: 'Login' });
  productsLink = () => this.page.locator('nav').getByRole('link', { name: 'Products' });
  cartLink = () => this.page.locator('nav').getByRole('link', { name: 'Cart', exact: true });
  homeLink = () => this.page.locator('nav').getByRole('link', { name: 'Home' });

  async assertLoggedIn() {
    await expect(this.logoutButton()).toBeVisible();
    await expect(this.loginLink()).toHaveCount(0);
  }

  async assertLoggedOut() {
    await expect(this.logoutButton()).toHaveCount(0);
    await expect(this.loginLink()).toBeVisible();
  }

  async logout() {
    await this.logoutButton().click();
    await expect(this.page).toHaveURL(/\/login$/);
    await this.assertLoggedOut();
  }
}