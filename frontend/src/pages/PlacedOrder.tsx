import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

interface OrderInfo {
  _id?: string;
  totalPrice?: number;
  createdAt?: string;
}

const PlacedOrder = () => {
  const [order, setOrder] = useState<OrderInfo | null>(null);

  useEffect(() => {
    // После успешного заказа сохраняем номер/сумму, чтобы показать на странице
    try {
      const raw = sessionStorage.getItem("lastOrder");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      setOrder(null);
    }
    sessionStorage.removeItem("lastOrder");
  }, []);

  return (
    <div
      data-testid="order-placed"
      className="max-w-2xl mx-auto px-4 py-20 text-center"
    >
      <FiCheckCircle className="mx-auto h-16 w-16 text-[#319795]" />

      <h1 className="mt-6 text-3xl font-bold text-gray-800">
        Order placed successfully!
      </h1>

      <p className="mt-3 text-gray-600">
        Thank you for your purchase. We will contact you soon.
      </p>

      {order?._id && (
        <p className="mt-4 text-gray-700">
          Order number:{" "}
          <span data-testid="order-number" className="font-semibold">
            {order._id}
          </span>
        </p>
      )}

      {typeof order?.totalPrice === "number" && (
        <p className="mt-1 text-gray-700">
          Total:{" "}
          <span data-testid="order-total" className="font-semibold">
            $ {order.totalPrice}
          </span>
        </p>
      )}

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
        <Link
          to="/products"
          data-testid="order-continue"
          className="px-6 py-2 rounded-lg bg-[#319795] text-white hover:bg-teal-700 transition"
        >
          Continue shopping
        </Link>

        <Link
          to="/orders"
          data-testid="order-history"
          className="px-6 py-2 rounded-lg border hover:bg-gray-50 transition"
        >
          My orders
        </Link>
      </div>
    </div>
  );
};

export default PlacedOrder;