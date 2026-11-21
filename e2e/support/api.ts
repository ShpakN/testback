import { APIRequestContext, request } from '@playwright/test';

export async function apiContext(): Promise<APIRequestContext> {
  return request.newContext({
    baseURL: process.env.API_URL!,
    extraHTTPHeaders: { 'Content-Type': 'application/json' },
  });
}

export async function clearCartViaApi(token: string) {
  const ctx = await apiContext();
  const res = await ctx.get('/cart', { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok()) return;
  const items = await res.json();
  for (const item of items) {
    await ctx.delete(`/cart/remove/${item._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  await ctx.dispose();
}

export async function lastOrderViaApi(token: string) {
  const ctx = await apiContext();
  const res = await ctx.get('/orders/get', { headers: { Authorization: `Bearer ${token}` } });
  const orders = await res.json();
  await ctx.dispose();
  return orders[orders.length - 1];
}
