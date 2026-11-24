import { Page, expect } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';
import { LoginPage } from '../pages/LoginPage';
import { Navbar } from '../pages/Navbar';
import { TestUser, createUser } from './UserFactory';

/**
 * Регистрирует нового пользователя и логинит его через UI.
 * Возвращает созданного пользователя — пароль/email могут понадобиться
 * в проверках после заказа.
 */
export async function registerAndLogin(page: Page): Promise<TestUser> {
  const user = createUser();
  const signup = new SignupPage(page);
  const login = new LoginPage(page);
  const navbar = new Navbar(page);

  await signup.open();
  await signup.register(user.fullName, user.email, user.password);
  await signup.waitForToast('Signup successful');

  // Signup.tsx: setTimeout(() => navigate('/login'), 2000)
  await expect(page).toHaveURL(/\/login$/, { timeout: 10_000 });

  await login.login(user.email, user.password);
  await login.waitForToast('Login successful');

  // Не проверяем конкретный URL после логина: приложение уходит на главную,
  // и путь может меняться. Надёжнее ждать готовности navbar.
  await navbar.assertLoggedIn();

  return user;
}