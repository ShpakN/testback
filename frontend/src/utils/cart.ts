// frontend/src/utils/cart.ts

export interface CartItemInput {
  price: string | number;
  quantity: number;
}

export interface CartProduct {
  _id: string;
  title: string;
  price: string | number;
  images?: string[] | string | null;
  sizes?: string[];
  quantity?: number;
  size?: string;
}

export interface CartPayload {
  productId: string;
  title: string;
  price: number;
  images: string[];
  size: string;
  quantity: number;
}

/** Сумма корзины с приведением цены к числу. */
export function calculateTotal(items: CartItemInput[]): number {
  return items.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity ?? 1),
    0
  );
}

/** Приведение поля images к массиву — защита от дефекта D3. */
function toImagesArray(images: CartProduct["images"]): string[] {
  if (Array.isArray(images)) return images;
  if (typeof images === "string" && images.trim()) return [images];
  return [];
}

/** Сборка payload для POST /api/cart/add — защита от дефекта D3. */
export function buildCartPayload(product: CartProduct): CartPayload {
  return {
    productId: product._id,
    title: product.title,
    price: Number(product.price),
    images: toImagesArray(product.images),
    size: product.size ?? product.sizes?.[0] ?? "M",
    quantity: product.quantity ?? 1,
  };
}