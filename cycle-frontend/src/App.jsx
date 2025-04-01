import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Ensure correct path and casing
import Layout from "./components/Layout/Layout";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import CalculateForm from "./pages/calculateForm/CalculateForm";
import Coupons from "./pages/manage/Coupons";

import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthContext";
import CartProvider from "./context/CartContext";

import Cart from "./pages/cart/Cart";

import ManageOrders from "./pages/manage/Orders";
import NotFound from "./utils/NotFound";
import Address from "./pages/address/Address";
import UserOrders from "./pages/cart/UserOrders"
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SingIn";
import Items from "./pages/manage/Items";
import Brand from "./pages/manage/Brand";
import CycleComparison from "./pages/cycleComparision/CyclesComparison";

function App() {
  return (
    <AuthProvider>
      
        <CartProvider>
          
            <Router>
              <Routes>
                {/* Auth routes outside of layout */}
                <Route path="/signIn" element={<SignIn />} />
                <Route path="/signUp" element={<SignUp />} />

                {/* Protected routes with layout */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/calculate" element={<CalculateForm />} />
                  <Route path="/user/orders" element={<UserOrders/>} />
                  <Route path="/address" element={<Address />} />
                  <Route path="/compare" element={<CycleComparison />}/>
                  <Route
                    path="/items"
                    element={
                      <ProtectedRoute requiredRole={["ADMIN", "MANAGER","EMPLOYEE"]}>
                        <Items/>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/brand"
                    element={
                      <ProtectedRoute requiredRole={["ADMIN", "MANAGER","EMPLOYEE"]}>
                        <Brand />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/manage/orders"
                    element={
                      <ProtectedRoute requiredRole={["ADMIN", "MANAGER"]}>
                        <ManageOrders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/manage/coupons"
                    element={
                      <ProtectedRoute requiredRole={["ADMIN", "MANAGER"]}>
                        <Coupons />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/cart" element={<Cart />} />
                </Route>

                {/* 404 Not Found route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
    
        </CartProvider>
    </AuthProvider>
  );
}

export default App;
