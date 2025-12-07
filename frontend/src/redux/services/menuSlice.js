import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Get API URL and ensure no trailing slash
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, '');

export const fetchMenu = createAsyncThunk(
  "menu/fetchMenu",
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'All') {
        params.append('category', filters.category);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.minPrice) {
        params.append('minPrice', filters.minPrice);
      }
      if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice);
      }
      
      const queryString = params.toString();
      // Fix: No leading slash on /menu since API_URL already has /api
      const url = `${API_URL}/menu${queryString ? '?' + queryString : ''}`;
      
      console.log('Fetching menu from:', url);
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        console.error('Response error:', errorData);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      console.log('Menu response:', result);
      
      // Backend returns { success: true, count: 7, data: [...] }
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch menu');
      }
    } catch (error) {
      console.error('Fetch menu error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    loading: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError } = menuSlice.actions;
export default menuSlice.reducer;