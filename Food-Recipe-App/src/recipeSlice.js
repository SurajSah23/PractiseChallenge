// src/store/recipeSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  query: '',
  recipes: [],
  loading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },
    setRecipes(state, action) {
      state.recipes = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setQuery, setRecipes, setLoading, setError } = recipeSlice.actions;

export default recipeSlice.reducer;
