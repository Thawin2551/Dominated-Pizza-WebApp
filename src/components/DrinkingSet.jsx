import React, { useState, useMemo, useEffect } from "react";
import { Plus, Minus, Check, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../contexts/CartContext";

const DRINKS = [
  { id: "d1", name: "Coke", price: 15, image: "https://cloudfront-eu-central-1.images.arcpublishing.com/williamreed/DI3XSD7TIVI6TP56HGFBGHDU3Y.jpg", isNew: false },
  { id: "d2", name: "Water", price: 8, image: "https://st.bigc-cs.com/cdn-cgi/image/format=webp,quality=90/public/media/catalog/product/07/88/8850999320007/8850999320007_1-20250724185102-.jpg", isNew: false },
  { id: "d3", name: "Lemon Soda", price: 15, image: "https://www.workpointtoday.com/_next/image?url=https%3A%2F%2Fimages.workpointtoday.com%2Fworkpointnews%2F2020%2F08%2F20161039%2F1597914636_27026_web-logo19.webp&w=2048&q=75", isNew: false },
  { id: "d4", name: "Orange Juice", price: 20, image: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/orange-juice-1296x728-feature.jpg?w=1155&h=1528", isNew: false },
  { id: "d5", name: "Iced Tea", price: 18, image: "https://hips.hearstapps.com/hmg-prod/images/delish-210419-iced-tea-02-landscape-jg-1619020612.jpg?crop=0.670xw:1.00xh;0.176xw,0&resize=1200:*", isNew: false },
  { id: "d6", name: "Latte", price: 45, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Caffe_Latte_at_Pulse_Cafe.jpg/1200px-Caffe_Latte_at_Pulse_Cafe.jpg", isNew: false },
  { id: "d7", name: "Cappuccino", price: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyEIQ7pNkJBACp3vLTjJ5Abxm6LY8-gqJYmg&s", isNew: false },
  { id: "d8", name: "Matcha Latte", price: 55, image: "https://cdn.loveandlemons.com/wp-content/uploads/2023/06/iced-matcha-latte.jpg", isNew: true },
  { id: "d9", name: "Chocolate", price: 48, image: "https://swisshouse-shop.com/pub/media/mageplaza/blog/post/c/a/caotina2.jpg", isNew: false },
  { id: "d10", name: "Beer", price: 20, image: "https://minuman.com/cdn/shop/articles/Everything-You-Need-to-Know-About-Beer-2_84f4045b-b7e1-4b56-a72b-46b79b065088.jpg?v=1758167419", isNew: false },
];

const money = (n) =>
  `฿${Number(n).toLocaleString("th-TH", { maximumFractionDigits: 0 })}`;

export default function DrinkSet() {
  const { addItem } = useCart();
  const [editing, setEditing] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [justAddedId, setJustAddedId] = useState(null);

  useEffect(() => {
    let t;
    if (showToast) t = setTimeout(() => setShowToast(false), 2000);
    return () => clearTimeout(t);
  }, [showToast]);

  const openCustomize = (d) => {
    setEditing(d);
    setQty(1);
  };

  const closeCustomize = () => setEditing(null);

  const total = useMemo(() => {
    if (!editing) return 0;
    return editing.price * qty;
  }, [editing, qty]);

  const confirmAdd = () => {
    if (!editing) return;
    setLoading(true);
    setTimeout(() => {
      addItem({
        id: `${editing.id}-${qty}`,
        name: `${editing.name}`,
        price: editing.price,
        quantity: qty,
      });

      setJustAddedId(editing.id);
      setLoading(false);
      setShowToast(true);
      closeCustomize();
      setTimeout(() => setJustAddedId(null), 900);
    }, 1200);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
    }),
  };

  return (
    <div className="relative max-w-[1400px] mx-auto">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>เพิ่มลงตะกร้าเรียบร้อย!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-3xl font-bold uppercase">Drinks</h2>
        </div>

        {/* Fade-in grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {DRINKS.map((d, i) => (
            <motion.div
              key={d.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={i}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow hover:shadow-lg transition cursor-pointer bg-gray-100"
              onClick={() => openCustomize(d)}
            >
              <img
                src={d.image}
                alt={d.name}
                className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                loading="lazy"
              />

              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/80 to-transparent text-white text-lg">
                <div className="flex items-center justify-between">
                  <p className="font-semibold line-clamp-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {d.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {money(d.price)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCustomize(d);
                      }}
                      aria-label={`Add ${d.name}`}
                      className="cursor-pointer rounded-full border border-white bg-white/70 p-2 text-gray-800 backdrop-blur transition duration-300 hover:bg-green-700 hover:text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {d.isNew && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  New
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Customize Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCustomize}
          >
            <motion.div
              role="dialog"
              aria-modal
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-2xl dark:bg-neutral-900/70"
              initial={{ y: 24, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 24, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <button
                onClick={closeCustomize}
                className="absolute right-3 top-3 z-20 rounded-full border border-white/30 bg-white/50 p-2 text-gray-700 backdrop-blur hover:bg-red-600 duration-300 dark:bg-white/10 dark:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col gap-5 p-4 md:flex-row md:p-6">
                <div className="md:w-1/2">
                  <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/20 shadow-md backdrop-blur">
                    <img
                      src={editing.image}
                      alt={editing.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editing.name}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                    ราคา {money(editing.price)}
                  </p>

                  <section className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/60 text-gray-800 shadow backdrop-blur transition hover:bg-white dark:bg-white/10 dark:text-white"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-9 text-center text-lg font-semibold text-gray-900 dark:text-white">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty((q) => q + 1)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/60 text-gray-800 shadow backdrop-blur transition hover:bg-white dark:bg-white/10 dark:text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-white">
                        รวม: {money(total)}
                      </p>
                    </div>
                  </section>

                  <button
                    onClick={confirmAdd}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 font-semibold text-white shadow-lg transition hover:bg-green-700 active:scale-[0.99]"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Check className="h-5 w-5" />
                    )}
                    {loading ? "กำลังเพิ่ม..." : "Add to cart"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
