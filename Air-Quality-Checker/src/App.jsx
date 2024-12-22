import { useSelector, useDispatch } from "react-redux";
import { setLocation, fetchAirQuality } from "./airQualitySlice";
import { Search, Wind } from "lucide-react";

const App = () => {
  const dispatch = useDispatch();
  const { location, aqi, loading, error } = useSelector((state) => state.airQuality);

  const handleSearch = () => {
    if (location.trim()) {
      dispatch(fetchAirQuality(location));
    } else {
      alert("Please enter a location.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center p-5">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Air Quality Checker
        </h1>
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={location}
            onChange={(e) => dispatch(setLocation(e.target.value))}
            placeholder="Enter location"
            className="flex-grow py-2 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin border-l-transparent border-4 border-white rounded-full w-4 h-4"></span>
            ) : (
              <>
                <Search size={20} className="mr-2" />
                Search
              </>
            )}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {aqi !== null && (
          <div className="mt-6 text-center">
            <div className="text-xl font-semibold text-gray-800">
              AQI (PM2.5): {aqi.toFixed(2)}
            </div>
            <Wind size={40} className="text-blue-500 mx-auto mt-2" />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
