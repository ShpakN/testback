import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) { super(page); }

  emailInput = () => this.page.locator('input[type="email"]');
  passwordInput = () => this.page.locator('input[type="password"]');
  submitButton = () => this.page.getByRole('button', { name: 'Login', exact: true });
  signUpLink = () => this.page.getByText('Sign Up');

  async open() {
    await this.goto('/login');
    await expect(this.submitButton()).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.submitButton().click();
  }
}