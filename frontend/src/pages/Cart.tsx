import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCartItems, deleteCartItem } from "../api/api";

interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  images?: string[];
  img1?: string;
}

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await getCartItems();
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = (): number =>
    items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleRemove = async (id: string) => {
    try {
      await deleteCartItem(id);
      setItems((prev) => prev.filter((it) => it._id !== id));
      toast.success("Removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <p className="p-8 text-center" data-testid="cart-loading">
        Loading cart...
      </p>
    );
  }

  return (
    <div
      data-testid="cart-page"
      className="max-w-4xl mx-auto px-4 py-10"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Cart</h1>

      {items.length === 0 ? (
        <div data-testid="cart-empty" className="text-center py-16">
          <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
          <Link
            to="/products"
            data-testid="cart-continue"
            className="inline-block px-6 py-2 rounded-lg bg-[#319795] text-white hover:bg-teal-700 transition"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => {
              const image = item.img1 ?? item.images?.[0] ?? "";
              return (
                <div
                  key={item._id}
                  data-testid="cart-item"
                  data-cart-id={item._id}
                  className="flex items-center gap-4 bg-white border rounded-xl p-4 shadow-sm"
                >
                  {image && (
                    <img
                      src={image}
                      alt={item.title}
                      data-testid="cart-item-image"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <p
                      data-testid="cart-item-title"
                      className="font-semibold truncate"
                    >
                      {item.title}
                    </p>
                    {item.size && (
                      <p
                        data-testid="cart-item-size"
                        className="text-sm text-gray-500"
                      >
                        Size: {item.size}
                      </p>
                    )}
                    <p
                      data-testid="cart-item-price"
                      className="text-gray-700"
                    >
                      $ {item.price} × {item.quantity}
                    </p>
                  </div>

                  <p
                    data-testid="cart-item-subtotal"
                    className="font-bold text-lg"
                  >
                    $ {Number(item.price) * item.quantity}
                  </p>

                  <button
                    type="button"
                    data-testid="cart-remove"
                    onClick={() => handleRemove(item._id)}
                    className="px-3 py-1.5 rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-lg font-semibold text-gray-700">
              Total:{" "}
              <span data-testid="cart-total" className="text-teal-600 font-bold">
                $ {Math.round(calculateTotal())}
              </span>
            </p>

            <button
              type="button"
              data-testid="cart-checkout"
              onClick={() => navigate("/checkout")}
              className="px-6 py-2 rounded-lg bg-[#319795] text-white hover:bg-teal-700 transition"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
