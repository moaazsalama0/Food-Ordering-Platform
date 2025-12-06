import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage if exists
const saved = JSON.parse(localStorage.getItem("cart") || "[]");

const initialState = {
  items: saved, // [{ id, name, price, quantity, image, category }]
};

const saveToLocalStorage = (items) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exist = state.items.find((i) => i.id === item.id);

      if (exist) {
        exist.quantity += 1;
      } else {
        state.items.push({ 
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.img,
          category: item.category_name || "Food",
        });
      }

      saveToLocalStorage(state.items);
    },

    updateQty: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item && quantity >= 1) {
        item.quantity = quantity;
      }

      saveToLocalStorage(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveToLocalStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveToLocalStorage([]);
    },
  },
});

export const { addToCart, updateQty, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
