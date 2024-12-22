import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUsername, setRepos, setError } from './reposSlice';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

// Component to display individual repositories
const RepoItem = ({ repo }) => {
  return (
    <div className="border p-4 rounded-md shadow-sm hover:shadow-lg">
      <h2 className="font-semibold text-lg text-blue-500">{repo.name}</h2>
      <p className="text-sm text-gray-600">{repo.description || 'No description provided.'}</p>
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline text-sm mt-2 block"
      >
        Visit Repository
      </a>
    </div>
  );
};

// PropTypes validation for the repo prop
RepoItem.propTypes = {
  repo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    html_url: PropTypes.string.isRequired,
  }).isRequired,
};

const App = () => {
  const { username, repos, error } = useSelector((state) => state.repos);
  const dispatch = useDispatch();

  // Use useCallback to memoize fetchRepos function
  const fetchRepos = useCallback(async () => {
    try {
      dispatch(setError(''));
      if (!username) return;
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      const data = await response.json();
      dispatch(setRepos(data));
    } catch (err) {
      dispatch(setRepos([]));
      dispatch(setError(err.message));
    }
  }, [dispatch, username]); // Only recreate the function when dispatch or username changes

  useEffect(() => {
    if (username) {
      fetchRepos();
    }
  }, [username, fetchRepos]); // Depend on fetchRepos and username

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">GitHub Repo Viewer</h1>

      <div className="max-w-md mx-auto flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter GitHub Username"
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          value={username}
          onChange={(e) => dispatch(setUsername(e.target.value))}
        />
        <button
          onClick={fetchRepos}
          className="bg-blue-500 text-white p-2 rounded-md flex items-center hover:bg-blue-600"
        >
          <Search className="w-4 h-4" />
          <span className="ml-2">Search</span>
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <RepoItem key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
};

export default App;
