import React, { useState, useMemo, useEffect } from "react";
import { Plus, Minus, Check, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../contexts/CartContext";

const PIZZAS = [
  { id: "p1", name: "Seafood Pizza", price: 189, image: "https://www.thetotallifediet.com/wp-content/uploads/2017/08/seafood-pizza_inner.jpg", isNew: true },
  { id: "p2", name: "Caviar Pizza", price: 289, image: "https://imageio.forbes.com/specials-images/imageserve/658622fba0cad06a3f65a63a/Caviar-Pie/960x0.jpg?height=839&width=711&fit=bounds", isNew: true },
  { id: "p3", name: "Truffle Pizza", price: 259, image: "https://threebigbites.com/wp-content/uploads/2019/01/FoodPizzaTruffleLeekBirthday.jpg", isNew: true },
  { id: "p4", name: "Pepperoni Pizza", price: 169, image: "https://www.cobsbread.com/us/wp-content//uploads/2022/09/Pepperoni-pizza-850x630-1.png", isNew: false },
  { id: "p5", name: "Cheesy Pizza", price: 169, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Lj3_8eh0xYQLDhyh1pYwOF6l00mL7hIfww&s", isNew: false },
  { id: "p6", name: "Sausage Pizza", price: 169, image: "https://cookingwithcarbs.com/wp-content/uploads/2021/06/spicy-sausage-pizza-final8-min.jpg", isNew: false },
  { id: "p7", name: "Hawaiian Pizza", price: 179, image: "https://hips.hearstapps.com/hmg-prod/images/hawaiian-pizza-index-65f4641de4b08.jpg?crop=0.889xw:1.00xh;0.0224xw,0", isNew: false },
  { id: "p8", name: "BBQ Chicken Pizza", price: 199, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRvAikqGmSQsJ7s-L-rq9ExiVFah_EJ3TQGQ&s", isNew: false },
  { id: "p9", name: "Margherita", price: 149, image: "https://au.ooni.com/cdn/shop/articles/20220211142645-margherita-9920.jpg?crop=center&height=800&v=1737368217&width=800", isNew: false },
  { id: "p10", name: "Four Cheese", price: 209, image: "https://goldbelly.imgix.net/uploads/showcase_media_asset/image/109133/sicilian-four-cheese-pizza-3-pack.b1ae4070a2e0992b829096f74a880583.jpg?ixlib=react-9.10.0&ar=1%3A1&fit=crop&w=3840&auto=format", isNew: false },
];

const SIZE_UPCHARGE = { S: 0, M: 30, L: 70 };

const TOPPINGS = [
  { key: "extra_cheese", label: "Extra Cheese", price: 20 },
  { key: "bacon", label: "Bacon", price: 25 },
  { key: "mushroom", label: "Mushroom", price: 15 },
  { key: "olive", label: "Black Olive", price: 15 },
];

const money = (n) =>
  `฿${Number(n).toLocaleString("th-TH", { maximumFractionDigits: 0 })}`;

export default function PizzaSet() {
  const { addItem } = useCart();
  const [justAddedId, setJustAddedId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [selectedTops, setSelectedTops] = useState({});

  useEffect(() => {
    let t;
    if (showToast) t = setTimeout(() => setShowToast(false), 2000);
    return () => clearTimeout(t);
  }, [showToast]);

  const openCustomize = (p) => {
    setEditing(p);
    setSize("M");
    setQty(1);
    setSelectedTops({});
  };

  const closeCustomize = () => setEditing(null);

  const toppingsTotal = useMemo(() => {
    return Object.entries(selectedTops).reduce((sum, [k, v]) => {
      if (!v) return sum;
      const t = TOPPINGS.find((tt) => tt.key === k);
      return sum + (t?.price ?? 0);
    }, 0);
  }, [selectedTops]);

  const unitPrice = useMemo(() => {
    if (!editing) return 0;
    return editing.price + SIZE_UPCHARGE[size] + toppingsTotal;
  }, [editing, size, toppingsTotal]);

  const total = unitPrice * qty;

  const toggleTop = (key) =>
    setSelectedTops((prev) => ({ ...prev, [key]: !prev[key] }));

  const confirmAdd = () => {
    if (!editing) return;
    setLoading(true);
    setTimeout(() => {
      const chosenTops = Object.entries(selectedTops)
        .filter(([, v]) => v)
        .map(([k]) => k);
      const variantId = `${editing.id}-${size}-${chosenTops.sort().join("_") || "plain"}`;

      addItem({
        id: variantId,
        name: `${editing.name} (${size})${chosenTops.length ? " +" + chosenTops.length + " toppings" : ""}`,
        price: unitPrice,
        quantity: qty,
        meta: {
          baseId: editing.id,
          size,
          toppings: chosenTops,
          basePrice: editing.price,
          sizeUpcharge: SIZE_UPCHARGE[size],
          toppingsTotal,
        },
      });

      setJustAddedId(editing.id);
      setLoading(false);
      setShowToast(true);
      closeCustomize();
      setTimeout(() => setJustAddedId(null), 900);
    }, 1200);
  };

  // animation variants สำหรับ fade ขึ้น
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
              <span>ทำรายการเสร็จแล้ว!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-3xl font-bold uppercase">Pizzas</h2>
        </div>

        {/* Fade-in grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {PIZZAS.map((p, i) => (
            <motion.div
              key={p.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={i}
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
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                    เริ่มต้น {money(editing.price)}
                  </p>

                  <section className="mt-3">
                    <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                      Size
                    </p>
                    <div className="flex gap-2">
                      {["S", "M", "L"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={`rounded-xl border px-3 py-1.5 text-sm transition ${
                            size === s
                              ? "border-red-600 bg-red-600 text-white shadow"
                              : "border-white/30 bg-white/40 text-gray-800 hover:bg-white/60 dark:bg-white/10 dark:text-white"
                          }`}
                        >
                          {s}{" "}
                          {SIZE_UPCHARGE[s]
                            ? `(+${money(SIZE_UPCHARGE[s])})`
                            : ""}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="mt-4">
                    <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                      Toppings
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {TOPPINGS.map((t) => {
                        const active = !!selectedTops[t.key];
                        return (
                          <button
                            key={t.key}
                            onClick={() => toggleTop(t.key)}
                            className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${
                              active
                                ? "border-green-500/60 bg-green-50 text-green-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                                : "border-white/30 bg-white/40 text-gray-800 hover:bg-white/60 dark:bg-white/10 dark:text-white"
                            }`}
                          >
                            <span>{t.label}</span>
                            <span className="font-medium">
                              +{money(t.price)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

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
                  </button>z
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
