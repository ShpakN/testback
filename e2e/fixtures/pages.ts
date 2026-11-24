import { test as base, expect } from '@playwright/test';
import { Navbar } from '../pages/Navbar';
import { SignupPage } from '../pages/SignupPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PlacedOrderPage } from '../pages/PlacedOrderPage';
import { TestUser, createUser } from '../support/UserFactory';

type Pages = {
  navbar: Navbar;
  signup: SignupPage;
  login: LoginPage;
  products: ProductsPage;
  cart: CartPage;
  checkout: CheckoutPage;
  placed: PlacedOrderPage;
};

type Fixtures = {
  /** Свежий пользователь без регистрации — для тестов самой формы signup. */
  user: TestUser;
  /**
   * Пользователь, уже зарегистрированный и залогиненный.
   * Запрашивай его в аргументах теста — Playwright выполнит фикстуру лениво.
   */
  registeredUser: TestUser;
};

export const test = base.extend<Pages & Fixtures>({
  // --- Page Objects: ОБЯЗАТЕЛЬНО block-body, иначе use() не обернётся в try/finally
  navbar: async ({ page }, use) => {
    await use(new Navbar(page));
  },
  signup: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  login: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  products: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  cart: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkout: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  placed: async ({ page }, use) => {
    await use(new PlacedOrderPage(page));
  },

  // --- Фабрика пользователей
  user: async ({}, use) => {
  await use(createUser());
},

  // --- Регистрация + логин через UI, переиспользуется всеми сценариями
  registeredUser: async ({ page, signup, login, navbar }, use) => {
    const user = createUser();

    await signup.open();
    await signup.register(user.fullName, user.email, user.password);
    await signup.waitForToast('Signup successful');

    // Signup.tsx: setTimeout(() => navigate('/login'), 2000)
    await expect(page).toHaveURL(/\/login$/, { timeout: 10_000 });

    await login.login(user.email, user.password);
    await login.waitForToast('Login successful');
    await navbar.assertLoggedIn();

    await use(user);
  },
});

export { expect };