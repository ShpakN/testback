import { test, expect } from '../fixtures/pages';
import { createUser } from '../support/UserFactory';
import { Navbar } from '../pages/Navbar';

test.describe('Регистрация пользователя', () => {
  test('успешная регистрация и переход на страницу входа', async ({ page, signup }) => {
    const user = createUser();

    await signup.open();
    await signup.register(user.fullName, user.email, user.password);

    await signup.waitForToast('Signup successful');
    await expect(page).toHaveURL(/\/login$/, { timeout: 10_000 });
  });

  test('повторная регистрация с существующим email — ошибка', async ({ page, signup, login }) => {
    const user = createUser();

    await signup.open();
    await signup.register(user.fullName, user.email, user.password);
    await signup.waitForToast('Signup successful');

    // повтор регистрации тем же email
    await page.goto('/signup');
    await signup.register(user.fullName, user.email, user.password);

    await signup.waitForToast('Email already exists');
    await expect(page).toHaveURL(/\/signup$/);
    await expect(login.submitButton()).toHaveCount(0);
  });

  test('пустые поля блокируются html5-валидацией', async ({ page, signup }) => {
    await signup.open();
    await signup.submitButton().click();

    // браузер не отправит форму — URL не изменится, валидация required
    await expect(page).toHaveURL(/\/signup$/);
    const emailValid = await signup.emailInput().evaluate(
      (el: HTMLInputElement) => el.checkValidity()
    );
    expect(emailValid).toBe(false);
  });
});
