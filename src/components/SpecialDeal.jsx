import React, { useState, useEffect } from "react";
import { Check, ShoppingCart, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom"; // ✅ เพิ่ม

const SpecialSet = () => {
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isLandscape, setIsLandscape] = useState(false);
  const [addedDeal, setAddedDeal] = useState(null);
  const { addItem } = useCart();
  const navigate = useNavigate(); // ✅ ใช้ navigate hook

  useEffect(() => {
    const handleResize = () => setIsLandscape(window.innerWidth > window.innerHeight);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pizzaSets = [
    { id: 1, name: "Family Set", description: "2 Large Pizzas, 4 Drinks & CheeseBalls", price: 489, discount: 699, tag: "Best Value", color: "from-red-600 to-red-500" },
    { id: 2, name: "Weekend Combo", description: "Buy 1 Large Pizza, Get 1 Medium Free", price: 299, discount: 399, tag: "Limited Time", color: "from-orange-500 to-yellow-400" },
    { id: 3, name: "Student Combo", description: "Medium Pizza & Drink", price: 189, discount: 219, tag: "Popular", color: "from-green-600 to-green-300" },
  ];

  const handleAddToCart = (deal) => {
    addItem({ id: deal.id, name: deal.name, price: deal.price });
    setAddedDeal(deal.id);
    setTimeout(() => setAddedDeal(null), 1500);
  };

  const handleDealClick = (id) => {
    setSelectedDeal(selectedDeal === id ? null : id);
  };

  return (
    <div className="bg-white py-8 px-5 md:px-10 rounded-3xl shadow-lg max-w-[2000px] mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-red-600 tracking-tight">
          🍕 Special Pizza Sets
        </h2>
        <p className="text-gray-600 mt-1">
          Enjoy exclusive combos and limited-time offers!
        </p>
      </div>

      <div
        className={`grid gap-6 ${
          isLandscape ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {pizzaSets.map((deal, i) => (
          <motion.div
            key={deal.id}
            onClick={() => handleDealClick(deal.id)}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`relative border rounded-2xl overflow-hidden cursor-pointer shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
              selectedDeal === deal.id
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-white"
            }`}
          >
            {/* Header Gradient */}
            <div
              className={`bg-gradient-to-r ${deal.color} h-28 flex items-center justify-center text-white`}
            >
              <h3 className="text-2xl font-bold drop-shadow-sm">{deal.name}</h3>
              {deal.tag && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  {deal.tag}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-4 text-center">
              <p className="text-gray-600 text-sm mb-3">{deal.description}</p>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-xl font-bold text-red-600">
                  {deal.price}฿
                </span>
                <span className="text-gray-400 line-through text-sm">
                  {deal.discount}฿
                </span>
              </div>

              {/* Add to Cart */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(deal);
                }}
                className={`flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition ${
                  addedDeal === deal.id ? "bg-green-600" : ""
                }`}
              >
                {addedDeal === deal.id ? (
                  <>
                    <Check size={18} /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add to Cart
                  </>
                )}
              </button>
            </div>

            {selectedDeal === deal.id && (
              <div className="p-4 bg-white border-t text-xs text-gray-600">
                Add extra toppings for 20฿ each. Free delivery over 300฿!
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ✅ ปุ่ม View more deals */}
      <div className="pt-10 text-center">
        <motion.button
          onClick={() => navigate("/deals")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300"
        >
          View more deals
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default SpecialSet;
