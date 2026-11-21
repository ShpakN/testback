import { test, expect } from '../fixtures/pages';
import { registerAndLogin } from '../support/helpers';
import { createUser } from '../support/UserFactory';

test.describe('Вход в систему', () => {
  test('успешный логин и появление кнопки Logout', async ({ page, signup, login, navbar }) => {
    const user = createUser();

    await signup.open();
    await signup.register(user.fullName, user.email, user.password);
    await signup.waitForToast('Signup successful');
    await expect(page).toHaveURL(/\/login$/);

    await login.login(user.email, user.password);
    await login.waitForToast('Login successful');
    await navbar.assertLoggedIn();

    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('логин с неверным паролем — Login failed', async ({ signup, login }) => {
    const user = createUser();
    await signup.open();
    await signup.register(user.fullName, user.email, user.password);
    await signup.waitForToast('Signup successful');

    await login.open();
    await login.login(user.email, 'WrongPass!123');
    await login.waitForToast('Login failed');
  });

  test('логин несуществующего пользователя — User not found', async ({ login }) => {
    await login.open();
    await login.login(`ghost_${Date.now()}@example.com`, 'AnyPass!1');
    await login.waitForToast('User not found');
  });

  test('закрытые маршруты редиректят на логин', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/login$/);

    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe('Выход из системы', () => {
  test('Logout очищает токен и возвращает на /login', async ({ page, navbar }) => {
    await registerAndLogin(page);
    await navbar.assertLoggedIn();

    await navbar.logout();

    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
    await navbar.assertLoggedOut();
  });

  test('после Logout защищённый маршрут недоступен', async ({ page, navbar }) => {
    await registerAndLogin(page);
    await navbar.logout();

    await page.goto('/cart');
    await expect(page).toHaveURL(/\/login$/);
  });
});