import { createSlice } from '@reduxjs/toolkit';

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`),
    loading: false,
  },
  reducers: {
    addItems: (state, action) => {
      state.items.push(...action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { addItems, setLoading } = itemsSlice.actions;

export default itemsSlice.reducer;
