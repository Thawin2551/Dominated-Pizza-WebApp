import React, { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, Tag, ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const CATEGORIES = [
  "All", "Family Sets", "Combos", "Student Deals", "Buy 1 Get 1",
  "Wings & Sides", "Drinks", "Vegan", "Limited Time"
];

const ALL_DEALS = [
  { id: 1, name: "Family Set", desc: "2 Large Pizzas, 4 Drinks & CheeseBalls", price: 489, discount: 699, tag: "Best Value", cat: "Family Sets" },
  { id: 2, name: "Weekend Special Combo", desc: "Buy 1 Large Pizza, Get 1 Medium Free", price: 299, discount: 399, tag: "Limited", cat: "Combos" },
  { id: 3, name: "Student Combo", desc: "Medium Pizza & Drink", price: 189, discount: 219, tag: "Popular", cat: "Student Deals" },
  { id: 4, name: "Vegan Delight", desc: "Vegan Cheese + Fresh Veggies (L)", price: 259, discount: 329, tag: "Vegan", cat: "Vegan" },
  { id: 5, name: "Buy 1 Get 1", desc: "Medium Pepperoni (B1G1)", price: 239, discount: 329, tag: "B1G1", cat: "Buy 1 Get 1" },
  { id: 6, name: "Party Wings 12pcs", desc: "Buffalo / BBQ / Garlic", price: 149, discount: 189, tag: "Sides", cat: "Wings & Sides" },
  { id: 7, name: "Cola 1.5L", desc: "Chilled bottle", price: 39, discount: 49, tag: "Drink", cat: "Drinks" },
  { id: 8, name: "Limited Feast", desc: "XL Pizza + 6 Wings + 2 Drinks", price: 399, discount: 529, tag: "Limited Time", cat: "Limited Time" },
];

function useCategoryFilter(items, active) {
  return useMemo(() => {
    if (!active || active === "All") return items;
    return items.filter(d => d.cat === active);
  }, [items, active]);
}

function HorizontalTabs({ active, setActive }) {
  const scrollerRef = useRef(null);

  const scrollBy = (offset) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        aria-label="scroll-left"
        onClick={() => scrollBy(-220)}
        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow hover:bg-gray-50"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div
        ref={scrollerRef}
        className="flex gap-2 overflow-x-auto snap-x snap-mandatory px-1 py-2 scrollbar-thin"
        style={{ scrollBehavior: "smooth" }}
      >
        {CATEGORIES.map((c) => {
          const activeStyle =
            c === active
              ? "bg-red-600 text-white border-red-600 shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300";
          return (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`snap-start whitespace-nowrap border rounded-full px-3 py-1.5 text-sm font-medium transition ${activeStyle}`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <button
        aria-label="scroll-right"
        onClick={() => scrollBy(220)}
        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow hover:bg-gray-50"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function DealCard({ d, onAdd, added }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="border rounded-2xl overflow-hidden bg-white shadow hover:shadow-xl transition relative"
    >
      <div className="relative bg-gradient-to-r from-red-500 to-orange-400 h-28 flex items-center justify-center text-white">
        <h3 className="text-xl font-bold">{d.name}</h3>
        {!!d.tag && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 text-black">
            <Tag className="w-3 h-3" />
            {d.tag}
          </span>
        )}
      </div>

      <div className="p-4 text-center">
        <p className="text-gray-600 text-sm mb-2">{d.desc}</p>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-lg font-bold text-red-600">{d.price}฿</span>
          <span className="text-gray-400 line-through text-xs">{d.discount}฿</span>
        </div>

        <button
          onClick={() => onAdd(d)}
          className={`w-full py-2 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 transition ${
            added ? "bg-green-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {added ? <><Check size={16}/> Added!</> : <><ShoppingCart size={16}/> Add to Cart</>}
        </button>
      </div>
    </motion.div>
  );
}

export default function DealsPage() {
  const [active, setActive] = React.useState("All");
  const [added, setAdded] = React.useState(null);
  const filtered = useCategoryFilter(ALL_DEALS, active);
  const navigate = useNavigate();
  const { addItem, totalQty } = useCart();

  const handleAdd = (deal) => {
    addItem({ id: deal.id, name: deal.name, price: deal.price });
    setAdded(deal.id);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-left">
          <h1 className="text-3xl font-extrabold text-red-600 tracking-tight">🍕 All Pizza Deals</h1>
          <p className="text-gray-600 text-sm">Choose Your Special Deal with your Special Person</p>
        </div>

        {/* Checkout summary */}
        <button
          onClick={() => navigate("/place_order")}
          className="relative flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full shadow-md transition"
        >
          {totalQty > 0 ? (
            <span className="bg-white text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {totalQty}
            </span>
          ) : (
            <span className="text-lg">Check out</span>
          )}
        </button>
      </div>

      {/* Tabs */}

      {/* Deals Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((d, i) => (
          <DealCard key={d.id} d={d} onAdd={handleAdd} added={added === d.id} />
        ))}
      </div>

      {/* Back to home */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
