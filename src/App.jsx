// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context (ถ้าใช้ CartContext)
import CartProvider from "./contexts/CartContext";

// Components
import Navbar from "./components/Navbar";
import Slidepic from "./components/Slidepic";
import SpecialDeal from "./components/SpecialDeal";
import PizzaSet from "./components/PizzaSet";
import SnackSet from "./components/SnackSet";
import DrinkingSet from "./components/DrinkingSet";
import Footer from "./components/Footer";

// Pages
import DealsPages from "./pages/DealsPages";
import CheckOutPage from "./pages/CheckOutPage";
import OrderSuccess from "./pages/OrderSuccess";

// หน้า Home รวมทุกส่วนของหน้าแรก
function Home() {
  return (
    <>
    <div className="max-auto">
      <Slidepic />
      <SpecialDeal />
      <div className="py-10">
        <PizzaSet />
        <SnackSet />
        <DrinkingSet />
      </div>
      <Footer />
    </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        {/* ส่วน Navbar อยู่ทุกหน้า */}
        <Navbar />

        <Routes>
          {/* หน้าแรก */}
          <Route path="/" element={<Home />} />

          {/* หน้าโปรโมชันทั้งหมด */}
          <Route path="/deals" element={<DealsPages />} />

          {/* เช็คบิล/ชำระเงิน และหน้าสำเร็จ */}
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
