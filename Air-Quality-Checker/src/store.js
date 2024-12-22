import { configureStore } from "@reduxjs/toolkit";
import airQualityReducer from "./airQualitySlice";

export const store = configureStore({
  reducer: {
    airQuality: airQualityReducer,
  },
});
