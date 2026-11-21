import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
  constructor(page: Page) { super(page); }

  nameInput = () => this.page.getByPlaceholder('Name');
  emailInput = () => this.page.getByPlaceholder('Email');
  passwordInput = () => this.page.getByPlaceholder('Password');
  submitButton = () => this.page.getByRole('button', { name: 'Sign Up' });

  async open() {
    await this.goto('/signup');
    await expect(this.submitButton()).toBeVisible();
  }

  async register(fullName: string, email: string, password: string) {
    await this.nameInput().fill(fullName);
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.submitButton().click();
  }
}