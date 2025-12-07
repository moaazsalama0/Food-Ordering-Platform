import React, { useEffect, useState } from "react";
import "./Menu.css";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu } from "../redux/services/menuSlice";
import { addToCart } from "../redux/services/cartSlice";

export default function Menu() {
  const dispatch = useDispatch();

  const { items, loading, status, error } = useSelector((state) => state.menu);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Load menu from API
  useEffect(() => {
    console.log('Dispatching fetchMenu...');
    dispatch(fetchMenu());
  }, [dispatch]);

  // Debug logs
  useEffect(() => {
    console.log('Menu State:', { items, loading, status, error });
  }, [items, loading, status, error]);

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

  // Loading state
  if (loading || status === 'loading') {
    return (
      <div className="menu-wrapper mt-24 px-4">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="text-xl mt-4 text-gray-600">Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="menu-wrapper mt-24 px-4">
        <div className="text-center py-20">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchMenu())}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (safeItems.length === 0 && status === 'succeeded') {
    return (
      <div className="menu-wrapper mt-24 px-4">
        <div className="text-center py-20">
          <div className="text-gray-400 text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No dishes available</h2>
          <p className="text-gray-600">Check back later for delicious options!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-wrapper mt-24 px-4 pb-90">
      
      {/* Debug Info (remove in production) */}
      <div className="bg-blue-100 border border-blue-400 p-4 rounded mb-4">
        <p className="text-sm">
          <strong>Debug:</strong> Status: {status} | Items: {safeItems.length} | Filtered: {filtered.length}
        </p>
      </div>

      {/* Search Box */}
      <div className="sticky top-16 z-30 pb-3 pt-3 bg-stone-50">
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
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No dishes found matching your search</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />

              <div className="p-4">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-amber-600 font-extrabold text-lg">
                    ${parseFloat(item.price).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.category_name}
                  </span>
                </div>

                <button
                  className="w-full mt-3 bg-amber-600 text-white font-semibold py-2 rounded-xl active:scale-[.97] transition hover:bg-amber-700"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Button */}
      <a
        href="/cart"
        className="fixed bottom-6 right-5 bg-amber-600 text-white rounded-full w-[60px] h-[60px] flex items-center justify-center shadow-xl hover:bg-amber-700 transition"
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