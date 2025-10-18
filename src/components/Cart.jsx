// Cart.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, X } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";   

export default function Cart() {
  const { items, increase, decrease, remove, totalQty, totalPrice } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [paymentSuccess] = useState(false);
  const navigate = useNavigate();                 

  const toggleCart = () => setShowCart(s => !s);
  const modalRoot = typeof window !== "undefined" ? document.getElementById("modal-root") : null;

  useEffect(() => {
    if (showCart) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [showCart]);

  const handleCheckout = () => {
    if (totalQty > 0) {
      setShowCart(false);
      navigate("/checkout");                     
    }
  };

  return (
    <>
      {/* ปุ่มใน navbar */}
      <button onClick={toggleCart} className="flex items-center relative">  
        <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-green-600 transition cursor-pointer" />
        {totalQty > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {totalQty}
          </span>
        )}
        <span className="hidden md:flex ml-2 font-semibold text-gray-700 hover:text-green-600 transition cursor-pointer">Cart</span>
      </button>

      {/* Popup ผ่าน Portal */}
      {showCart && modalRoot && createPortal(
        <>
          <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm" onClick={toggleCart} />
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="w-full max-w-md max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Your Cart</h2>
                <button onClick={toggleCart} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
              </div>

              {totalQty === 0 ? (
                <div className="text-center py-8 text-gray-500">Your cart is empty</div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {items.filter(i => i.quantity > 0).map(item => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-4">
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-600">฿{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => decrease(item.id)} className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300">-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => increase(item.id)} className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300">+</button>
                        </div>
                        <button onClick={() => remove(item.id)} className="ml-4 text-red-500 hover:text-red-700"><X size={18} /></button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-medium text-lg mb-4">
                      <span>Total:</span><span>฿{totalPrice}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold"
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>,
        modalRoot
      )}
    </>
  );
}
