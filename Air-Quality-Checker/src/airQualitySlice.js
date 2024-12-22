import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API keys and URLs
const GEO_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const AQI_API_URL = "https://api.openweathermap.org/data/2.5/air_pollution";
const API_KEY = "afbc99db955a3347823752de85e7e55a";

// Thunk for fetching air quality data
export const fetchAirQuality = createAsyncThunk(
  "airQuality/fetchAirQuality",
  async (location, { rejectWithValue }) => {
    try {
      // Fetch coordinates
      const geoResponse = await fetch(`${GEO_API_URL}?q=${location}&appid=${API_KEY}`);
      const geoData = await geoResponse.json();

      if (geoData.cod !== 200) {
        throw new Error(geoData.message || "Location not found");
      }

      const { lat, lon } = geoData.coord;

      // Fetch air quality data
      const aqiResponse = await fetch(`${AQI_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
      const aqiData = await aqiResponse.json();

      if (aqiData.list && aqiData.list.length > 0) {
        return { aqi: aqiData.list[0].components.pm2_5 }; // Returning PM2.5 AQI
      } else {
        throw new Error("Air quality data unavailable");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const airQualitySlice = createSlice({
  name: "airQuality",
  initialState: {
    location: "",
    aqi: null,
    loading: false,
    error: null,
  },
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAirQuality.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.aqi = null;
      })
      .addCase(fetchAirQuality.fulfilled, (state, action) => {
        state.loading = false;
        state.aqi = action.payload.aqi;
        state.error = null;
      })
      .addCase(fetchAirQuality.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.aqi = null;
      });
  },
});

export const { setLocation } = airQualitySlice.actions;
export default airQualitySlice.reducer;
