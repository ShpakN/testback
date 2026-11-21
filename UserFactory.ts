import { randomUUID } from 'node:crypto';

export interface TestUser {
  fullName: string;
  email: string;
  password: string;
}

/**
 * Уникальный пользователь на каждый вызов: тесты можно гонять
 * в параллель и во всех трёх браузерах без конфликта по email.
 */
export function createUser(): TestUser {
  const suffix = randomUUID().slice(0, 8); // ~4 млрд комбинаций, коллизий нет
  return {
    fullName: `E2E Tester ${suffix}`,
    email: `e2e_${suffix}@example.com`,
    password: process.env.TEST_PASSWORD || 'TestPass_2026!',
  };
}