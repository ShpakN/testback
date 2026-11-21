import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

type Product = {
  _id: string;
  title: string;
  price: number;
  description?: string;
  images?: string[];
  sizes?: string[];
  quantity?: number;
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        if (!cancelled) {
          setProduct(data);
          setSelectedSize(data?.sizes?.[0] ?? "");
        }
      } catch (err: any) {
        if (!cancelled) {
          toast.error(err?.response?.data?.message ?? "Product not found");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || isAdding) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }

    if (product.sizes?.length && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    setIsAdding(true);
    try {
      const payload = {
        productId: product._id,
        images: product.images ?? [],
        title: product.title,
        price: Number(product.price),
        quantity: Math.max(1, quantity),
        size: selectedSize || "One Size",
      };
      console.log("cart/add payload:", payload);

      const { data } = await api.post("/cart/add", payload);
      toast.success(data?.message ?? "Added to cart Sucsessfully");
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message ?? "Failed to add to cart";
      console.error("add to cart failed:", status, msg);
      toast.error(msg);
      if (status === 401) navigate("/login");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return <p className="p-8">Загрузка...</p>;
  }

  if (!product) {
    return <p className="p-8">Товар не найден</p>;
  }

  return (
    <div
      className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8"
      data-testid="product-details"
    >
      <div>
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="w-full rounded-xl object-cover"
          data-testid="product-details-image"
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold" data-testid="product-details-title">
          {product.title}
        </h1>

        <p className="text-2xl font-semibold" data-testid="product-details-price">
          $ {product.price}
        </p>

        {product.description && (
          <p className="text-gray-600" data-testid="product-details-description">
            {product.description}
          </p>
        )}

        {!!product.sizes?.length && (
          <div className="flex gap-2 flex-wrap" data-testid="product-details-sizes">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSize(s)}
                aria-pressed={selectedSize === s}
                data-testid={`details-size-${s}`}
                className={`px-4 py-2 border rounded ${
                  selectedSize === s ? "bg-black text-white" : ""
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <label htmlFor="quantity">Qty</label>
          <input
            id="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number(e.target.value) || 1))
            }
            className="w-20 border rounded px-2 py-1"
            data-testid="product-details-quantity"
          />
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          data-testid="product-details-add-to-cart"
          className="bg-black text-white px-6 py-3 rounded disabled:opacity-60"
        >
          {isAdding ? "Adding..." : "Add Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;