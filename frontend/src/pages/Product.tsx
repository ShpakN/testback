import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts, addToCart } from "../api/api";
import { toast } from "react-toastify";
import { FiShoppingCart } from "react-icons/fi";

interface Product {
  _id: string;
  title: string;
  price: number;
  images: string[];
  sizes?: string[];
  description?: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch {
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.title?.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleAddToCart = async (product: Product) => {
    const token = localStorage.getItem("token");
    const selectedSize = selectedSizes[product._id] || product.sizes?.[0];

    if (!token) {
      toast.error("Please log in to add items to cart.");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return;
    }

    const payload = {
      productId: product._id,
      images: product.images ?? [],
      title: product.title,
      price: Number(product.price),
      quantity: 1,
      size: selectedSize,
    };
    console.log("cart/add payload:", payload);

    try {
      const res = await addToCart(payload);
      toast.success(res.data?.message ?? "Added to cart Sucsessfully");
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message ?? "Error adding to cart";
      console.error("cart/add failed:", status, msg);
      toast.error(msg);
      if (status === 401) navigate("/login");
    }
  };

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  if (loading) {
    return (
      <p className="p-8 text-center" data-testid="products-loading">
        Loading products...
      </p>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div className="mb-6">
        <input
          type="search"
          data-testid="search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border rounded px-3 py-2"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-600" data-testid="no-products">
          Товаров не найдено
        </p>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          data-testid="products-grid"
        >
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              data-testid="product-card"
              data-product-id={product._id}
              className="group border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition flex flex-col"
            >
              <Link to={`/products/${product._id}`} className="block">
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  className="w-full h-56 object-cover"
                  data-testid="product-image"
                />
              </Link>

              <div className="p-4 flex flex-col gap-2 flex-1">
                <Link
                  to={`/products/${product._id}`}
                  data-testid="product-card-title"
                  className="font-semibold hover:underline"
                >
                  {product.title}
                </Link>

                <p className="text-gray-600">
                  <span className="text-xl font-bold" data-testid="product-price">
                    $ {product.price}
                  </span>
                </p>

                {!!product.sizes?.length && (
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => {
                      const active =
                        (selectedSizes[product._id] || product.sizes?.[0]) === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          data-testid={`size-${size}`}
                          onClick={() => handleSizeChange(product._id, size)}
                          aria-pressed={active}
                          className={`px-3 py-1 border rounded text-sm ${
                            active ? "bg-[#319795] text-white border-[#319795]" : ""
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="mt-auto pt-2 flex gap-2">
                  <button
                    type="button"
                    data-testid="add-to-cart"
                    className="flex-1 px-4 cursor-pointer flex gap-2 items-center justify-center bg-[#319795] text-white py-1.5 rounded-md hover:bg-teal-700 transition"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FiShoppingCart className="h-5 w-5 text-white" />
                    Add Cart
                  </button>

                  <button
                    type="button"
                    data-testid="view-details"
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="px-4 border rounded-md hover:bg-gray-50"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;