import { useDispatch, useSelector } from 'react-redux';
import { setQuery, setRecipes, setLoading, setError } from './recipeSlice';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useCallback } from 'react';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full sm:max-w-xs md:max-w-sm lg:max-w-md mx-auto">
      <img
        src={recipe.image}
        alt={recipe.label}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{recipe.label}</h2>
        <p className="text-gray-500 mt-2">Calories: {Math.round(recipe.calories)}</p>
        <div className="mt-3 text-blue-500">
          <a href={recipe.url} target="_blank" rel="noopener noreferrer">
            See full recipe
          </a>
        </div>
      </div>
    </div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    label: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    calories: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

const App = () => {
  const dispatch = useDispatch();
  const { query, recipes, loading, error } = useSelector((state) => state.recipes);

  // Using useCallback to memoize the function so it remains the same on every render
  const fetchRecipes = useCallback(async (searchQuery) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await fetch(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${searchQuery}&app_id=9a963140&app_key=0beeb79d38522c5dca11445bde9f026b`
      );
      const data = await response.json();
      dispatch(setRecipes(data.hits));
    } catch (err) {
      console.error(err);
      dispatch(setError('Failed to fetch recipes. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]); // dependencies to ensure memoization

  useEffect(() => {
    if (query) {
      fetchRecipes(query);
    }
  }, [query, fetchRecipes]); // Added fetchRecipes to the dependency array

  const handleSearch = () => {
    if (query) {
      fetchRecipes(query);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Food Recipe Finder
        </h1>
        <div className="flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            placeholder="Search for a recipe..."
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
              <Search size={20} className="mr-2" />
            )}
            Search
          </button>
        </div>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {recipes.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-start gap-6">
            {recipes.map((recipeItem, index) => (
              <RecipeCard key={index} recipe={recipeItem.recipe} />
            ))}
          </div>
        )}

        {recipes.length === 0 && !loading && !error && (
          <p className="text-center mt-6 text-gray-500">No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default App;
