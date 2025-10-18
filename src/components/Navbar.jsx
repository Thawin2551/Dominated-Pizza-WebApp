// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import {
  Search,
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import SearchAutoComplete from "./SearchAutoComplete";
import MenuModal from "./MenuModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openSearchMobile, setOpenSearchMobile] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // modal control in Navbar
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const { items, increase, decrease, remove, totalQty, totalPrice } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenSearchMobile(false);
        setCartOpen(false);
        setModalOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const money = (v) => (typeof v === "number" ? v.toLocaleString("en-US") : v);

  // Handler to receive selection from SearchAutoComplete
  const handleSearchSelect = (item) => {
    setSelectedItemForModal(item);
    setModalOpen(true);
    setOpenSearchMobile(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 bg-white supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="https://openclipart.org/image/800px/341088"
              alt="Logo"
              className="h-16 w-16 object-contain"
            />
            <span className="hidden md:inline font-semibold text-lg md:text-xl">
              Dominated Pizza
            </span>
          </div>

          {/* Desktop search - centered */}
          <div className="hidden md:flex items-center justify-center flex-1 px-6">
            <div className="relative w-full max-w-2xl">
              <SearchAutoComplete onSelect={handleSearchSelect} />
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Mobile search toggle */}
            <button
              className="md:hidden p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              onClick={() => setOpenSearchMobile((v) => !v)}
              aria-label="open search"
            >
              {openSearchMobile ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              aria-label="open cart"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile search area (full width) */}
        <AnimatePresence>
          {openSearchMobile && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.12 }}
              className="md:hidden bg-white border-t border-gray-200 shadow-inner p-3"
            >
              <SearchAutoComplete onSelect={handleSearchSelect} />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Slide-out Panel */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setCartOpen(false)}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.18 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                  <h3 className="text-lg font-bold">Your Cart</h3>
                </div>
                <button onClick={() => setCartOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-3">
                {items.length === 0 ? (
                  <div className="text-center text-gray-500 py-10">Your cart is empty</div>
                ) : (
                  items.map((it) => {
                    // get size (support different shapes)
                    const size = it.size || (it.meta && it.meta.size) || "-";
                    return (
                      <div key={it.id} className="flex flex-col gap-2 bg-white border rounded-xl p-3 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-sm">{it.name}</div>
                            <div className="text-xs text-gray-500">
                              Size: <span className="font-medium text-gray-700">{size}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">฿{money(it.price)}</div>
                          </div>

                          <button onClick={() => remove(it.id)} className="p-1 rounded-md hover:bg-gray-100 text-gray-600" aria-label="remove">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => decrease(it.id)} className="w-8 h-8 rounded-md border flex items-center justify-center hover:bg-gray-50">
                            <Minus className="w-4 h-4" />
                          </button>
                          <div className="px-3 py-1 border rounded-md text-sm">{it.quantity}</div>
                          <button onClick={() => increase(it.id)} className="w-8 h-8 rounded-md border flex items-center justify-center hover:bg-gray-50">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-600">Subtotal</div>
                  <div className="text-lg font-bold">฿{money(totalPrice)}</div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      navigate("/deals");
                    }}
                    className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Continue Shopping
                  </button>

                  <button
                    onClick={() => {
                      setCartOpen(false);
                      navigate("/place_order");
                    }}
                    className="flex-1 bg-rose-600 text-white py-3 rounded-lg font-semibold hover:opacity-95 flex items-center justify-center gap-2"
                  >
                    Checkout <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Centered MenuModal controlled by Navbar */}
      <MenuModal item={selectedItemForModal} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
