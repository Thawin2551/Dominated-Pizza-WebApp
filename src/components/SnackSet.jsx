import React, { useState, useEffect } from "react";
import { Plus, Check, X, Loader2, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../contexts/CartContext";

const snacks = [
  { id: "s1", name: "Cheeseballs", price: 69, image: "https://thumbs.dreamstime.com/b/crispy-golden-cheese-balls-served-sauces-garnished-parsley-crispy-golden-cheese-balls-served-sauces-garnished-355486615.jpg", isNew: true },
  { id: "s2", name: "Cheesesticks", price: 69, image: "https://allshecooks.com/wp-content/uploads/2013/10/mozzarella-sticks.jpg" },
  { id: "s3", name: "French Fries", price: 69, image: "https://images.themodernproper.com/production/posts/2022/Homemade-French-Fries_8.jpg?w=1200&h=1200&q=60&fm=jpg&fit=crop&dm=1662474181&s=15046582e76b761a200998df2dcad0fd" },
  { id: "s4", name: "Onion Rings", price: 59, image: "https://www.tasteofhome.com/wp-content/uploads/2018/01/Crispy-Fried-Onion-Rings_EXPS_FT24_44198_0404_JR_1.jpg" },
  { id: "s5", name: "Chicken Nuggets", price: 79, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYvpxs1E5I-UMLMKnb74-Sr1NB7EVHXSOmvg&s" },
  { id: "s6", name: "Garlic Bread", price: 49, image: "https://www.ambitiouskitchen.com/wp-content/uploads/2023/02/Garlic-Bread-4.jpg" },
  { id: "s7", name: "Mozzarella Balls", price: 75, image: "https://simply-delicious-food.com/wp-content/uploads/2019/11/Fried-mozzarella-3.jpg" },
  { id: "s8", name: "Nachos", price: 89, image: "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2022/03/Nachos-main-1.jpg", isNew: true },
  { id: "s9", name: "Spring Rolls", price: 59, image: "https://thaicaliente.com/wp-content/uploads/2020/09/Spring-Roll-Feature.jpg" },
  { id: "s10", name: "Mini Pizzette", price: 99, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp-DifUApF-WEvJ8kHlHUA7x78EBx2_uBqag&s" },
];

const money = (n) => `฿${Number(n).toLocaleString("th-TH", { maximumFractionDigits: 0 })}`;

export default function SnackSet() {
  const { addItem } = useCart();
  const [editing, setEditing] = useState(null);
  const [justAddedId, setJustAddedId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let t;
    if (showToast) t = setTimeout(() => setShowToast(false), 2000);
    return () => clearTimeout(t);
  }, [showToast]);

  const openCustomize = (item) => {
    setEditing(item);
    setQty(1);
  };

  const closeCustomize = () => setEditing(null);

  const unitPrice = editing ? editing.price : 0;
  const total = unitPrice * qty;

  const confirmAdd = () => {
    if (!editing) return;
    setLoading(true);

    setTimeout(() => {
      const variantId = `${editing.id}-qty${qty}`;

      addItem({
        id: variantId,
        name: `${editing.name}${qty > 1 ? ` x${qty}` : ""}`,
        price: unitPrice,
        quantity: qty,
        meta: { baseId: editing.id, qty, basePrice: editing.price },
      });

      setJustAddedId(editing.id);
      setLoading(false);
      setShowToast(true);
      closeCustomize();
      setTimeout(() => setJustAddedId(null), 900);
    }, 900);
  };

  return (
    <div className="relative max-w-[1400px] mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>ทำรายการเสร็จแล้ว!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-3xl font-bold uppercase">Snacks</h2>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
        >
          {snacks.map((p) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 25 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
            >
              <div
                className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow hover:shadow-lg transition cursor-pointer bg-gray-100"
                onClick={() => openCustomize(p)}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/80 to-transparent text-white text-lg">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold line-clamp-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {p.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {money(p.price)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openCustomize(p);
                        }}
                        aria-label={`Add ${p.name}`}
                        className="cursor-pointer rounded-full border border-white bg-white/70 p-2 text-gray-800 backdrop-blur transition duration-300 hover:bg-green-700 hover:text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                {p.isNew && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
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
                className="cursor-pointer absolute right-3 top-3 z-20 rounded-full border border-white bg-white/50 p-2 text-gray-700 backdrop-blur duration-300 hover:bg-red-700 dark:bg-white/10 dark:text-white"
                aria-label="Close"
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
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                    ราคา: {money(editing.price)}
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
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        ต่อชิ้น: {money(unitPrice)}
                      </p>
                      <p className="text-xl font-bold text-white">
                        รวม: {money(total)}
                      </p>
                    </div>
                  </section>

                  <button
                    onClick={confirmAdd}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 font-semibold text-white shadow-lg transition hover:bg-green-700 active:scale-[0.99]"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Check className="h-5 w-5" />
                    )}
                    {loading ? "กำลังทำรายการ..." : "Add to cart"}
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
