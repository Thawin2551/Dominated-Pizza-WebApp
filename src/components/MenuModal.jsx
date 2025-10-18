import React, { useEffect, useState } from "react";
import { X, Minus, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../contexts/CartContext";

export default function MenuModal({ item, open, onClose }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (open) {
      setQty(1);
      setJustAdded(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !item) return null;

  const unit = Number(item.price || 0);
  const total = unit * qty;

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: unit,
    image: item.image || item.img || item.thumbnail || null
    });
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 700);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="absolute inset-0 bg-black"
          onClick={onClose}
        />

        <motion.div
          initial={{ y: 12, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="relative z-70 w-[92%] max-w-2xl rounded-xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-4 p-4">
            <img
              src={item.image || "https://via.placeholder.com/300"}
              alt={item.name}
              className="w-36 h-28 object-cover rounded-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300";
              }}
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.type || item.category}</p>
                  <p className="text-sm text-gray-500 mt-1">เริ่มต้น ฿{unit}</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2 border rounded-md">
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="px-3 py-1 border rounded-md">{qty}</div>
                  <button onClick={() => setQty((q) => q + 1)} className="p-2 border rounded-md">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-500">ต่อชิ้น</div>
                  <div className="text-lg font-bold text-rose-500">฿{unit}</div>
                  <div className="text-sm text-gray-700">รวม: ฿{total}</div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleAdd}
                  className={`w-full py-3 rounded-lg font-bold text-white transition ${
                    justAdded ? "bg-green-600" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="inline w-4 h-4 mr-2" />
                      Added
                    </>
                  ) : (
                    `Add to cart • ฿${total}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
