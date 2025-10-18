import React, { createContext, useContext, useMemo, useState } from "react";

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]); 
  // {id, name, price, quantity}

  const addItem = (item) => {
    setItems(prev => {
      const i = prev.find(x => x.id === item.id);
      if (i) return prev.map(x => x.id === item.id ? {...x, quantity: x.quantity + 1} : x);
      return [...prev, {...item, quantity: 1}];
    });
  };

  const increase = (id) =>
    setItems(prev => prev.map(x => x.id === id ? {...x, quantity: x.quantity + 1} : x));

  const decrease = (id) =>
    setItems(prev => prev.map(x => (x.id === id && x.quantity > 1) ? {...x, quantity: x.quantity - 1} : x));

  const remove = (id) => setItems(prev => prev.filter(x => x.id !== id));

  const totalQty = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((s, i) => s + i.quantity * i.price, 0), [items]);

  const value = { items, addItem, increase, decrease, remove, totalQty, totalPrice, setItems };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
