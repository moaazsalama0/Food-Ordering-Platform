import React, { useEffect, useState } from "react";
import "./Menu.css";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu } from "../redux/services/menuSlice";
import { addToCart } from "../redux/services/cartSlice";

export default function Menu() {
  const dispatch = useDispatch();

  const { items, loading } = useSelector((state) => state.menu);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Load menu from API
  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  // Prevent crash until data exists
  const safeItems = Array.isArray(items) ? items : [];

  // Extract categories safely
  const categories = [
    "All",
    ...new Set(safeItems.map((i) => i.category_name || "Unknown")),
  ];

  // Filtering logic
  const filtered = safeItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" ||
      item.category_name === selectedCategory;

    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  if (loading) {
    return <p className="text-center mt-20 text-xl">Loading menu…</p>;
  }

  return (
    <div className="menu-wrapper mt-24 px-4 pb-90">

      {/* Search Box */}
      <div className="sticky top-16 z-30 pb-3 pt-3">
        <input
          type="text"
          placeholder="Search food…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl bg-white text-black shadow-md outline-none"
        />

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto mt-3 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition ${
                selectedCategory === cat
                  ? "bg-amber-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-white shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-amber-600 font-extrabold text-lg mt-1">
                ${item.price}
              </p>

              <button
                className="w-full mt-3 bg-amber-600 text-white font-semibold py-2 rounded-xl active:scale-[.97] transition"
                onClick={() => handleAddToCart(item)}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Button */}
      <a
        href="/cart"
        className="fixed bottom-6 right-5 bg-amber-600 text-white rounded-full w-[60px] h-[60px] flex items-center justify-center shadow-xl"
      >
        <ShoppingCartIcon className="h-6 w-6" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </a>
    </div>
  );
}