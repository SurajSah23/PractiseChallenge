import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addItems, setLoading } from "./itemsSlice";
import { Loader } from "lucide-react";

const InfiniteScroll = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.items);

  const loadMore = useCallback(() => {
    if (loading) return;
    dispatch(setLoading(true));

    setTimeout(() => {
      const newItems = Array.from({ length: 10 }, (_, i) => `New Item ${items.length + i + 1}`);
      dispatch(addItems(newItems));
      dispatch(setLoading(false));
    }, 1000);
  }, [dispatch, loading, items]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadMore]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="p-4 bg-gray-100 rounded shadow">
            {item}
          </li>
        ))}
      </ul>
      {loading && (
        <div className="flex justify-center mt-4">
          <Loader className="animate-spin text-blue-500" />
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
