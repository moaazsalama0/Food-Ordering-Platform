import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../services/cartSlice";
import menuReducer from "../services/menuSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    menu: menuReducer,
  },
});

export default store;
