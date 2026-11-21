import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Products from "../pages/Product";
import ProtectedRoute from "./ProtectedRoute";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Placed from "../pages/PlacedOrder";

const AllRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/register" element={<Navigate to="/signup" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<Products />} />

            {/* карточка товара — публичный маршрут */}
            <Route path="/products/:id" element={<ProductDetails />} />

            {/* корзина / оформление / подтверждение — только для авторизованных */}
            <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/placed" element={<Placed />} />
            </Route>
        </Routes>
    );
};

export default AllRoutes;
