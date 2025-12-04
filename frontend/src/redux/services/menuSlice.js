import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const API_URL = "http://127.0.0.1:8000/api/dishes/";


export const fetchMenu = createAsyncThunk(
  "menu/fetchMenu",
  async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    return data;
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default menuSlice.reducer;
