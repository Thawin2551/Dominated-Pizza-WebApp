import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_MENU } from "../data/menuData";

// Optional fuzzy search if fuse.js installed — fallback to simple token search
let Fuse = null;
try {
  // eslint-disable-next-line
  Fuse = require("fuse.js");
} catch (e) {
  Fuse = null;
}

export default function SearchAutoComplete({
  placeholder = "Search your meal",
  onSelect, // if provided, call this when user picks an item
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [openList, setOpenList] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const debounceRef = useRef(null);
  const fuseRef = useRef(null);

  useEffect(() => {
    if (Fuse) {
      try {
        fuseRef.current = new Fuse(ALL_MENU, {
          keys: ["name", "type", "category", "desc"],
          threshold: 0.35,
          distance: 100,
          includeScore: true,
        });
      } catch (err) {
        fuseRef.current = null;
        // console.warn("Fuse init failed", err);
      }
    }
  }, []);

  const norm = (s = "") => s.toString().toLowerCase().normalize();

  const runSimpleSearch = (query) => {
    const t = norm(query).trim();
    if (!t) return [];
    const tokens = t.split(/\s+/);
    const scored = ALL_MENU.map((item) => {
      const name = norm(item.name || "");
      const type = norm(item.type || item.category || "");
      const desc = norm(item.desc || "");
      let score = 0;
      for (const token of tokens) {
        if (!token) continue;
        if (name.startsWith(token)) score += 100;
        if (name.includes(token)) score += 50;
        if (type.includes(token)) score += 30;
        if (desc.includes(token)) score += 10;
      }
      return { item, score };
    })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((x) => x.item);

    return scored;
  };

  const runSearch = (query) => {
    if (!query || !query.trim()) return [];
    if (fuseRef.current) {
      const raw = fuseRef.current.search(query, { limit: 12 });
      // normalise entries to items (fuse versions differ)
      const items = raw.map((r) => (r.item ? r.item : r[0] || r));
      return items.slice(0, 12);
    } else {
      return runSimpleSearch(query);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const r = runSearch(q);
      setResults(r);
      setOpenList(r.length > 0);
      setActiveIdx(r.length ? 0 : -1);
    }, 140);
    return () => clearTimeout(debounceRef.current);
  }, [q]);

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (!openList) return;
      if (e.key === "Escape") {
        setOpenList(false);
        setActiveIdx(-1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(results.length - 1, i + 1));
        scrollToActive();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(0, i - 1));
        scrollToActive();
      } else if (e.key === "Enter") {
        if (activeIdx >= 0 && results[activeIdx]) selectItem(results[activeIdx]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openList, results, activeIdx]);

  const scrollToActive = () => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${activeIdx}"]`);
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const clear = () => {
    setQ("");
    setResults([]);
    setOpenList(false);
    setActiveIdx(-1);
    inputRef.current?.focus();
  };

  const selectItem = (item) => {
    // if parent provided a onSelect handler, call it so parent (Navbar) can open centered modal
    if (typeof onSelect === "function") {
      onSelect(item);
      setQ("");
      setResults([]);
      setOpenList(false);
      setActiveIdx(-1);
      return;
    }
    // fallback: if no onSelect, just open the listless state (could open local modal if you want)
    setQ("");
    setResults([]);
    setOpenList(false);
    setActiveIdx(-1);
    // no local modal here — keep component lean and let parent handle UI
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex items-center gap-2 bg-white border rounded-full px-3 py-2 shadow-sm">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => {
            if (results.length) setOpenList(true);
          }}
          placeholder={placeholder}
          className="flex-1 outline-none bg-transparent text-sm"
          aria-autocomplete="list"
          aria-expanded={openList}
        />
        {q ? (
          <button onClick={clear} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        ) : null}
      </div>

      <AnimatePresence>
        {openList && results.length > 0 && (
          <motion.ul
            ref={listRef}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 mt-2 w-full max-h-80 overflow-auto bg-white rounded-xl shadow-2xl border divide-y"
          >
            {results.map((r, idx) => (
              <li
                key={r.id}
                data-idx={idx}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(-1)}
                onClick={() => selectItem(r)}
                className={`flex gap-3 items-center px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                  idx === activeIdx ? "bg-gray-100" : ""
                }`}
              >
                <img
                  src={r.image || "https://via.placeholder.com/64"}
                  alt={r.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/64";
                  }}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-gray-500">
                    {r.type || r.category || ""} {r.price ? `• ฿${r.price}` : ""}
                  </div>
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
