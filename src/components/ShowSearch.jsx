import { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function ShowSearch() {
  const { search, setSearch, showSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if the current path includes "collection"
    setVisible(location.pathname.includes("collection"));
  }, [location]);

  // Only render the search bar if `showSearch` and `visible` are true
  if (!showSearch || !visible) {
    return null;
  }

  return (
    <section className="py-4 pb-7">
      <div className="text-center bg-primary">
        <div className="inline-flex items-center justify-center ring-1 ring-slate-900/5 py-1.5 rounded-full bg-primary overflow-hidden w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search here..."
            className="border-none outline-none w-full bg-primary text-sm px-2"
          />
          <button
            type="button"
            className="bg-primary text-center p-2 cursor-pointer"
          >
            <FaSearch />
          </button>
        </div>
      </div>
    </section>
  );
}

export default ShowSearch;