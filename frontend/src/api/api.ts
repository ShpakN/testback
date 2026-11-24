import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      console.warn("[401]", err.config?.method?.toUpperCase(), err.config?.url);
    }
    return Promise.reject(err);
  }
);

export const signup = async (userData:any) => {
    return await api.post("/users/register", userData);
  };

export const login = async (credentials:any) => {
  return await api.post("/users/login", credentials);
};

export const getProducts = async () => {
  return await api.get("/products");
};


export const getProductById = async (id:any) => {
  return await api.get(`/products/${id}`);
};

export const addToCart = async (cartItems:any) => {
  return await api.post("/cart/add", cartItems);
};

export const getCartItems = async () => {
  return await api.get("/cart");
};

export const deleteCartItem = async (itemId:any) => {
  return await api.delete(`/cart/remove/${itemId}`);
};



export const createOrder = async (orderData:any) => {
  return await api.post("/orders/create", orderData);
};

export const getOrder = async () => {
  return await api.get("/orders/get");
};


export default api;